// Created by carolsail 

import { ENTITY_STATE_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_TYPE_ENUM, NODE_ZINDEX_ENUM, AUDIO_EFFECT_ENUM } from './../../Enum';
import Entity from "../Entity";
import { EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import SpiderFsm from './SpiderFsm';

export default class Spider extends Entity {
    normalSpeed: number = 0.1
    mushroomSpeed: number = 0.2
    speed: number = this.normalSpeed
    isMoving: boolean = false

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(SpiderFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: 55, height: 44 }, data)
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
    }

    onStepFinished(entity: Entity): void {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.SPIDER:
                if (this.uuid === entity.uuid) {
                    this.speed = this.normalSpeed
                }
                break
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state == ENTITY_STATE_ENUM.DIE || this.state == ENTITY_STATE_ENUM.FALL) return
                const visibleMushroom = this.getVisibleMushroom()
                if (visibleMushroom) {
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_STARTING, this)
                    this.onMovingTarget(visibleMushroom.x, visibleMushroom.y, visibleMushroom.dir, this.mushroomSpeed)
                    return
                }
                // 若猎物出现视野同一直线上则进行攻击
                let isAttacking = false
                const attackItems = DataManager.instance.getAttackItems([this, entity])
                // 桃子作为视线遮挡物（可拾取，不在全局attackItems里）
                const idlePeaches = DataManager.instance.peaches.filter(p => p.state === ENTITY_STATE_ENUM.IDLE)
                idlePeaches.forEach(p => attackItems.push(p))
                // 石块作为视线遮挡物（石块后面的玩家不会被攻击）
                const idleStones = DataManager.instance.stones.filter(s => s.state === ENTITY_STATE_ENUM.IDLE)
                idleStones.forEach(s => attackItems.push(s))
                switch (this.dir) {
                    case ENTITY_DIRECTION_ENUM.DOWN:
                        if (this.x == entity.x && this.y < entity.y) {
                            isAttacking = true
                            // 障碍物
                            const down = attackItems.find(item => (this.x == item.x && this.y < item.y))
                            if (down && (entity.y > down.y)) isAttacking = false
                        }
                        break
                    case ENTITY_DIRECTION_ENUM.UP:
                        if (this.x == entity.x && this.y > entity.y) {
                            isAttacking = true
                            const up = attackItems.find(item => (this.x == item.x && this.y > item.y))
                            if (up && (entity.y < up.y)) isAttacking = false
                        }
                        break
                    case ENTITY_DIRECTION_ENUM.LEFT:
                        if (this.y == entity.y && this.x > entity.x) {
                            isAttacking = true
                            const left = attackItems.find(item => (this.y == item.y && this.x > item.x))
                            if (left && (entity.x < left.x)) isAttacking = false
                        }
                        break
                    case ENTITY_DIRECTION_ENUM.RIGHT:
                        if (this.y == entity.y && this.x < entity.x) {
                            isAttacking = true
                            const right = attackItems.find(item => (this.y == item.y && this.x < item.x))
                            if (right && (entity.x > right.x)) isAttacking = false
                        }
                        break
                }
                if (!isAttacking) return
                if (entity && entity.state != ENTITY_STATE_ENUM.DIE && entity.state != ENTITY_STATE_ENUM.FALL) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.SPIDER_ATTACK)
                    this.state = ENTITY_STATE_ENUM.ATTACK
                    const spider = new cc.Vec2(this.x, this.y)
                    const prey = new cc.Vec2(entity.x, entity.y)
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_SPIDERWEB_GENERATE, { spider, prey })
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, entity, this)
                }
                break
            case ENTITY_TYPE_ENUM.MUSHROOM:
                if (this.state !== ENTITY_STATE_ENUM.DIE && this.state !== ENTITY_STATE_ENUM.FALL) {
                    const target = entity
                    const bait = this.canSeeLineTarget(target.x, target.y, false)
                    if (bait) {
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_STARTING, this)
                        this.onMovingTarget(target.x, target.y, bait.dir, this.mushroomSpeed)
                    }
                }
                break
            case ENTITY_TYPE_ENUM.SKULL_HEAD:
                if (this.state !== ENTITY_STATE_ENUM.DIE && this.state !== ENTITY_STATE_ENUM.FALL) {
                    if (entity.isFalling(entity)) {
                        entity.state = ENTITY_STATE_ENUM.FALL
                        return
                    }
                    // 若skull_head在同一直线上，则移动（沿途有阻碍则不移动）
                    const { x, y } = entity
                    const blockItems = DataManager.instance.getBlockItems([this])
                    let canMove = true
                    let dir = ENTITY_DIRECTION_ENUM.DOWN
                    if (this.x == x) {
                        if (this.y > y) {
                            dir = ENTITY_DIRECTION_ENUM.UP
                            const blockItem = blockItems.find(item => item.x == this.x && item.y < this.y && item.y > y)
                            if (blockItem) canMove = false
                        } else {
                            dir = ENTITY_DIRECTION_ENUM.DOWN
                            const blockItem = blockItems.find(item => item.x == this.x && item.y > this.y && item.y < y)
                            if (blockItem) canMove = false
                        }
                    } else if (this.y == y) {
                        if (this.x > x) {
                            dir = ENTITY_DIRECTION_ENUM.LEFT
                            const blockItem = blockItems.find(item => item.y == this.y && item.x < this.x && item.x > x)
                            if (blockItem) canMove = false
                        } else {
                            dir = ENTITY_DIRECTION_ENUM.RIGHT
                            const blockItem = blockItems.find(item => item.y == this.y && item.x > this.x && item.x < x)
                            if (blockItem) canMove = false
                        }
                    } else {
                        canMove = false
                    }
                    if (canMove) {
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_STARTING, this)
                        this.onMovingTarget(x, y, dir)
                    }
                }
                break
        }
    }

    private getVisibleMushroom() {
        const mushrooms = DataManager.instance.mushrooms.filter(item => item.state === ENTITY_STATE_ENUM.IDLE)
        let target = null
        let min = 99
        mushrooms.forEach(item => {
            const visible = this.canSeeLineTarget(item.x, item.y, false)
            if (!visible) return
            const dis = Math.abs(this.x - item.x) + Math.abs(this.y - item.y)
            if (dis < min) {
                min = dis
                target = { x: item.x, y: item.y, dir: visible.dir }
            }
        })
        return target
    }

    private canSeeLineTarget(x: number, y: number, allowReverse: boolean) {
        const blockItems = DataManager.instance.getBlockItems([this])
        const isBlocked = (dir: ENTITY_DIRECTION_ENUM) => {
            switch (dir) {
                case ENTITY_DIRECTION_ENUM.UP:
                    return blockItems.some(item => item.x == this.x && item.y < this.y && item.y > y)
                case ENTITY_DIRECTION_ENUM.DOWN:
                    return blockItems.some(item => item.x == this.x && item.y > this.y && item.y < y)
                case ENTITY_DIRECTION_ENUM.LEFT:
                    return blockItems.some(item => item.y == this.y && item.x < this.x && item.x > x)
                case ENTITY_DIRECTION_ENUM.RIGHT:
                    return blockItems.some(item => item.y == this.y && item.x > this.x && item.x < x)
            }
        }

        if (this.x == x) {
            if (this.y > y) {
                const dir = ENTITY_DIRECTION_ENUM.UP
                if ((allowReverse || this.dir === dir) && !isBlocked(dir)) return { dir }
            } else if (this.y < y) {
                const dir = ENTITY_DIRECTION_ENUM.DOWN
                if ((allowReverse || this.dir === dir) && !isBlocked(dir)) return { dir }
            }
        } else if (this.y == y) {
            if (this.x > x) {
                const dir = ENTITY_DIRECTION_ENUM.LEFT
                if ((allowReverse || this.dir === dir) && !isBlocked(dir)) return { dir }
            } else if (this.x < x) {
                const dir = ENTITY_DIRECTION_ENUM.RIGHT
                if ((allowReverse || this.dir === dir) && !isBlocked(dir)) return { dir }
            }
        }

        return null
    }

    onMovingTarget(x: number, y: number, dir?: ENTITY_DIRECTION_ENUM, speed: number = this.normalSpeed) {
        this.speed = speed
        super.onMovingTarget(x, y, dir)
    }

    onAttacked(entity: Entity, attacker: Entity) {
        if (this.state == ENTITY_STATE_ENUM.DIE || this.state == ENTITY_STATE_ENUM.FALL) return
        if (this.uuid === entity.uuid) {
            let isAttack = false
            switch (attacker.type) {
                case ENTITY_TYPE_ENUM.PLAYER:
                    if (DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON)) isAttack = true
                    break
                default:
                    isAttack = true
                    break
            }
            if (isAttack) {
                EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.SPIDER_DIE)
                this.state = ENTITY_STATE_ENUM.DIE
                this.node.zIndex = NODE_ZINDEX_ENUM.DEATH
            }
        }
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
    }
}
