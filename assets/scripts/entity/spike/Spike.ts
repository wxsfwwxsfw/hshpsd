// Created by carolsail 

import { TILE_INFO_ENUM } from './../../Enum';
import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import SpikeFsm from "./SpikeFsm";

export default class Spike extends Entity {
    touched_uuid: string = null

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(SpikeFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10, offsetX: 3, offsetY: 9 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity): void {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
            case ENTITY_TYPE_ENUM.BOX:
            case ENTITY_TYPE_ENUM.BEATLE:
            case ENTITY_TYPE_ENUM.SPIDER:
            case ENTITY_TYPE_ENUM.PIG:
            case ENTITY_TYPE_ENUM.SKELETON:
                if (this.state === ENTITY_STATE_ENUM.IDLE) {
                    if (entity && (entity.x == this.x && entity.y == this.y)) {
                        this.touched_uuid = entity.uuid
                    } else {
                        if (this.touched_uuid == entity.uuid) {
                            EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.FLOOR_SPIKE)
                            this.state = ENTITY_STATE_ENUM.ATTACK
                        }
                    }
                } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
                    if (entity && (entity.x == this.x && entity.y == this.y)) {
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, entity, this)
                        this.state = ENTITY_STATE_ENUM.DIE
                    }
                }
                break
        }
    }

    onDestroy() {
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }
}
