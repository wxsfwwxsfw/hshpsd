import { TILE_INFO_ENUM, ENTITY_STATE_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_TYPE_ENUM, NODE_ZINDEX_ENUM, AUDIO_EFFECT_ENUM } from './../../Enum';
// Created by carolsail 

import Entity from "../Entity";
import { EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import PigFsm from './PigFsm';
import DataManager from '../../runtime/DataManager';

export default class Pig extends Entity {
    speed: number = 0.1
    isMoving: boolean = false
    keepMoving: boolean = false

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(PigFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 0.9, height: DataManager.instance.currentLevelTileWidth * 0.9, offsetY: 0 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
    }

    onStepFinished(entity: Entity): void {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state == ENTITY_STATE_ENUM.DIE || this.state == ENTITY_STATE_ENUM.FALL || this.keepMoving) return
                if (this.state == ENTITY_STATE_ENUM.ATTACK) {
                    // 直线冲刺
                    if (this.x == entity.x) {
                        this.dir = this.y - entity.y < 0 ? ENTITY_DIRECTION_ENUM.DOWN : ENTITY_DIRECTION_ENUM.UP
                        this.startMoving()
                    } else if (this.y == entity.y) {
                        this.dir = this.x - entity.x < 0 ? ENTITY_DIRECTION_ENUM.RIGHT : ENTITY_DIRECTION_ENUM.LEFT
                        this.startMoving()
                    }
                } else if (this.state == ENTITY_STATE_ENUM.IDLE) {
                    // 发出警告
                    switch (this.dir) {
                        case ENTITY_DIRECTION_ENUM.LEFT:
                        case ENTITY_DIRECTION_ENUM.RIGHT:
                            if (this.y == entity.y) {
                                const dir = this.x - entity.x < 0 ? ENTITY_DIRECTION_ENUM.RIGHT : ENTITY_DIRECTION_ENUM.LEFT
                                this.onWarning(dir)
                            }
                            break
                        case ENTITY_DIRECTION_ENUM.UP:
                        case ENTITY_DIRECTION_ENUM.DOWN:
                            if (this.x == entity.x) {
                                const dir = this.y - entity.y < 0 ? ENTITY_DIRECTION_ENUM.DOWN : ENTITY_DIRECTION_ENUM.UP
                                this.onWarning(dir)
                            }
                            break
                    }
                }
                break
            case ENTITY_TYPE_ENUM.PIG:
                // 本猪回合
                if (this.state == ENTITY_STATE_ENUM.DIE || this.state == ENTITY_STATE_ENUM.FALL) return
                if (entity.uuid == this.uuid) {
                    if (this.keepMoving) {
                        this.onMoving(this.dir)
                    }
                }
                break
        }
    }

    startMoving() {
        this.keepMoving = true
        this.state = ENTITY_STATE_ENUM.MOVE
        this.onMoving(this.dir)
    }

    stopMoving() {
        this.keepMoving = false
        this.state = ENTITY_STATE_ENUM.IDLE
    }

    onWarning(dir: ENTITY_DIRECTION_ENUM) {
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PIG_NOTICE)
        this.dir = dir
        this.state = ENTITY_STATE_ENUM.ATTACK
    }

    onMoving(dir: ENTITY_DIRECTION_ENUM): void {
        // 当前位置是否已在陷阱内
        if (this.isAttacked()) {
            this.keepMoving = false
            return
        }

        // 碰撞检测
        const attacked = this.isBlocking(dir)
        if (attacked) {
            if (typeof attacked == 'boolean') {
                this.stopMoving()
                return
            }
            if (attacked.type == ENTITY_TYPE_ENUM.DOOR
                || attacked.type == ENTITY_TYPE_ENUM.BOX
                || attacked.type == ENTITY_TYPE_ENUM.WATER
                || attacked.type == ENTITY_TYPE_ENUM.FLOOR_BROKEN
                || attacked.type == ENTITY_TYPE_ENUM.FLOOR_TRAP) {
                this.stopMoving()
                return
            }
            // 发动攻击
            EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, attacked, this)
            // 受伤害停止移动
            if (attacked.type == ENTITY_TYPE_ENUM.SPIKE) {
                this.keepMoving = false
            }
        }

        // 位移
        switch (dir) {
            case ENTITY_DIRECTION_ENUM.LEFT:
                this.targetX -= 1
                this.isMoving = true
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
            case ENTITY_DIRECTION_ENUM.RIGHT:
                this.targetX += 1
                this.isMoving = true
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
            case ENTITY_DIRECTION_ENUM.UP:
                this.targetY -= 1
                this.isMoving = true
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
            case ENTITY_DIRECTION_ENUM.DOWN:
                this.targetY += 1
                this.isMoving = true
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
        }
    }

    isBlocking(dir: ENTITY_DIRECTION_ENUM): boolean | Entity {
        const { targetX: tx, targetY: ty } = this
        const { rows, columns } = DataManager.instance.map
        const { tiles } = DataManager.instance
        // 身体下个移动位置
        let bodyNextX: number = tx
        let bodyNextY: number = ty
        // 输入方向UP
        if (dir == ENTITY_DIRECTION_ENUM.UP) {
            bodyNextX = tx
            bodyNextY = ty - 1
            // 出界
            if (bodyNextY < 0) return true
        }
        // 输入方向RIGHT
        if (dir == ENTITY_DIRECTION_ENUM.RIGHT) {
            bodyNextX = tx + 1
            bodyNextY = ty
            // 出界
            if (bodyNextX > rows - 1) return true
        }
        // 输入方向DOWN
        if (dir == ENTITY_DIRECTION_ENUM.DOWN) {
            bodyNextX = tx
            bodyNextY = ty + 1
            // 出界
            if (bodyNextY > columns - 1) return true
        }
        // 输入方向LEFT
        if (dir == ENTITY_DIRECTION_ENUM.LEFT) {
            bodyNextX = tx - 1
            bodyNextY = ty
            // 出界
            if (bodyNextX < 0) return true
        }

        // 实体碰撞
        const blockItems = DataManager.instance.getBlockItems([this])
        for (let i = 0; i < blockItems.length; i++) {
            const { x: bx, y: by } = blockItems[i]
            if (bx === bodyNextX && by === bodyNextY) return blockItems[i]
        }

        // 伤害陷阱
        const spikes = DataManager.instance.spikes
        for (let i = 0; i < spikes.length; i++) {
            const { x: sx, y: sy } = spikes[i]
            if (sx === bodyNextX && sy === bodyNextY && spikes[i].state == ENTITY_STATE_ENUM.ATTACK) return spikes[i]
        }

        // 与瓦片碰撞
        const bodyNextTile = tiles[bodyNextX]?.[bodyNextY]
        if (!(bodyNextTile && bodyNextTile.move)) return true

        return false
    }

    isAttacked() {
        const spike = DataManager.instance.spikes.find(item => item.x == this.x && item.y == this.y)
        if (spike && spike.state != ENTITY_STATE_ENUM.IDLE) return true
        return false
    }

    onAttacked(attacked: Entity, attacker: Entity): void {
        if (this.uuid == attacked.uuid) {
            if (this.state === ENTITY_STATE_ENUM.DIE || this.state == ENTITY_STATE_ENUM.FALL) return
            switch (attacker.type) {
                case ENTITY_TYPE_ENUM.SPIKE:
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.SPIDER_DIE)
                    this.state = ENTITY_STATE_ENUM.ATTACKED
                    break
            }
        }
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
    }
}
