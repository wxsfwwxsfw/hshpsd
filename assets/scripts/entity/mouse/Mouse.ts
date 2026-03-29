// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import MouseFsm from "./MouseFsm";
import DataManager from "../../runtime/DataManager";
import Player from "../player/Player";

export default class Mouse extends Entity {
    distance: number = 2 // 威胁距离
    speed: number = 0.15
    keepMoving: boolean = false
    isStealing: boolean = false

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(MouseFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        super.init(Object.assign(data, { width: 63, height: 30, offsetY: 3 }))
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity) {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state == ENTITY_STATE_ENUM.DIE) return
                if (this.y == entity.y && Math.abs(this.x - entity.x) == this.distance) {
                    this.keepMoving = true
                    this.state = ENTITY_STATE_ENUM.MOVE
                    this.onMoving(ENTITY_DIRECTION_ENUM.RIGHT)
                }
                break
            case this.type:
                if (this.state == ENTITY_STATE_ENUM.DIE) return
                if (this.keepMoving) this.onMoving(ENTITY_DIRECTION_ENUM.RIGHT)
                break
        }
    }

    onMoving(dir: ENTITY_DIRECTION_ENUM): void {
        // 判断经过玩家
        const player = DataManager.instance.player
        if (this.x >= player.x && !this.isStealing) {
            this.onStealing(ENTITY_TYPE_ENUM.WEAPON)
        }

        // 碰撞检测
        const attacked = this.isBlocking(dir)
        if (attacked) {
            this.keepMoving = false
            this.state = ENTITY_STATE_ENUM.DIE
            return
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

        // 与瓦片碰撞
        const bodyNextTile = tiles[bodyNextX]?.[bodyNextY]
        if (!(bodyNextTile && bodyNextTile.move)) return true

        return false
    }

    onStealing(type: ENTITY_TYPE_ENUM) {
        this.isStealing = true
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_COLLECT)
        EventManager.instance.emit(EVENT_ENUM.INVENTORY_DEL, type)
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
