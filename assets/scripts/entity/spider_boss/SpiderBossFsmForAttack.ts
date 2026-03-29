// Created by carolsail

import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from '../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { FiniteStateMachineSub } from "../../anim/FiniteStateMachineSub";
import FiniteState from '../../anim/FiniteState';

export default class SpiderBossFsmForAttack extends FiniteStateMachineSub {

    constructor(fsm: FiniteStateMachine) {
        super(fsm)
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.LEFT, new FiniteState(fsm, { path: 'spider_boss/spider_boss', mode: cc.WrapMode.Loop, resourceType: RESOURCE_TYPE_ENUM.SPINE, entityState: ENTITY_STATE_ENUM.ATTACK, speed: 1.2 }))

    }

    play(): void {
        this.currentState = this.stateMachines.get(ENTITY_DIRECTION_ENUM.LEFT)
    }
}
