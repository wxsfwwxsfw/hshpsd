// Created by carolsail

import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { FiniteStateMachineSub } from "../../anim/FiniteStateMachineSub";
import FiniteState from '../../anim/FiniteState';
import { getEnumfromEntityDirectionIndex } from '../../Util';

export default class PlayerFsmForIdleWeapon extends FiniteStateMachineSub {

    constructor(fsm: FiniteStateMachine) {
        super(fsm)

        this.stateMachines.set(ENTITY_DIRECTION_ENUM.LEFT, new FiniteState(fsm, { path: 'player/hero', mode: cc.WrapMode.Loop, resourceType: RESOURCE_TYPE_ENUM.SPINE, entityState: ENTITY_STATE_ENUM.IDLE_WEAPON }))
        this.stateMachines.set(ENTITY_DIRECTION_ENUM.RIGHT, new FiniteState(fsm, { path: 'player/hero', mode: cc.WrapMode.Loop, resourceType: RESOURCE_TYPE_ENUM.SPINE, entityState: ENTITY_STATE_ENUM.IDLE_WEAPON, mirror: true }))
    }

    play(): void {
        // 子状态和状态机公用params
        // console.log(this.fsm.params, this.stateMachines)
        const index = this.fsm.params.get(FSM_PARAM_NAME_ENUM.DIRECTION)?.value as number
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
