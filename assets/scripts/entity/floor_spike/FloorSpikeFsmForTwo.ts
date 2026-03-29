// Created by carolsail

import { FLOOR_SPIKE_NUM_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { FiniteStateMachineSub } from "../../anim/FiniteStateMachineSub";
import FiniteState from '../../anim/FiniteState';
import { getFloorSpikeNumEnumFromNum } from '../../Util';

export default class FloorSpikeFsmForTwo extends FiniteStateMachineSub {

    constructor(fsm: FiniteStateMachine){
        super(fsm)
        this.stateMachines.set(FLOOR_SPIKE_NUM_ENUM.ZERO, new FiniteState(fsm, {path: 'floor_spike/two/0'}))
        this.stateMachines.set(FLOOR_SPIKE_NUM_ENUM.ONE, new FiniteState(fsm, {path: 'floor_spike/two/1'}))
        this.stateMachines.set(FLOOR_SPIKE_NUM_ENUM.TWO, new FiniteState(fsm, {path: 'floor_spike/two/2'}))
        this.stateMachines.set(FLOOR_SPIKE_NUM_ENUM.THREE, new FiniteState(fsm, {path: 'floor_spike/two/3'}))
    }

    play(): void {
        const index = this.fsm.params.get(FSM_PARAM_NAME_ENUM.NUM_CURRENT)?.value as number
        this.currentState = this.stateMachines.get(getFloorSpikeNumEnumFromNum(index))
    }
}
