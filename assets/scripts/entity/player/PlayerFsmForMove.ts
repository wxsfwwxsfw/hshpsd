// Created by carolsail

import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { FiniteStateMachineSub } from "../../anim/FiniteStateMachineSub";
import FiniteState from '../../anim/FiniteState';
import { getEnumfromEntityDirectionIndex } from '../../Util';

export default class PlayerFsmForMove extends FiniteStateMachineSub {

    constructor(fsm: FiniteStateMachine) {
        super(fsm)

        this.stateMachines.set(ENTITY_DIRECTION_ENUM.LEFT, new FiniteState(fsm, { path: 'player/hero', mode: cc.WrapMode.Loop, resourceType: RESOURCE_TYPE_ENUM.SPINE, entityState: ENTITY_STATE_ENUM.MOVE }))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.RIGHT, new FiniteState(fsm, { path: 'player/hero', mode: cc.WrapMode.Loop, resourceType: RESOURCE_TYPE_ENUM.SPINE, entityState: ENTITY_STATE_ENUM.MOVE, mirror: true }))
    }

    play(): void {
        const index = this.fsm.params.get(FSM_PARAM_NAME_ENUM.DIRECTION)?.value as number
        // console.log('当前移动方向的索引', index, this.currentState);

        const direction = getEnumfromEntityDirectionIndex(index)
        if (direction == ENTITY_DIRECTION_ENUM.UP || direction == ENTITY_DIRECTION_ENUM.DOWN) {
            if (!this.currentState) {
                this.currentState = this.stateMachines.get(ENTITY_DIRECTION_ENUM.RIGHT)
                return;
            }
            this.currentState = this.currentState
        } else {
            this.currentState = this.stateMachines.get(getEnumfromEntityDirectionIndex(index))
        }
    }
}
