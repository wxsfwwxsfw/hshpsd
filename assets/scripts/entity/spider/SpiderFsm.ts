// Created by carolsail

import { FSM_PARAM_NAME_ENUM, ENTITY_STATE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import FiniteState from '../../anim/FiniteState';
import Spider from './Spider';
import SpiderFsmForIdle from './SpiderFsmForIdle';
import SpiderFsmForMove from './SpiderFsmForMove';
import SpiderFsmForAttack from './SpiderFsmForAttack';

export default class SpiderFsm extends FiniteStateMachine {

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
                case this.stateMachines.get(ENTITY_STATE_ENUM.DIE):
                case this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK):
                case this.stateMachines.get(ENTITY_STATE_ENUM.FALL):
                    if(this.params.get(ENTITY_STATE_ENUM.IDLE).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                    }else if(this.params.get(ENTITY_STATE_ENUM.MOVE).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.MOVE)
                    }else if(this.params.get(ENTITY_STATE_ENUM.DIE).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.DIE)
                    }else if(this.params.get(ENTITY_STATE_ENUM.ATTACK).value){
                        this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
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
            const whiteList = ['move', 'attack']
            const clipName = this.anim.currentClip.name
            if(whiteList.some(item => clipName.includes(item))){
                const spider = this.node.getComponent(Spider)
                spider.state = ENTITY_STATE_ENUM.IDLE
            }
        }, this)
    }

    initParams(){
        this.params.set(FSM_PARAM_NAME_ENUM.DIRECTION, this.createNumberTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.MOVE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACK, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.FALL, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new SpiderFsmForIdle(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.MOVE, new SpiderFsmForMove(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new FiniteState(this, {path: 'spider/die/die'}))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK, new SpiderFsmForAttack(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.FALL, new FiniteState(this, {path:'collect/collect', speed: 1.5}))
    }
}
