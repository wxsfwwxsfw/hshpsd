// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, TILE_INFO_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import FloorTrapSwitchFsm from "./FloorTrapSwitchFsm";
import DataManager from "../../runtime/DataManager";

export default class FloorTrapSwitch extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(FloorTrapSwitchFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 15, height: DataManager.instance.currentLevelTileWidth - 16 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_STARTING, this.onStepStarting, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
    }

    onStepStarting(entity: Entity) {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
            case ENTITY_TYPE_ENUM.BOX:
            case ENTITY_TYPE_ENUM.BEATLE:
            case ENTITY_TYPE_ENUM.SPIDER:
            case ENTITY_TYPE_ENUM.SKULL_HEAD:
            case ENTITY_TYPE_ENUM.PEACH:
            case ENTITY_TYPE_ENUM.MUSHROOM:
                if (entity.x == this.x && entity.y == this.y) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.FLOOR_TRAP)
                    // console.log('释放机关')
                    this.state = ENTITY_STATE_ENUM.IDLE
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, this, entity)
                }
                break
        }
    }

    onStepFinished(entity: Entity) {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
            case ENTITY_TYPE_ENUM.BOX:
            case ENTITY_TYPE_ENUM.BEATLE:
            case ENTITY_TYPE_ENUM.SPIDER:
            case ENTITY_TYPE_ENUM.SKULL_HEAD:
            case ENTITY_TYPE_ENUM.PIG:
            case ENTITY_TYPE_ENUM.PEACH:
            case ENTITY_TYPE_ENUM.MUSHROOM:
                if (this.state == ENTITY_STATE_ENUM.DIE) return
                if (entity.x == this.x && entity.y == this.y) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.FLOOR_TRAP)
                    // console.log('触发机关')
                    this.state = ENTITY_STATE_ENUM.DIE
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, this, entity)
                }
                break
        }
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_STARTING, this.onStepStarting)
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
    }
}
