// Created by carolsail 

import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from './../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import BoxFsm from './BoxFsm';
import EventManager from '../../runtime/EventManager';
import DataManager from '../../runtime/DataManager';

export default class Box extends Entity {
    speed: number = 0.1
    isMoving: boolean = false

    async init(data: IEntity){
        // 动画
        this.fsm = this.node.addComponent(BoxFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: 72, height: 65, offsetX: 2, offsetY: -2 })
        super.init(params)
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
    }

    onAttacked(entity: Entity, attacker: Entity){
        if(this.state === ENTITY_STATE_ENUM.DIE || this.state === ENTITY_STATE_ENUM.FALL) return
        if(this.uuid === entity.uuid){
            const { tiles } = DataManager.instance
            let isMove = false
            let nextX = this.x
            let nextY = this.y
            switch(attacker.dir){
                case ENTITY_DIRECTION_ENUM.UP:
                    nextY = this.y - 1
                break
                case ENTITY_DIRECTION_ENUM.DOWN:
                    nextY = this.y + 1
                break
                case ENTITY_DIRECTION_ENUM.LEFT:
                    nextX = this.x - 1
                break
                case ENTITY_DIRECTION_ENUM.RIGHT:
                    nextX = this.x + 1
                break
            }
            const tile = tiles?.[nextX]?.[nextY]
            if(tile && tile.move){
                const blockItems = DataManager.instance.getBlockItems([this])
                const index = blockItems.findIndex(item=>(item.x == nextX && item.y == nextY))
                if(index == -1) isMove = true
            }
            if(isMove){
                EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_STARTING, this)
                this.onMovingTarget(nextX, nextY, attacker.dir)
            }else{
                EventManager.instance.emit(EVENT_ENUM.EFFECT_SCREEN_SHAKE, attacker.dir)
            }
        }
    }
    
    onDestroy(){
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
