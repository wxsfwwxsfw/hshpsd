import Entity from "../Entity";
import { AUDIO_EFFECT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import EventManager from "../../runtime/EventManager";
import DataManager from "../../runtime/DataManager";
import MushroomFsm from "./MushroomFsm";

export default class Mushroom extends Entity {
    async init(data: IEntity) {
        this.fsm = this.node.addComponent(MushroomFsm)
        await Promise.all([this.fsm.init()])
        const params = Object.assign(data, { width: 50, height: 62, offsetY: -1 })
        super.init(params)
        EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    onStepFinished(entity: Entity) {
        if (!entity) return

        switch (entity.type) {
            case ENTITY_TYPE_ENUM.PLAYER:
                if (this.state !== ENTITY_STATE_ENUM.DIE && entity.x === this.x && entity.y === this.y) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_COLLECT)
                    EventManager.instance.emit(EVENT_ENUM.INVENTORY_ADD, ENTITY_TYPE_ENUM.MUSHROOM)
                    this.state = ENTITY_STATE_ENUM.DIE
                    this.node.active = false
                }
                break
            case ENTITY_TYPE_ENUM.SPIDER:
                if (this.state !== ENTITY_STATE_ENUM.DIE && entity.x === this.x && entity.y === this.y) {
                    this.state = ENTITY_STATE_ENUM.DIE
                    this.node.active = false
                }
                break
        }
    }

    onThrowing(player: Entity) {
        const { tiles, grass } = DataManager.instance
        const blockItems = DataManager.instance.getBlockItems([player])

        let dx = 0
        let dy = 0
        switch (player.dir) {
            case ENTITY_DIRECTION_ENUM.LEFT: dx = -1; break
            case ENTITY_DIRECTION_ENUM.RIGHT: dx = 1; break
            case ENTITY_DIRECTION_ENUM.UP: dy = -1; break
            case ENTITY_DIRECTION_ENUM.DOWN: dy = 1; break
        }

        let finalX = player.x
        let finalY = player.y
        let cx = player.x + dx
        let cy = player.y + dy

        while (true) {
            const tile = tiles?.[cx]?.[cy]
            if (!tile || !tile.move) break

            const hitGrass = grass.find(g => g.state === ENTITY_STATE_ENUM.IDLE && g.x === cx && g.y === cy)
            if (hitGrass) break

            const hitEntity = blockItems.find(e => e.x === cx && e.y === cy)
            if (hitEntity) break

            finalX = cx
            finalY = cy
            cx += dx
            cy += dy
        }

        this.node.active = true
        this.x = this.targetX = finalX
        this.y = this.targetY = finalY
        this.render()
        this.state = ENTITY_STATE_ENUM.IDLE
        EventManager.instance.emit(EVENT_ENUM.INVENTORY_DEL, ENTITY_TYPE_ENUM.MUSHROOM)

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
