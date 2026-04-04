// Created by carolsail 

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import PotFsm from "./PotFsm";

export default class Pot extends Entity {
    async init(data: IEntity){
        // 动画
        this.fsm = this.node.addComponent(PotFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: 70, height: 70 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
    }

    onAttacked(entity: Entity, attacker: Entity){
        if(this.state !== ENTITY_STATE_ENUM.IDLE) return
        if(this.uuid === entity.uuid){
            let isAttack = false
            switch(attacker.type){
                case ENTITY_TYPE_ENUM.PLAYER:
                    if(DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON)) isAttack = true
                break
                default:
                    isAttack = true
                break
            }
            if(isAttack){
                EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.POT_DIE)
                this.state = ENTITY_STATE_ENUM.ATTACKED
            }
        }
    }

    onDestroy(){
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
    }
}
