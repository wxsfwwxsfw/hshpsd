// Created by carolsail

import FiniteState from "../../anim/FiniteState";
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM } from "../../Enum";
import SpiderBoss from "./SpiderBoss";
import SpiderBossFsmForAttack from "./SpiderBossFsmForAttack";
import SpiderBossFsmForIdle from "./SpiderBossFsmForIdle";

export default class SpiderBossFsm extends FiniteStateMachine {

    async init() {
        this.skel = this.addComponent(sp.Skeleton)
        // 注册动画事件
        this.initAnimEvent()
        // 初始化参数列表
        this.initParams()
        // 初始化状态机
        this.initStateMachines()

        await Promise.all(this.promises)
    }

    run(): void {
        const spiderBoss = this.node.getComponent(SpiderBoss)
        switch (this.currentState) {
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK):
                if (this.params.get(ENTITY_STATE_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                } else if (this.params.get(ENTITY_STATE_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
                } else {
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachines.get(spiderBoss.state)
                break
        }
    }

    initAnimEvent() {
        // 监听动画播放完成
        this.skel.setCompleteListener((trackEntry) => {

        })
    }

    initParams() {
        this.params.set(FSM_PARAM_NAME_ENUM.DIRECTION, this.createNumberTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACK, this.createTriggerTypeParam())
    }

    initStateMachines() {
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new SpiderBossFsmForIdle(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK, new SpiderBossFsmForAttack(this))
    }
}
