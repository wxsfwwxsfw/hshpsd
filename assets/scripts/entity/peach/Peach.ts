// Created by carolsail

import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import DataManager from "../../runtime/DataManager";
import PeachFsm from './PeachFsm';

export default class Peach extends Entity {
    async init(data: IEntity) {
        this.fsm = this.node.addComponent(PeachFsm)
        await Promise.all([this.fsm.init()])
        const tile = DataManager.instance.currentLevelTileWidth
        const size = Math.max(34, Math.floor(tile * 0.34))
        const params = Object.assign(data, { width: size, height: size, offsetY: -6 })
        super.init(params)
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity) {
        if (!entity) return
        if (entity.type === ENTITY_TYPE_ENUM.PLAYER) {
            if (this.state !== ENTITY_STATE_ENUM.DIE) {
                if (entity.x === this.x && entity.y === this.y) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_COLLECT)
                    // 存进道具背包
                    EventManager.instance.emit(EVENT_ENUM.INVENTORY_ADD, ENTITY_TYPE_ENUM.PEACH)
                    this.state = ENTITY_STATE_ENUM.DIE
                    // PeachFsm 无 DIE 状态，直接隐藏节点
                    this.node.active = false
                }
            }
        }
    }

    // 投掷桃子：沿玩家方向滑行，遇到草/实体/墙停止，落点直接触发开关
    onThrowing(player: Entity) {
        const { tiles, grass } = DataManager.instance
        const blockItems = DataManager.instance.getBlockItems([player])

        let dx = 0
        let dy = 0
        switch (player.dir) {
            case ENTITY_DIRECTION_ENUM.LEFT:  dx = -1; break
            case ENTITY_DIRECTION_ENUM.RIGHT: dx = 1;  break
            case ENTITY_DIRECTION_ENUM.UP:    dy = -1; break
            case ENTITY_DIRECTION_ENUM.DOWN:  dy = 1;  break
        }

        let finalX = player.x
        let finalY = player.y
        let cx = player.x + dx
        let cy = player.y + dy

        while (true) {
            // 越界或墙格
            const tile = tiles?.[cx]?.[cy]
            if (!tile || !tile.move) break
            // 草挡桃子（人可通行，桃子不可穿越）
            const hitGrass = grass.find(g => g.state === ENTITY_STATE_ENUM.IDLE && g.x === cx && g.y === cy)
            if (hitGrass) break
            // 实体阻挡（石块、门、怪物等）
            const hitEntity = blockItems.find(e => e.x === cx && e.y === cy)
            if (hitEntity) break

            finalX = cx
            finalY = cy
            cx += dx
            cy += dy
        }

        // 桃子移动到落点，重新显示
        this.node.active = true
        this.x = this.targetX = finalX
        this.y = this.targetY = finalY
        this.render()
        this.state = ENTITY_STATE_ENUM.IDLE
        // 扣除背包
        EventManager.instance.emit(EVENT_ENUM.INVENTORY_DEL, ENTITY_TYPE_ENUM.PEACH)

        // 直接检测落点是否有开关，并触发（不依赖事件广播，更可靠）
        const switches = DataManager.instance.floor_trap_switches
        const hitSwitch = switches.find(s => s.state !== ENTITY_STATE_ENUM.DIE && s.x === finalX && s.y === finalY)
        if (hitSwitch) {
            EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.FLOOR_TRAP)
            hitSwitch.state = ENTITY_STATE_ENUM.DIE
            EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, hitSwitch, this)
        }
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished)
    }
}
