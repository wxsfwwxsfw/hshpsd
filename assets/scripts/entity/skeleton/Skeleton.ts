// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, TILE_INFO_ENUM, ENTITY_AI_TYPE, NODE_ZINDEX_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import DataManager from "../../runtime/DataManager";
import SkeletonFsm from "./SkeletonFsm";
import { getEnumfromEntityDirectionIndex, getIndexFromEntityDirectionEnum } from "../../Util";
import AINavigate, { Point } from "../../AINavigate";

export default class Skeleton extends Entity {
    speed: number = 0.1
    isMoving: boolean = false
    private aiType: ENTITY_AI_TYPE = ENTITY_AI_TYPE.MOVE_LINE
    aiFollow: Entity = null

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(SkeletonFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        super.init(Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 1.7, height: DataManager.instance.currentLevelTileWidth * 1.7, offsetY: 20 }))
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)

        this.aiFollow = DataManager.instance.player
    }

    onStepFinished(entity: Entity) {
        if (!entity) return
        if (!this.aiFollow) { this.aiFollow = DataManager.instance.player }
        console.log('onStepFinished', entity, this.aiType)
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state == ENTITY_STATE_ENUM.FALL || this.state == ENTITY_STATE_ENUM.DIE) return
                // 点击移动过快，有可能出现直接相撞，有带武器则攻击，否则被攻击
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
                switch (this.aiType) {
                    case ENTITY_AI_TYPE.MOVE_LINE:
                        this.onMoveLine(this.dir)
                        break
                    case ENTITY_AI_TYPE.MOVE_AROUND:
                        this.onMoveAround(this.dir)
                        break
                    case ENTITY_AI_TYPE.TURN_LINE:
                        this.onTurnLine(this.dir)
                        break
                    case ENTITY_AI_TYPE.TURN_AROUND:
                        this.onTurnAround(this.dir)
                        break
                    case ENTITY_AI_TYPE.MOVE_FOLLOW:
                        this.onMoveFollow()
                        break
                }
                break
        }
    }

    onTurnAround(dir: ENTITY_DIRECTION_ENUM) {
        let index = getIndexFromEntityDirectionEnum(dir)
        index = (index + 1) % 4
        this.dir = getEnumfromEntityDirectionIndex(index)
        const block = this.isBlocking(this.dir)
        if (typeof block != 'boolean' && block.type == ENTITY_TYPE_ENUM.PLAYER) {
            if (block.state !== ENTITY_STATE_ENUM.DIE && block.state !== ENTITY_STATE_ENUM.FALL) {
                // 攻击玩家
                this.state = ENTITY_STATE_ENUM.ATTACK
                EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, block, this)
                return
            }
        }
    }

    onTurnLine(dir: ENTITY_DIRECTION_ENUM) {
        let index = getIndexFromEntityDirectionEnum(dir)
        index = (index + 2) % 4
        this.dir = getEnumfromEntityDirectionIndex(index)
        const block = this.isBlocking(this.dir)
        if (typeof block != 'boolean' && block.type == ENTITY_TYPE_ENUM.PLAYER) {
            if (block.state !== ENTITY_STATE_ENUM.DIE && block.state !== ENTITY_STATE_ENUM.FALL) {
                // 攻击玩家
                this.state = ENTITY_STATE_ENUM.ATTACK
                EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, block, this)
                return
            }
        }
    }

    onMoveAround(dir: ENTITY_DIRECTION_ENUM) {
        const block = this.isBlocking(this.dir)
        if (typeof block != 'boolean' && block.type == ENTITY_TYPE_ENUM.PLAYER) {
            if (block.state !== ENTITY_STATE_ENUM.DIE && block.state !== ENTITY_STATE_ENUM.FALL) {
                // 攻击玩家
                this.state = ENTITY_STATE_ENUM.ATTACK
                EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, block, this)
                return
            }
        } else if (block) {
            // 顺时针转向
            this.onTurnAround(dir)
            return
        }
        // 移动
        this.onMoving(dir)
    }

    onMoveLine(dir: ENTITY_DIRECTION_ENUM) {
        const block = this.isBlocking(this.dir)
        if (typeof block != 'boolean' && block.type == ENTITY_TYPE_ENUM.PLAYER) {
            if (block.state !== ENTITY_STATE_ENUM.DIE && block.state !== ENTITY_STATE_ENUM.FALL) {
                // 攻击玩家
                this.state = ENTITY_STATE_ENUM.ATTACK
                EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, block, this)
                return
            }
        } else if (block) {
            // 顺时针转向
            this.onTurnLine(dir)
            return
        }
        // 移动
        this.onMoving(dir)
    }

    onMoveFollow() {
        if (this.aiFollow) {
            console.log('onMoveFollow', this.aiFollow, this.aiFollow.state)
        }
        if (this.aiFollow && this.aiFollow.state != ENTITY_STATE_ENUM.DIE && this.aiFollow.state != ENTITY_STATE_ENUM.FALL) {


            const { map } = DataManager.instance
            // 拷贝数据
            const points = new Map(map.points)
            // points要去除地图障碍物（door, pot...）
            const blockItems = DataManager.instance.getBlockItems([this.aiFollow, this])
            blockItems.forEach(item => {
                if (!(this.x == item.x && this.y == item.y && this.type == item.type)) {
                    points.delete(item.x + item.y * DataManager.instance.currentLevelTileWidth)
                }
            })
            // 寻路: 起始点, 终点, 线路
            const start_point = new Point(Math.round(this.x), Math.round(this.y))
            const end_point = new Point(Math.round(this.aiFollow.x), Math.round(this.aiFollow.y))
            const size = new cc.Size(DataManager.instance.currentLevelTileWidth, DataManager.instance.currentLevelTileWidth)
            // 获得移动线路
            const route = AINavigate.getRoute(start_point, end_point, points, size)
            // 方向

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
                    this.onMoving(dir)
                } else {
                    // 攻击
                    this.dir = dir
                    this.state = ENTITY_STATE_ENUM.ATTACK
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, this.aiFollow, this)
                }
            }
        }
    }

    onMoving(dir: ENTITY_DIRECTION_ENUM): void {
        // 位移
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

        // 与瓦片碰撞
        const bodyNextTile = tiles[bodyNextX]?.[bodyNextY]
        if (!(bodyNextTile && bodyNextTile.move)) return true

        return false
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
