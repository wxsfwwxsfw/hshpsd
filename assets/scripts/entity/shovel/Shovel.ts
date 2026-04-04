// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import ShovelFsm from "./ShovelFsm";

export default class Shovel extends Entity {

    async init(data: IEntity){
        // 动画
        this.fsm = this.node.addComponent(ShovelFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        super.init(Object.assign(data, { width: 55, height: 55, offsetY: -2 }))
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity){
        if(!entity) return
        switch(entity.type){
            case ENTITY_TYPE_ENUM.PLAYER:
                if(this.state !== ENTITY_STATE_ENUM.DIE){
                    if(entity && (entity.x == this.x && entity.y == this.y)){
                        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_COLLECT)
                        // 存进道具背包
                        EventManager.instance.emit(EVENT_ENUM.INVENTORY_ADD, ENTITY_TYPE_ENUM.SHOVEL)
                        // 修改key状态
                        this.state = ENTITY_STATE_ENUM.DIE
                    }
                }
            break
        }
    }
    
    onDestroy(){
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
