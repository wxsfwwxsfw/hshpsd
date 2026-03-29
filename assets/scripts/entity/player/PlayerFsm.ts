import { EVENT_ENUM, RESOURCE_TYPE_ENUM } from './../../Enum';
// Created by carolsail

import { FSM_PARAM_NAME_ENUM, ENTITY_STATE_ENUM } from './../../Enum';
import { FiniteStateMachine } from "../../anim/FiniteStateMachine";
import PlayerFsmForIdle from './PlayerFsmForIdle';
import PlayerFsmForMove from './PlayerFsmForMove';
import Player from './Player';
import PlayerFsmForMoveWeapon from './PlayerFsmForMoveWeapon';
import PlayerFsmForIdleWeapon from './PlayerFsmForIdleWeapon';
import PlayerFsmForAttack from './PlayerFsmForAttack';
import FiniteState from '../../anim/FiniteState';
import EventManager from '../../runtime/EventManager';

export default class PlayerFsm extends FiniteStateMachine {

    async init() {
        this.skel = this.addComponent(sp.Skeleton)
        // // 注册动画事件
        this.initAnimEvent()
        // 初始化参数列表
        this.initParams()
        // 初始化状态机
        this.initStateMachines()
        // 加载动画
        await Promise.all(this.promises)
    }

    run(): void {
        switch (this.currentState) {
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.IDLE_WEAPON):
            case this.stateMachines.get(ENTITY_STATE_ENUM.MOVE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.MOVE_WEAPON):
            case this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK):
            case this.stateMachines.get(ENTITY_STATE_ENUM.DIE):
            case this.stateMachines.get(ENTITY_STATE_ENUM.FALL):
                if (this.params.get(ENTITY_STATE_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                } else if (this.params.get(ENTITY_STATE_ENUM.IDLE_WEAPON).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE_WEAPON)
                } else if (this.params.get(ENTITY_STATE_ENUM.MOVE).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.MOVE)
                } else if (this.params.get(ENTITY_STATE_ENUM.MOVE_WEAPON).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.MOVE_WEAPON)
                } else if (this.params.get(ENTITY_STATE_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.ATTACK)
                } else if (this.params.get(ENTITY_STATE_ENUM.DIE).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.DIE)
                } else if (this.params.get(ENTITY_STATE_ENUM.FALL).value) {
                    this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.FALL)
                } else {
                    // DIRECTION
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachines.get(ENTITY_STATE_ENUM.IDLE)
                break
        }
    }

    initAnimEvent() {
        // 监听动画播放完成
        this.skel.setCompleteListener((trackEntry) => {
            // console.log('Spine动画播放完成', trackEntry);
            if (trackEntry.animation.name == 'attack') {
                const player = this.node.getComponent(Player)
                console.log('攻击动画播放完成', player)
                player.onAttackAnimEvent()
            }
            if (trackEntry.animation.name == 'run' || trackEntry.animation.name == 'attack') {
                const player = this.node.getComponent(Player)
                const state = player.isWeapon ? ENTITY_STATE_ENUM.IDLE_WEAPON : ENTITY_STATE_ENUM.IDLE
                player.state = state
                if (player.isWeapon) {
                    this.skel.setSkin('wugun');
                    this.skel.setAnimation(0, 'stand', true);
                } else {
                    this.skel.setSkin('gun');
                    this.skel.setAnimation(0, 'stand', true);
                }

            } else if (trackEntry.animation.name == 'die') {
                // 死亡动画重启游戏
                EventManager.instance.emit(EVENT_ENUM.GAME_LEVEL_RESTART)
            }
        });
    }

    initParams() {
        this.params.set(FSM_PARAM_NAME_ENUM.DIRECTION, this.createNumberTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.IDLE_WEAPON, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.MOVE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.MOVE_WEAPON, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.ATTACK, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.DIE, this.createTriggerTypeParam())
        this.params.set(ENTITY_STATE_ENUM.FALL, this.createTriggerTypeParam())
    }

    initStateMachines() {
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE, new PlayerFsmForIdle(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.IDLE_WEAPON, new PlayerFsmForIdleWeapon(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.MOVE, new PlayerFsmForMove(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.MOVE_WEAPON, new PlayerFsmForMoveWeapon(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.ATTACK, new PlayerFsmForAttack(this))
        this.stateMachines.set(ENTITY_STATE_ENUM.DIE, new FiniteState(this, { path: 'player/hero', mode: cc.WrapMode.Loop, resourceType: RESOURCE_TYPE_ENUM.SPINE, entityState: ENTITY_STATE_ENUM.DIE }))
        this.stateMachines.set(ENTITY_STATE_ENUM.FALL, new FiniteState(this, { path: 'collect/collect', speed: 1.5 }))
    }
}
