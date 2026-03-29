// Created by carolsail

import FiniteState from "../../anim/FiniteState";
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { ENTITY_STATE_ENUM, RESOURCE_TYPE_ENUM } from "../../Enum";

export default class SpiderWebFsm extends FiniteStateMachine {

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
        switch(this.currentState){
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
                if(this.params.get(ENTITY_STATE_ENUM.IDLE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                }else {
                    this.currentState = this.currentState
                }
            break
            default:
                this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
            break
        }
    }

    initAnimEvent(){}

    initParams(){
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new FiniteState(this, {path:'spider_web/idle', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
    }
}
