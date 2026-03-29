// Created by carolsail 

import { ISubLevelData } from './../../level/Index';
import Entity from "../Entity";
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import DoorFsm from "./DoorFsm";
import Player from '../player/Player';

export default class Door extends Entity {
    private subLevel: ISubLevelData = null

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(DoorFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        super.init(Object.assign(data, { offsetY: -17 }))
        // 事件
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
        EventManager.instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
    }

    onStepFinished(entity: Entity): void {
        if (!entity) return
        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state === ENTITY_STATE_ENUM.DIE) {
                    if (entity && (entity.x == this.x && entity.y == this.y)) {
                        // 玩家不能移动
                        const player = entity as Player
                        player.canCtrl = false
                        if (this.subLevel) {
                            // 缓存残局
                            EventManager.instance.emit(EVENT_ENUM.GAME_LEVEL_DATA_RECORD, this.subLevel)
                        }
                        EventManager.instance.emit(EVENT_ENUM.GAME_LEVEL_NEXT, this.subLevel)
                    }
                }
                break
        }
    }

    onAttacked(entity: Entity, attacker: Entity) {
        if (this.state !== ENTITY_STATE_ENUM.IDLE) return
        if (this.uuid === entity.uuid) {
            if (attacker.type == ENTITY_TYPE_ENUM.PLAYER && DataManager.instance.hasItem(ENTITY_TYPE_ENUM.KEY)) {
                EventManager.instance.emit(EVENT_ENUM.INVENTORY_DEL, ENTITY_TYPE_ENUM.KEY)
                this.state = ENTITY_STATE_ENUM.DIE
            }
        }
    }

    onOpen(entity: Entity, npc: Entity) {
        if (this.state !== ENTITY_STATE_ENUM.IDLE) return
        if (entity.type == ENTITY_TYPE_ENUM.PLAYER && npc.type == ENTITY_TYPE_ENUM.TREE) {
            this.state = ENTITY_STATE_ENUM.DIE
        }

    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
    }
}
