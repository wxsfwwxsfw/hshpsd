// Created by carolsail

import { ENTITY_STATE_ENUM, EVENT_ENUM, FSM_PARAM_NAME_ENUM, TILE_INFO_ENUM } from './../Enum';
import { FiniteStateMachine } from "../anim/FiniteStateMachine";
import { ENTITY_DIRECTION_ENUM, ENTITY_TYPE_ENUM } from "../Enum";
import { getIndexFromEntityDirectionEnum } from '../Util';
import EventManager from '../runtime/EventManager';
import DataManager from '../runtime/DataManager';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Entity extends cc.Component {
    // 映射地图
    offsetY: number = 0 // 正数为上偏移，负数反之
    offsetX: number = 0 // 正数为右偏移, 负数反之
    mapWidth: number = DataManager.instance.currentLevelTileWidth
    mapHeight: number = DataManager.instance.currentLevelTileWidth
    // 属性
    entityId: string = null
    type: ENTITY_TYPE_ENUM = null
    x: number = 0
    y: number = 0
    width: number = 0
    height: number = 0
    speed: number = 0
    isMoving: boolean = false
    targetX: number = 0
    targetY: number = 0
    // 动画
    fsm: FiniteStateMachine = null
    // 状态
    _dir: ENTITY_DIRECTION_ENUM = ENTITY_DIRECTION_ENUM.DOWN
    _state: ENTITY_STATE_ENUM = ENTITY_STATE_ENUM.IDLE

    init(data: Object) {
        // console.log('Entity init', data);
        // 添加sprite(动画载体, 需要在初始数据之前)
        if (data['type'] != ENTITY_TYPE_ENUM.PLAYER && data['type'] != ENTITY_TYPE_ENUM.SPIDERZ) {
            const sprite: cc.Sprite = this.node.addComponent(cc.Sprite)
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM
        }

        // 初始化数据(触发set方法)
        Object.assign(this, {
            type: ENTITY_TYPE_ENUM.PLAYER,
            width: DataManager.instance.currentLevelTileWidth,
            height: DataManager.instance.currentLevelTileWidth
        }, data)
        this.targetX = this.x
        this.targetY = this.y
        // 渲染
        this.render()
    }

    get dir() {
        return this._dir
    }

    set dir(data: ENTITY_DIRECTION_ENUM) {
        this._dir = data
        this.fsm?.params && this.fsm.setParam(FSM_PARAM_NAME_ENUM.DIRECTION, getIndexFromEntityDirectionEnum(data))
    }

    get state() {
        return this._state
    }

    set state(data: ENTITY_STATE_ENUM) {
        this._state = data
        this.fsm?.params && this.fsm.setParam(this._state, true)
    }

    render(obj: { width?: number, height?: number, offsetX?: number, offsetY?: number } = {}) {
        Object.assign(this, obj)
        this.setSize()
        this.setPos()
    }

    setSize(nw?: number, nh?: number) {
        const w = nw || this.width
        const h = nh || this.height
        this.node.setContentSize(w, h)
    }

    setPos(nx?: number, ny?: number) {
        const tw = DataManager.instance.currentLevelTileWidth
        const x = nx != null ? nx : this.x * tw + (tw - this.width) / 2 + this.offsetX
        const y = ny != null ? ny : this.y * tw * -1 - (tw - this.height) / 2 + this.offsetY
        this.node.setPosition(x, y)
    }

    /**
     * 回合检测
     * @param entity 具体实体
     */
    onStepFinished(entity: Entity) { }

    /**
     * 是否攻击
     * @param dir 攻击方向
     * @param distance 攻击距离
     * @returns 返回实体（攻击承受者）
     */
    isAttacking(dir: ENTITY_DIRECTION_ENUM, distance: number = 1): Entity {
        return null
    }

    /**
     * 发动攻击
     * @param attacker 攻击者
     * @param attacked 攻击承受者
     */
    onAttacking(attacker: Entity, attacked: Entity) { }

    /**
     * 受到攻击
     * @param attacked 攻击承受者
     * @param attacker 攻击者
     */
    onAttacked(attacked: Entity, attacker?: Entity) { }

    /**
     * 是否碰撞
     * @param dir 移动方向
     * @param distance 移动距离
     * @returns 返回实体或布尔值
     */
    isBlocking(dir: ENTITY_DIRECTION_ENUM, distance: number = 1): Entity | boolean {
        return null
    }

    /**
     * 是否为坑
     * @param entity 实体
     * @returns 布尔
     */
    isFalling(entity: Entity): boolean {
        return false
    }

    /**
     * 
     * @param dir 移动方向
     * @param distance 移动距离 
     */
    onMoving(dir: ENTITY_DIRECTION_ENUM, distance: number = 1) { }

    /**
     * 移动到目的地
     * @param x 目的地x
     * @param y 目的地y
     * @param dir 朝向
     */
    onMovingTarget(x: number, y: number, dir?: ENTITY_DIRECTION_ENUM) {
        this.targetX = x
        this.targetY = y
        this.isMoving = true
        this.state = ENTITY_STATE_ENUM.MOVE
        if (dir) {
            this.dir = dir
            EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
        }
    }

    // 执行移动到目标位置并回调
    _move() {
        if (this.targetX > this.x) {
            this.x += this.speed
        } else if (this.targetX < this.x) {
            this.x -= this.speed
        }

        if (this.targetY > this.y) {
            this.y += this.speed
        } else if (this.targetY < this.y) {
            this.y -= this.speed
        }
        if (Math.abs(this.targetX - this.x) <= this.speed && Math.abs(this.targetY - this.y) <= this.speed && this.isMoving) {
            this.x = this.targetX
            this.y = this.targetY
            this.isMoving = false
            EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_FINISHED, this)
        }
    }

    update(dt: number) {
        if (!this.speed) return
        this._move()
        this.setPos()
    }

    onDestroy() { }
}