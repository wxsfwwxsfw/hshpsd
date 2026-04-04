// Created by carolsail 

import Entity from "../Entity";
import { ENTITY_DIRECTION_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, TILE_INFO_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import WaterLilyFsm from "./WaterLilyFsm";
import EventManager from "../../runtime/EventManager";
import Player from "../player/Player";
import DataManager from "../../runtime/DataManager";

export default class WaterLily extends Entity {
    speed: number = 0.1
    keepMoving: boolean = false
    player: Player = null

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(WaterLilyFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: 65, height: 65, offsetY: -1 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity) {
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (entity.x == this.x && entity.y == this.y) {
                    this.player = entity as Player
                    // 荷叶和人物一同移动
                    this.startMoving()
                }
                break
            case ENTITY_TYPE_ENUM.WATER_LILY:
                // 本猪回合
                if (entity.uuid == this.uuid) {
                    if (this.keepMoving) {
                        this.onMoving(this.player.dir)
                    }
                }
                break
        }
    }

    startMoving() {
        this.player.canCtrl = false
        this.keepMoving = true
        const dir = this.player.dir
        this.onMoving(dir)
    }

    stopMoving() {
        this.player.canCtrl = true
        this.keepMoving = false
        // 纠正player位置
        this._resetPosForPlayer()
    }

    onMoving(dir: ENTITY_DIRECTION_ENUM): void {
        // 碰撞检测
        const attacked = this.isBlocking(dir)
        if (attacked) {
            if (typeof attacked == 'boolean' || attacked.type !== ENTITY_TYPE_ENUM.WATER) {
                this.stopMoving()
                return
            }
        }
        // 位移
        switch (dir) {
            case ENTITY_DIRECTION_ENUM.LEFT:
                this.targetX -= 1
                this.isMoving = true
                break
            case ENTITY_DIRECTION_ENUM.RIGHT:
                this.targetX += 1
                this.isMoving = true
                break
            case ENTITY_DIRECTION_ENUM.UP:
                this.targetY -= 1
                this.isMoving = true
                break
            case ENTITY_DIRECTION_ENUM.DOWN:
                this.targetY += 1
                this.isMoving = true
                break
        }
    }

    isBlocking(dir: ENTITY_DIRECTION_ENUM): boolean | Entity {
        const { targetX: tx, targetY: ty } = this
        // 身体下个移动位置
        let bodyNextX: number = tx
        let bodyNextY: number = ty
        // 输入方向UP
        if (dir == ENTITY_DIRECTION_ENUM.UP) {
            bodyNextX = tx
            bodyNextY = ty - 1
        }
        // 输入方向RIGHT
        if (dir == ENTITY_DIRECTION_ENUM.RIGHT) {
            bodyNextX = tx + 1
            bodyNextY = ty
        }
        // 输入方向DOWN
        if (dir == ENTITY_DIRECTION_ENUM.DOWN) {
            bodyNextX = tx
            bodyNextY = ty + 1
        }
        // 输入方向LEFT
        if (dir == ENTITY_DIRECTION_ENUM.LEFT) {
            bodyNextX = tx - 1
            bodyNextY = ty
        }

        const index = DataManager.instance.waters.findIndex(item => bodyNextX == item.x && bodyNextY == item.y)

        return index == -1
    }

    _moveForPlayer() {
        if (this.player) {
            this.player.targetX = this.targetX
            this.player.targetY = this.targetY
            this.player.x = this.x
            this.player.y = this.y
            this.player.setPos()
        }
    }

    _resetPosForPlayer() {
        if (this.player && (Math.abs(this.player.targetX - this.player.x) != 0 || Math.abs(this.player.targetY - this.player.y) != 0)) {
            this._moveForPlayer()
        }
    }

    update(dt: number) {
        super.update(dt)
        if (this.keepMoving) {
            this._moveForPlayer()
        }
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
