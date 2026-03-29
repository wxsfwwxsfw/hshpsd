// Created by carolsail

import FiniteState from "../../anim/FiniteState";
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from "../../Enum";
import Door from "./Door";
import DoorFsmForDie from "./DoorFsmForDie";
import DoorFsmForIdle from "./DoorFsmForIdle";

export default class DoorFsm extends FiniteStateMachine {

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
                this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
            break
        }
    }

    initAnimEvent(){
        this.anim.on(cc.Animation.EventType.FINISHED, ()=>{
            // attacked动画collect播放完毕后自动转为die
            const clipName = this.anim.currentClip.name
            if(clipName.includes('collect')){
                const door =  this.node.getComponent(Door)
                door.state = ENTITY_STATE_ENUM.DIE
            }
        }, this)
    }

    initParams(){
        this.params.set(FSM_PARAM_NAME_ENUM.DIRECTION, this.createNumberTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACKED, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new DoorFsmForIdle(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new DoorFsmForDie(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACKED, new FiniteState(this, {path:'collect/collect', speed: 1.5}))
    }
}
