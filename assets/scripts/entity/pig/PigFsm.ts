import { RESOURCE_TYPE_ENUM } from './../../Enum';
// Created by carolsail

import { FSM_PARAM_NAME_ENUM, ENTITY_STATE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import FiniteState from '../../anim/FiniteState';
import PigFsmForIdle from './PigFsmForIdle';
import PigFsmForMove from './PigFsmForMove';
import PigFsmForAttack from './PigFsmForAttack';
import Pig from './Pig';

export default class PigFsm extends FiniteStateMachine {

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
        if(this.currentState){
            switch(this.currentState){
                case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
                case this.stateMachines.get(ENTITY_STATE_ENUM.MOVE):
                case this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK):
                case this.stateMachines.get(ENTITY_STATE_ENUM.ATTACKED):
                case this.stateMachines.get(ENTITY_STATE_ENUM.DIE):
                case this.stateMachines.get(ENTITY_STATE_ENUM.FALL):
                    if(this.params.get(ENTITY_STATE_ENUM.IDLE).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                    }else if(this.params.get(ENTITY_STATE_ENUM.MOVE).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.MOVE)
                    }else if(this.params.get(ENTITY_STATE_ENUM.ATTACK).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
                    }else if(this.params.get(ENTITY_STATE_ENUM.ATTACKED).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.ATTACKED)
                    }else if(this.params.get(ENTITY_STATE_ENUM.DIE).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.DIE)
                    }else if(this.params.get(ENTITY_STATE_ENUM.FALL).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.FALL)
                    }else{
                        // DIRECTION
                        this.currentState = this.currentState
                    }
                break
            }
        }else{
            this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
        }
    }

    initAnimEvent(){
        this.anim.on(cc.Animation.EventType.FINISHED, ()=>{
            const whiteList = ['bloodfx']
            const clipName = this.anim.currentClip.name
            if(whiteList.some(item => clipName.includes(item))){
                const pig = this.node.getComponent(Pig)
                pig.state = ENTITY_STATE_ENUM.DIE
            }
        }, this)
    }

    initParams(){
        this.params.set(FSM_PARAM_NAME_ENUM.DIRECTION, this.createNumberTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.MOVE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACK, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACKED, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.FALL, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new PigFsmForIdle(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.MOVE, new PigFsmForMove(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK, new PigFsmForAttack(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.FALL, new FiniteState(this, {path:'collect/collect', speed: 1.5}))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACKED, new FiniteState(this, {path:'bloodfx/bloodfx', speed: 2}))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new FiniteState(this, {path:'pig/die', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
    }
}
