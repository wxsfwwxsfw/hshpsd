// Created by carolsail

import { ENTITY_STATE_ENUM, RESOURCE_TYPE_ENUM } from './../Enum';
import { loadSpine, loadSpriteAtlas, loadSpriteFrame, sortBySpriteName } from "../Util"
import { FiniteStateMachine } from "./FiniteStateMachine"

/**
 * 状态
 * 每组动画承载容器
 * 执行动画播放
 */

export const ANIM_SAMPLE = 8
export const ANIM_SPEED = 1

interface IStateParams {
    path: string
    resourceType?: RESOURCE_TYPE_ENUM
    mode?: cc.WrapMode
    speed?: number
    events?: any[]
    entityState?: ENTITY_STATE_ENUM
    mirror?: boolean
}

export default class FiniteState {
    private path: string = ''
    private resourceType: RESOURCE_TYPE_ENUM = RESOURCE_TYPE_ENUM.SPRITE_ATLAS
    private mode: cc.WrapMode = cc.WrapMode.Normal
    private speed: number = ANIM_SPEED
    private events: any[] = []
    private entityState: ENTITY_STATE_ENUM = ENTITY_STATE_ENUM.IDLE
    private mirror: boolean = false

    constructor(private fsm: FiniteStateMachine, params: IStateParams) {
        Object.assign(this, params)
        this.init()
    }

    async init() {
        let clip = null
        if (this.resourceType == RESOURCE_TYPE_ENUM.SPRITE_ATLAS) {
            const promise = loadSpriteAtlas(this.path)
            this.fsm.promises.push(promise)
            const atlas = await promise
            let frames = atlas.getSpriteFrames()
            frames = sortBySpriteName(frames)
            clip = cc.AnimationClip.createWithSpriteFrames(frames, ANIM_SAMPLE)

            clip.name = this.path
            clip.wrapMode = this.mode
            clip.speed = this.speed
            clip.events = this.events
            this.fsm?.anim && this.fsm.anim.addClip(clip)
        } else if (this.resourceType == RESOURCE_TYPE_ENUM.SPRITE_FRAME) {
            const promise = loadSpriteFrame(this.path)
            this.fsm.promises.push(promise)
            const frame = await promise
            clip = cc.AnimationClip.createWithSpriteFrames([frame], ANIM_SAMPLE)

            clip.name = this.path
            clip.wrapMode = this.mode
            clip.speed = this.speed
            clip.events = this.events
            this.fsm?.anim && this.fsm.anim.addClip(clip)
        } else {
            const promise = loadSpine(this.path)
            this.fsm.promises.push(promise)
            const spine = await promise
            if (this.fsm?.skel) {
                this.fsm.skel.skeletonData = spine as sp.SkeletonData
                // console.log('+++++++++++++++++++动画加载成功', spine)
            }
        }
    }

    async play() {
        // if(this.fsm.anim.currentClip?.name == this.path) return
        if (this.resourceType != RESOURCE_TYPE_ENUM.SPINE) {
            this.fsm.anim.play(this.path)
        } else {
            const promise = loadSpine(this.path)
            this.fsm.promises.push(promise)
            const spine = await promise
            this.fsm.skel.timeScale = this.speed
            this.fsm.skel.skeletonData = spine as sp.SkeletonData

            console.log('+++++++++++++++++++播放骨骼动画', this.entityState, this.path, this.fsm.skel)

            if (this.path.includes('player')) {
                this.fsm.node.scaleX = this.mirror ? -1 : 1
                switch (this.entityState) {
                    case ENTITY_STATE_ENUM.IDLE:
                        this.fsm.skel.setSkin('gun')
                        this.fsm.skel.setAnimation(0, 'stand', true);
                        // console.log('+++++++++++++++++++播放骨骼动画', this.fsm.skel)
                        break
                    case ENTITY_STATE_ENUM.IDLE_WEAPON:
                        this.fsm.skel.setSkin('wugun')
                        this.fsm.skel.setAnimation(0, 'stand', true);
                        break
                    case ENTITY_STATE_ENUM.MOVE:
                        this.fsm.skel.setSkin('gun')
                        this.fsm.skel.setAnimation(0, 'run', false);
                        break
                    case ENTITY_STATE_ENUM.MOVE_WEAPON:
                        this.fsm.skel.setSkin('wugun')
                        this.fsm.skel.setAnimation(0, 'run', false);
                        break
                    case ENTITY_STATE_ENUM.DIE:
                        this.fsm.skel.setSkin('gun')
                        this.fsm.skel.setAnimation(0, 'die', false);
                        break
                    case ENTITY_STATE_ENUM.ATTACK:
                        this.fsm.skel.setSkin('wugun')
                        this.fsm.skel.setAnimation(0, 'attack', false);
                        break
                    case ENTITY_STATE_ENUM.ATTACKED:
                        this.fsm.skel.setSkin('wugun')
                        this.fsm.skel.setAnimation(0, 'attack', false);
                        break
                    case ENTITY_STATE_ENUM.FALL:
                        this.fsm.skel.setSkin('gun')
                        this.fsm.skel.setAnimation(0, 'stand', false);
                        break
                    default:
                        break
                }
            } else if (this.path.includes('Spiderz')) {
                // console.log('+++++++++++++++++++播放骨骼动画', this.entityState, this.path, this.fsm.skel)
                this.fsm.promises.push(promise)
                const spine = await promise
                this.fsm.skel.timeScale = this.speed
                this.fsm.skel.skeletonData = spine as sp.SkeletonData
                switch (this.entityState) {
                    case ENTITY_STATE_ENUM.IDLE:
                        this.fsm.skel.setSkin('xue')
                        this.fsm.skel.setAnimation(0, 'idle', true);
                        break
                    case ENTITY_STATE_ENUM.ATTACK:
                        this.fsm.skel.setSkin('xue')
                        this.fsm.skel.setAnimation(0, 'attack', false);
                        break
                    default:
                        break
                }
            }

        }

    }
}   
