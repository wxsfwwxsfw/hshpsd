import { ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from './../../Enum';
// Created by carolsail 

import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import DustFsmForIdle from './DustFsmForIdle';
import Dust from './Dust';
import FiniteState from '../../anim/FiniteState';

export default class DustFsm extends FiniteStateMachine {

    async init(){
        this.anim = this.addComponent(cc.Animation)
        // 注册动画事件
        this.initAnimEvent()
        // 初始化参数列表
        this.initParams()
        // 初始化状态机
        this.initStateMachines()
        // 等待所有异步加载的动画
        await Promise.all(this.promises)
    }

    run(){
        switch(this.currentState){
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.DIE):
                if(this.params.get(ENTITY_STATE_ENUM.IDLE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                }else if(this.params.get(ENTITY_STATE_ENUM.DIE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.DIE)
                }else{
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
            // 灰尘播放idle完成后自动转为die
            const clipName = this.anim.currentClip.name
            if(clipName.includes('idle')){
                this.node.getComponent(Dust).state = ENTITY_STATE_ENUM.DIE
            }
        }, this)
    }

    initParams(){
        this.params.set(FSM_PARAM_NAME_ENUM.DIRECTION, this.createNumberTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new DustFsmForIdle(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new FiniteState(this, {path:'blank/blank', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
    }
}
