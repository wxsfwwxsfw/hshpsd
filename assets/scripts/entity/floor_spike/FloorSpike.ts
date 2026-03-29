// Created by carolsail 

import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import FloorSpikeFsm from './FloorSpikeFsm';
import { AUDIO_EFFECT_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, FSM_PARAM_NAME_ENUM, TILE_INFO_ENUM } from "../../Enum";
import EventManager from "../../runtime/EventManager";
import { getTotalFromFloorSpikeTypeEnum } from "../../Util";
import DataManager from "../../runtime/DataManager";

export default class FloorSpike extends Entity {
    _spikeNumCurrent: number = 0
    _spikeNumTotal: number = 0

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(FloorSpikeFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 4, height: DataManager.instance.currentLevelTileWidth * 4 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth, height: DataManager.instance.currentLevelTileWidth * 1.125, offsetY: 15 })
        super.init(params)
        // 触发setter
        this.current = data.numCurrent || 0
        this.total = getTotalFromFloorSpikeTypeEnum(data.type)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    get current() {
        return this._spikeNumCurrent
    }

    set current(data: number) {
        this._spikeNumCurrent = data
        this.fsm?.params && this.fsm.setParam(FSM_PARAM_NAME_ENUM.NUM_CURRENT, data)
    }

    get total() {
        return this._spikeNumTotal
    }

    set total(data: number) {
        this._spikeNumTotal = data
        this.fsm?.params && this.fsm.setParam(FSM_PARAM_NAME_ENUM.NUM_TOTAL, data)
    }

    onStepFinished(entity: Entity): void {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
            case ENTITY_TYPE_ENUM.SPIDER:
            case ENTITY_TYPE_ENUM.BEATLE:
            case ENTITY_TYPE_ENUM.PIG:
                this.current = this.current == this.total ? 1 : this.current + 1
                // 当player站在trap上面，并且为spike攻击的最后一帧动画，执行攻击
                if (this.x == entity.x && this.y == entity.y && this.current == this.total) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.FLOOR_SPIKE)
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, entity, this)
                }
                break
        }
    }

    onSpikeReset() {
        this.current = 0
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
