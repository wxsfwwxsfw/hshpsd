// Created by carolsail 

import { EVENT_ENUM, SHAKE_DIRECTION_ENUM } from "../Enum";
import EventManager from "../runtime/EventManager";
import { getCurrentTimeStamp } from "../Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShakeManager extends cc.Component {
    // 实现屏幕撞击时候抖动(正弦函数实现 Y = A * Sin(w * x + f))
    private isShaking: boolean = false
    private preShakeTime: number = 0
    private shakePos: cc.Vec2 = cc.Vec2.ZERO
    private shackDir: SHAKE_DIRECTION_ENUM
    private duration: number = 200 // 震动持续
    private a: number = 1.8 // 振幅系数
    private w: number = 12

    onLoad(){
        EventManager.instance.on(EVENT_ENUM.EFFECT_SCREEN_SHAKE, this.onShakeStart, this)
    }

    protected update(dt: number): void {
        if(this.isShaking){
            const seconds = (getCurrentTimeStamp() - this.preShakeTime) / 1000
            const offset = this.a * Math.sin( this.w  * Math.PI * seconds) // 震动偏移量

            switch(this.shackDir){
                case SHAKE_DIRECTION_ENUM.UP:
                    this.node.setPosition(this.shakePos.x, this.shakePos.y - offset)
                break
                case SHAKE_DIRECTION_ENUM.RIGHT:
                    this.node.setPosition(this.shakePos.x + offset, this.shakePos.y)
                break
                case SHAKE_DIRECTION_ENUM.DOWN:
                    this.node.setPosition(this.shakePos.x, this.shakePos.y + offset)
                break
                case SHAKE_DIRECTION_ENUM.LEFT:
                    this.node.setPosition(this.shakePos.x - offset, this.shakePos.y)
                break
            }

            if(seconds > (this.duration / 1000)) {
                this.isShaking = false
                // 抖动结束，重置位置
                this.node.setPosition(this.shakePos)
            }
        }
    }

    onShakeStart(dir: SHAKE_DIRECTION_ENUM){
        if(this.isShaking) return
        this.shackDir = dir
        this.preShakeTime = getCurrentTimeStamp()
        const pos = this.node.position
        this.shakePos = cc.v2(pos.x, pos.y)
        this.isShaking = true
    }

    onShakeStop(){
        this.isShaking = false
    }

    protected onDestroy(): void {
        EventManager.instance.off(EVENT_ENUM.EFFECT_SCREEN_SHAKE, this.onShakeStart)
    }
}
