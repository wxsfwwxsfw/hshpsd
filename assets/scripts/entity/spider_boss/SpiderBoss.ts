// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, TILE_INFO_ENUM, ENTITY_AI_TYPE, NODE_ZINDEX_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import DataManager from "../../runtime/DataManager";
import SpiderBossFsm from "./SpiderBossFsm";

export default class SpiderBoss extends Entity {
    speed: number = 0.1
    isMoving: boolean = false

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(SpiderBossFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        super.init(Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 0.1, height: DataManager.instance.currentLevelTileWidth * 0.1, offsetY: -30 }))
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity) {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (Math.abs(this.x - entity.x) + Math.abs(this.y - entity.y) <= 1) {
                    this.state = ENTITY_STATE_ENUM.ATTACK
                    setTimeout(() => {
                        EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, entity)
                    }, 500);

                }
                break
            default:
                break
        }

    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
