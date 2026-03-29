// Created by carolsail

import FiniteState from "../../anim/FiniteState";
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from "../../Enum";
import Dirtpile from "./Dirtpile";

export default class DirtpileFsm extends FiniteStateMachine {

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
        const dirtpile = this.node.getComponent(Dirtpile)
        switch(this.currentState){
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.DIE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.ATTACKED):
                if(this.params.get(ENTITY_STATE_ENUM.IDLE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                }else if(this.params.get(ENTITY_STATE_ENUM.DIE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.DIE)
                }else if(this.params.get(ENTITY_STATE_ENUM.ATTACKED).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.ATTACKED)
                }else {
                    this.currentState = this.currentState
                }
            break
            default:
                this.currentState = this.stateMachines.get(dirtpile.state)
            break
        }
    }

    initAnimEvent(){
        this.anim.on(cc.Animation.EventType.FINISHED, ()=>{
            const clipName = this.anim.currentClip.name
            if(clipName.includes('collect')){
                const dirtpile =  this.node.getComponent(Dirtpile)
                dirtpile.state = ENTITY_STATE_ENUM.DIE
            }
        }, this)
    }

    initParams(){
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACKED, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new FiniteState(this, {path:'dirtpile/idle', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new FiniteState(this, {path:'dirtpile/die', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACKED, new FiniteState(this, {path:'collect/collect'}))
    }
}
