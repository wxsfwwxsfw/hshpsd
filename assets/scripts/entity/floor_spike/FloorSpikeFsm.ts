// Created by carolsail

import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import { ENTITY_TYPE_ENUM, FSM_PARAM_NAME_ENUM } from "../../Enum";
import { getTotalFromFloorSpikeTypeEnum } from "../../Util";
import FloorSpike from "./FloorSpike";
import FloorSpikeFsmForOne from "./FloorSpikeFsmForOne";
import FloorSpikeFsmForThree from "./FloorSpikeFsmForThree";
import FloorSpikeFsmForTwo from "./FloorSpikeFsmForTwo";

export default class FloorSpikeFsm extends FiniteStateMachine {

    async init() {
        this.anim = this.addComponent(cc.Animation)
        // 注册动画事件
        this.initAnimEvent()
        // 初始化参数列表
        this.initParams()
        // 初始化状态机
        this.initStateMachines()

        await Promise.all(this.promises)
    }

    run(): void {
        const total = this.params.get(FSM_PARAM_NAME_ENUM.NUM_TOTAL)?.value
        switch(this.currentState){
            case this.stateMachines.get(ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.FLOOR_SPIKE_THREE):
                if(getTotalFromFloorSpikeTypeEnum(ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE) == total){
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE)
                }else if(getTotalFromFloorSpikeTypeEnum(ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO) == total){
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO)
                }else if(getTotalFromFloorSpikeTypeEnum(ENTITY_TYPE_ENUM.FLOOR_SPIKE_THREE) == total){
                    this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.FLOOR_SPIKE_THREE)
                }else{
                    this.currentState = this.currentState
                }
            break
            default:
                this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE)
            break
        }
    }

    initAnimEvent(){
        this.anim.on('finished', ()=>{
            const clipName = this.anim.currentClip.name
            const total = this.params.get(FSM_PARAM_NAME_ENUM.NUM_TOTAL)?.value + ''
            if(clipName.includes(total)){
                this.node.getComponent(FloorSpike).onSpikeReset()
            }
        })
    }

    initParams(){
        this.params.set(FSM_PARAM_NAME_ENUM.NUM_CURRENT, this.createNumberTypeParam())
        this.params.set(FSM_PARAM_NAME_ENUM.NUM_TOTAL, this.createNumberTypeParam())
    }

    initStateMachines(){
        this.stateMachines.set(ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, new FloorSpikeFsmForOne(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, new FloorSpikeFsmForTwo(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.FLOOR_SPIKE_THREE, new FloorSpikeFsmForThree(this))
    }
}
