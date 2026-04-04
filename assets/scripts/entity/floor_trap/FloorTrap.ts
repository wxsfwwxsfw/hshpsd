// Created by carolsail 

import Entity from "../Entity";
import { ENTITY_STATE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import FloorTrapFsm from "./FloorTrapFsm";
import DataManager from "../../runtime/DataManager";

export default class FloorTrap extends Entity {
    async init(data: IEntity){
        // 动画
        this.fsm = this.node.addComponent(FloorTrapFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data)
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
    }
    
    onAttacked(entity: Entity){
        if(entity.entityId == this.entityId){
            const state = this.state == ENTITY_STATE_ENUM.IDLE ? ENTITY_STATE_ENUM.ATTACK : ENTITY_STATE_ENUM.IDLE
            this.state = state
            if(this.state == ENTITY_STATE_ENUM.ATTACK){
                const fallItems = DataManager.instance.getFallItems()
                const item = fallItems.find(item=>item.x == this.x && item.y == this.y && item.state != ENTITY_STATE_ENUM.FALL)
                if(item) item.state = ENTITY_STATE_ENUM.FALL
            }
        }
    }
 
    onDestroy(){
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
    }
}