// Created by carolsail

import { ENTITY_DIRECTION_ENUM, FSM_PARAM_NAME_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { FiniteStateMachineSub } from "../../anim/FiniteStateMachineSub";
import FiniteState from '../../anim/FiniteState';
import { getEnumfromEntityDirectionIndex } from '../../Util';

export default class PigFsmForMove extends FiniteStateMachineSub {

    constructor(fsm: FiniteStateMachine){
        super(fsm)
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.UP, new FiniteState(fsm, {path: 'pig/move/up'}))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.DOWN, new FiniteState(fsm, {path: 'pig/move/down'}))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.LEFT, new FiniteState(fsm, {path: 'pig/move/left'}))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.RIGHT, new FiniteState(fsm, {path: 'pig/move/right'}))
    }

    play(): void {
        const index = this.fsm.params.get(FSM_PARAM_NAME_ENUM.DIRECTION)?.value as number
        this.currentState = this.stateMachines.get(getEnumfromEntityDirectionIndex(index))
    }
}
