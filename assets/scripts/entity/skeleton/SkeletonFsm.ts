// Created by carolsail

import FiniteState from "../../anim/FiniteState";
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM } from "../../Enum";
import Skeleton from "./Skeleton";
import SkeletonFsmForAttack from "./SkeletonFsmForAttack";
import SkeletonFsmForIdle from "./SkeletonFsmForIdle";
import SkeletonFsmForMove from "./SkeletonFsmForMove";

export default class SkeletonFsm extends FiniteStateMachine {

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
        const skeleton = this.node.getComponent(Skeleton)
        switch(this.currentState){
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.MOVE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK):
            case this.stateMachines.get(ENTITY_STATE_ENUM.DIE):
                if(this.params.get(ENTITY_STATE_ENUM.IDLE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                }else if(this.params.get(ENTITY_STATE_ENUM.MOVE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.MOVE)
                }else if(this.params.get(ENTITY_STATE_ENUM.ATTACK).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
                }else if(this.params.get(ENTITY_STATE_ENUM.DIE).value){
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.DIE)
                }else {
                    this.currentState = this.currentState
                }
            break
            default:
                this.currentState = this.stateMachines.get(skeleton.state)
            break
        }
    }

    initAnimEvent(){
        this.anim.on(cc.Animation.EventType.FINISHED, ()=>{
            const whiteList = ['move', 'attack']
            const clipName = this.anim.currentClip.name
            if(whiteList.some(item => clipName.includes(item))){
                const skeleton = this.node.getComponent(Skeleton)
                skeleton.state = ENTITY_STATE_ENUM.IDLE
            }
        }, this)
    }

    initParams(){
        this.params.set(FSM_PARAM_NAME_ENUM.DIRECTION, this.createNumberTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.MOVE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACK, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new SkeletonFsmForIdle(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.MOVE, new SkeletonFsmForMove(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK, new SkeletonFsmForAttack(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new FiniteState(this, {path:'skeleton/die/die'}))
    }
}
