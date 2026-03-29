// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import FloorBrokenFsm from "./FloorBrokenFsm";
import DataManager from "../../runtime/DataManager";

export default class FloorBroken extends Entity {
    touched_uuid: string = null

    async init(data: IEntity){
        // 动画
        this.fsm = this.node.addComponent(FloorBrokenFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data)
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity): void {
        if(!entity) return
        switch(entity.type){
            case ENTITY_TYPE_ENUM.PLAYER:
            case ENTITY_TYPE_ENUM.BOX:
            case ENTITY_TYPE_ENUM.BEATLE:
            case ENTITY_TYPE_ENUM.SPIDER:
            case ENTITY_TYPE_ENUM.PIG:
                if(this.state !== ENTITY_STATE_ENUM.DIE){
                    if(entity && (entity.x == this.x && entity.y == this.y)){
                        this.touched_uuid = entity.uuid
                    }else{
                        if(this.touched_uuid == entity.uuid) {
                            EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.FLOOR_BROKEN)
                            this.state = ENTITY_STATE_ENUM.DIE
                            // 判断上面是否有可fall实体，有则fall
                            const item = DataManager.instance.getFallItems().find(item=>item.x == this.x && item.y == this.y)
                            if(item) item.state = ENTITY_STATE_ENUM.FALL
                        }
                    }
                }  
            break
        }
    }
    
    onDestroy(){
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
