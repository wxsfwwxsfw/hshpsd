import { TILE_INFO_ENUM, ENTITY_STATE_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_TYPE_ENUM, NODE_ZINDEX_ENUM, AUDIO_EFFECT_ENUM } from './../../Enum';
// Created by carolsail 

import Entity from "../Entity";
import { EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import BeetleFsm from "./BeetleFsm";
import AINavigate, { Point } from './../../AINavigate';

export default class Beetle extends Entity {
    speed: number = 0.1
    isMoving: boolean = false

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(BeetleFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: 55, height: 44 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
    }

    onStepFinished(entity: Entity): void {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state == ENTITY_STATE_ENUM.DIE || this.state === ENTITY_STATE_ENUM.FALL) return

                const { map } = DataManager.instance

                // 点击移动过快，有可能出现直接相撞，有带武器直接杀死甲虫，否则被杀
                if (entity.x == this.x && entity.y == this.y) {
                    if (DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON)) {
                        entity.state = ENTITY_STATE_ENUM.ATTACK
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, this, entity)
                    } else {
                        this.state = ENTITY_STATE_ENUM.ATTACK
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, entity, this)
                    }
                    return
                }

                // 拷贝数据
                const points = new Map(map.points)
                // points要去除地图障碍物（door, pot...）
                const blockItems = DataManager.instance.getBlockItems([entity, this])
                blockItems.forEach(item => {
                    if (!(this.x == item.x && this.y == item.y && this.type == item.type)) {
                        points.delete(item.x + item.y * DataManager.instance.currentLevelTileWidth)
                    }
                })

                // 寻路: 起始点, 终点, 线路
                const start_point = new Point(Math.round(this.x), Math.round(this.y))
                const end_point = new Point(Math.round(entity.x), Math.round(entity.y))
                const size = new cc.Size(DataManager.instance.currentLevelTileWidth, DataManager.instance.currentLevelTileWidth)

                // 获得beetle移动线路
                const route = AINavigate.getRoute(start_point, end_point, points, size)
                if (route && route[0] && route[1]) {
                    let dir = ENTITY_DIRECTION_ENUM.DOWN
                    if (route[0].x - route[1].x < 0) {
                        dir = ENTITY_DIRECTION_ENUM.RIGHT
                    } else if (route[0].x - route[1].x > 0) {
                        dir = ENTITY_DIRECTION_ENUM.LEFT
                    } else if (route[0].y - route[1].y > 0) {
                        dir = ENTITY_DIRECTION_ENUM.UP
                    }
                    if (route.length >= 3) {
                        // 移动
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_STARTING, this)
                        this.onMoving(dir)
                    } else {
                        // 攻击
                        this.dir = dir
                        this.state = ENTITY_STATE_ENUM.ATTACK
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, entity, this)
                    }
                }
                break
        }
    }

    onMoving(dir: ENTITY_DIRECTION_ENUM): void {
        switch (dir) {
            case ENTITY_DIRECTION_ENUM.LEFT:
                this.targetX -= 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.LEFT
                this.state = ENTITY_STATE_ENUM.MOVE
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
            case ENTITY_DIRECTION_ENUM.RIGHT:
                this.targetX += 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.RIGHT
                this.state = ENTITY_STATE_ENUM.MOVE
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
            case ENTITY_DIRECTION_ENUM.UP:
                this.targetY -= 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.UP
                this.state = ENTITY_STATE_ENUM.MOVE
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
            case ENTITY_DIRECTION_ENUM.DOWN:
                this.targetY += 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.DOWN
                this.state = ENTITY_STATE_ENUM.MOVE
                EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
                break
        }
    }

    onAttacked(entity: Entity, attacker: Entity) {
        if (this.state == ENTITY_STATE_ENUM.DIE || this.state === ENTITY_STATE_ENUM.FALL) return
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
                EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.BEATLE_DIE)
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
