// Created by carolsail

import { ENTITY_DIRECTION_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { FiniteStateMachineSub } from "../../anim/FiniteStateMachineSub";
import FiniteState from '../../anim/FiniteState';
import { getEnumfromEntityDirectionIndex } from '../../Util';

export default class DoorFsmForDie extends FiniteStateMachineSub {

    constructor(fsm: FiniteStateMachine){
        super(fsm)
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.UP, new FiniteState(fsm, {path: 'door/door_open', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.DOWN, new FiniteState(fsm, {path: 'door/door_open', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.LEFT, new FiniteState(fsm, {path: 'door/door_open', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.RIGHT, new FiniteState(fsm, {path: 'door/door_open', resourceType: RESOURCE_TYPE_ENUM.SPRITE_FRAME}))
    }

    play(): void {
        const index = this.fsm.params.get(FSM_PARAM_NAME_ENUM.DIRECTION)?.value as number
        this.currentState = this.stateMachines.get(getEnumfromEntityDirectionIndex(index))
    }
}
