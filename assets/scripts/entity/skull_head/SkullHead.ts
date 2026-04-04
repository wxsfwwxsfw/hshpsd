// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import SkullHeadFsm from "./SkullHeadFsm";

export default class SkullHead extends Entity {
    speed: number = 0.15
    isMoving: boolean = false

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(SkullHeadFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: 50, height: 62, offsetY: -3 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity) {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state !== ENTITY_STATE_ENUM.DIE && this.state !== ENTITY_STATE_ENUM.FALL) {
                    if (entity && (entity.x == this.x && entity.y == this.y)) {
                        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_COLLECT)
                        // 存进道具背包
                        EventManager.instance.emit(EVENT_ENUM.INVENTORY_ADD, ENTITY_TYPE_ENUM.SKULL_HEAD)
                        // 修改key状态
                        this.state = ENTITY_STATE_ENUM.DIE
                    }
                }
                break
            case ENTITY_TYPE_ENUM.SPIDER:
                if (this.state !== ENTITY_STATE_ENUM.DIE && this.state !== ENTITY_STATE_ENUM.FALL) {
                    if (entity && (entity.x == this.x && entity.y == this.y)) {
                        this.state = ENTITY_STATE_ENUM.DIE
                    }
                }
                break
            case ENTITY_TYPE_ENUM.SKULL_HEAD:
                if (this.state !== ENTITY_STATE_ENUM.DIE && this.state !== ENTITY_STATE_ENUM.FALL) {
                    if (this.isFalling(entity)) entity.state = ENTITY_STATE_ENUM.FALL
                }
                break

        }
    }

    // 落点
    isFalling(entity: Entity) {
        const blockItem = DataManager.instance.getBlockItemsWithEmpty().find(item => entity.x == item.x && entity.y == item.y)
        if (blockItem) {
            if (blockItem.type == ENTITY_TYPE_ENUM.WATER) {
                return true
            } else {
                if (blockItem.state == ENTITY_STATE_ENUM.DIE) return true
            }
        }
        return false
    }

    // 计算直线落点
    onThrowing(player: Entity) {
        // 计算落点位置
        const { map } = DataManager.instance
        let x = player.x
        let y = player.y
        const attackItems = DataManager.instance.getAttackItems([player])
        let targetItem = null
        switch (player.dir) {
            case ENTITY_DIRECTION_ENUM.UP:
                {
                    // 最临近障碍物
                    let min = 99
                    attackItems.forEach(item => {
                        if (item.y < player.y && item.x == player.x) {
                            const dis = Math.abs(player.y - item.y)
                            if (dis < min) {
                                min = dis
                                targetItem = item
                            }
                        }
                    })
                    if (targetItem) {
                        y = targetItem.y + 1
                    } else {
                        y = 0 + 1
                    }
                }
                break
            case ENTITY_DIRECTION_ENUM.DOWN:
                {
                    // 最临近障碍物
                    let min = 99
                    attackItems.forEach(item => {
                        if (item.y > player.y && item.x == player.x) {
                            const dis = Math.abs(player.y - item.y)
                            if (dis < min) {
                                min = dis
                                targetItem = item
                            }
                        }
                    })
                    if (targetItem) {
                        y = targetItem.y - 1
                    } else {
                        y = map.columns - 2
                    }
                }
                break
            case ENTITY_DIRECTION_ENUM.LEFT:
                {
                    let min = 99
                    attackItems.forEach(item => {
                        if (item.x < player.x && item.y == player.y) {
                            const dis = Math.abs(player.x - item.x)
                            if (dis < min) {
                                min = dis
                                targetItem = item
                            }
                        }
                    })
                    if (targetItem) {
                        x = targetItem.x + 1
                    } else {
                        x = 0 + 1
                    }
                }
                break
            case ENTITY_DIRECTION_ENUM.RIGHT:
                {
                    let min = 99
                    attackItems.forEach(item => {
                        if (item.x > player.x && item.y == player.y) {
                            const dis = Math.abs(player.x - item.x)
                            if (dis < min) {
                                min = dis
                                targetItem = item
                            }
                        }
                    })
                    if (targetItem) {
                        x = targetItem.x - 1
                    } else {
                        x = map.rows - 2
                    }
                }
                break
        }
        this.x = this.targetX = player.x
        this.y = this.targetY = player.y
        // 扣道具
        EventManager.instance.emit(EVENT_ENUM.INVENTORY_DEL, ENTITY_TYPE_ENUM.SKULL_HEAD)
        this.onMovingTarget(x, y)
    }

    // 重载方法
    onMovingTarget(x: number, y: number): void {
        this.targetX = x
        this.targetY = y
        this.isMoving = true
        this.state = ENTITY_STATE_ENUM.IDLE
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
