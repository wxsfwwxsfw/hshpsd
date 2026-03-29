// Created by carolsail

import FiniteState from "./FiniteState"
import { FiniteStateMachine } from "./FiniteStateMachine"

// 子状态机公用状态机参数
export abstract class FiniteStateMachineSub {

    // 状态机列表
    stateMachines: Map<string, FiniteState> = new Map()
    // 当前状态
    private _currentState: FiniteState = null

    constructor(protected fsm: FiniteStateMachine){}

    get currentState(){
        return this._currentState
    }

    set currentState(state: FiniteState){
        this._currentState = state
        this._currentState.play()
    }

    abstract play(): void;
}
