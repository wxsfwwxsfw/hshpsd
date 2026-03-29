// Created by carolsail

import FiniteState from "../../anim/FiniteState";
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { ENTITY_STATE_ENUM, RESOURCE_TYPE_ENUM } from "../../Enum";
import Key from "./Key";

export default class KeyFsm extends FiniteStateMachine {

    async init() {
        this.anim = this.addComponent(cc.Animation)
        // 注册动画事件
        this.initAnimEvent()
        // 初始化参数列表
        this.initParams()
        // 初始化状态机
        this.initStateMachines()

        await Promise.all(this.promises)
    }

    run(): void {
        const key = this.node.getComponent(Key)
        switch(this.currentState){
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.DIE):
                if(this.params.get(ENTITY_STATE_ENUM.IDLE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                }else if(this.params.get(ENTITY_STATE_ENUM.DIE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.DIE)
                }else {
                    this.currentState = this.currentState
                }
            break
            default:
                this.currentState = this.stateMachines.get(key.state)
            break
        }
    }

    initAnimEvent(){}

    initParams(){
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new FiniteState(this, {path:'key/idle', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new FiniteState(this, {path:'blank/blank', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
    }
}
