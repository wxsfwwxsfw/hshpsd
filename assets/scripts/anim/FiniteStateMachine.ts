// Created by carolsail

import { FSM_PARAM_TYPE_ENUM } from './../Enum';
import FiniteState from './FiniteState';
import { FiniteStateMachineSub } from './FiniteStateMachineSub';

/***
 * 流动图
 * 1.entity的state或者direction改变触发setter
 * 2.setter里触发fsm的setParam方法
 * 3.setParam执行run方法（run方法由子类重写）
 * 4.run方法会更改currentState，然后触发currentState的setter
 * 5-1.如果currentState是子状态机，执行他的play方法，play方法又会设置子状态机的currentState，触发子状态play方法播放动画
 * 5-2.如果是子状态，执行他的play方法直接播放动画
 */
const { ccclass, property } = cc._decorator;

type FsmParamValueType = boolean | number

type FsmStateType = FiniteState | FiniteStateMachineSub

export interface IFsmParam {
    type: FSM_PARAM_TYPE_ENUM,
    value: FsmParamValueType
}

@ccclass
export abstract class FiniteStateMachine extends cc.Component {
    // 异步promise数组列表
    promises: Array<Promise<any>> = []
    // 动画组件
    anim: cc.Animation = null
    //骨骼动画组件
    skel: sp.Skeleton = null
    // 参数列表
    params: Map<string, IFsmParam> = new Map()
    // 状态机列表
    stateMachines: Map<string, FsmStateType> = new Map()
    // 当前状态
    private _currentState: FsmStateType = null

    getParam(name: string) {
        if (this.params.has(name)) return this.params.get(name)?.value
    }

    setParam(name: string, value: FsmParamValueType) {
        if (this.params.has(name)) {
            this.params.get(name).value = value
            this.run()
            this.resetTriggerStatus()
        }
    }

    get currentState() {
        return this._currentState
    }

    set currentState(state: FsmStateType) {
        this._currentState = state
        this._currentState.play()
    }

    // 重置trigger
    resetTriggerStatus() {
        this.params.forEach((item, _) => {
            if (item.type == FSM_PARAM_TYPE_ENUM.TRIGGER) item.value = false
        })
    }

    // 创建
    createTriggerTypeParam(value: boolean = false) {
        return { type: FSM_PARAM_TYPE_ENUM.TRIGGER, value }
    }

    createNumberTypeParam(value: number = 0) {
        return { type: FSM_PARAM_TYPE_ENUM.NUMBER, value }
    }

    abstract init(): void

    abstract run(): void
}
