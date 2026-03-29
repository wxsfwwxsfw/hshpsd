// Created by carolsail

import { FLOOR_SPIKE_NUM_ENUM, FSM_PARAM_NAME_ENUM, RESOURCE_TYPE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { FiniteStateMachineSub } from "../../anim/FiniteStateMachineSub";
import FiniteState from '../../anim/FiniteState';
import { getFloorSpikeNumEnumFromNum } from '../../Util';

export default class FloorSpikeFsmForOne extends FiniteStateMachineSub {

    constructor(fsm: FiniteStateMachine){
        super(fsm)
        this.stateMachines.set(FLOOR_SPIKE_NUM_ENUM.ZERO, new FiniteState(fsm, {path: 'floor_spike/one/0'}))
        this.stateMachines.set(FLOOR_SPIKE_NUM_ENUM.ONE, new FiniteState(fsm, {path: 'floor_spike/one/1'}))
        this.stateMachines.set(FLOOR_SPIKE_NUM_ENUM.TWO, new FiniteState(fsm, {path: 'floor_spike/one/2'}))
    }

    play(): void {
        const index = this.fsm.params.get(FSM_PARAM_NAME_ENUM.NUM_CURRENT)?.value as number
        this.currentState = this.stateMachines.get(getFloorSpikeNumEnumFromNum(index))
    }
}
