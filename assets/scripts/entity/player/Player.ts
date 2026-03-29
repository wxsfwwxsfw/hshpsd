import { AUDIO_EFFECT_ENUM } from './../../Enum';
// Created by carolsail

import { INPUT_PROCESS_ENUM, EVENT_ENUM, TILE_INFO_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, SHAKE_DIRECTION_ENUM } from './../../Enum';
import Entity from "../Entity";
import PlayerFsm from './PlayerFsm';
import EventManager from '../../runtime/EventManager';
import { IEntity } from '../../level/Index';
import DataManager from '../../runtime/DataManager';
import { getEntityDirectionEnumFromInputProcessEnum, showChatDialog, showToast } from '../../Util';
import Pig from '../pig/Pig';

export default class Player extends Entity {
    speed: number = 0.1
    isMoving: boolean = false
    canCtrl: boolean = true
    _isWeapon: boolean = false

    async init(data: IEntity) {

        // 加入动画
        this.fsm = this.node.addComponent(PlayerFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // let params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 1.2, height: DataManager.instance.currentLevelTileWidth * 1.2, offsetY: 20 })
        let params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 0.1, height: DataManager.instance.currentLevelTileWidth * 0.1, offsetY: -30 })
        super.init(params)
        // console.log('+++++++++++++++++++player初始化完成+++++++++++++++++++++', this.node)

        // 绑定事件
        EventManager.instance.on(EVENT_ENUM.GAME_CTRL_INPUT, this.onInputProcess, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked, this)
        EventManager.instance.on(EVENT_ENUM.INVENTORY_TOUCH, this.onInventoryTouch, this)
        // EventManager.instance.on(EVENT_ENUM.SPIDERZ_ATTACK, this.attackedBySpiderz, this)
    }

    // 道具背包中是否有武器
    get isWeapon() {
        return DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON)
    }

    // 控制指令
    onInputProcess(input: INPUT_PROCESS_ENUM) {
        // console.log('玩家控制指令', this.isMoving, this.speed, this.canCtrl)
        if (this.isMoving || this.speed === 0 || !this.canCtrl) return

        // 影响移动手感
        // if(this.state == ENTITY_STATE_ENUM.MOVE || this.state == ENTITY_STATE_ENUM.MOVE_WEAPON) return

        // console.log('玩家控制指令', this.state)
        if (this.state == ENTITY_STATE_ENUM.DIE || this.state == ENTITY_STATE_ENUM.FALL || this.state == ENTITY_STATE_ENUM.ATTACK) return

        // 输入方向转人物方向
        let dir = getEntityDirectionEnumFromInputProcessEnum(input)

        // 攻击检测
        const attacked: Entity = this.isAttacking(dir)
        // console.log('是否攻击', attacked)
        if (attacked) {
            this.dir = dir
            this.onAttacking(this, attacked)
            return
        }

        // 碰撞检测
        const blocked = this.isBlocking(dir)
        console.log('是否碰撞', blocked)
        if (blocked) {
            if (typeof blocked == 'boolean') {
                EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_MOVE_BLOCK)
                this._shack(dir)
                return
            } else {
                this.dir = dir
                if (blocked.type == ENTITY_TYPE_ENUM.TREE || blocked.type == ENTITY_TYPE_ENUM.DEAD_BODY) {
                    showChatDialog(blocked)
                }
                if (blocked.type == ENTITY_TYPE_ENUM.TREE) {
                    EventManager.instance.emit(EVENT_ENUM.DOOR_OPEN, this, blocked)
                }
                if (!this.isWaterLily(blocked)) return
            }
        }

        // 移动
        EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_STARTING, this)
        this.onMoving(dir)
    }

    // 是否攻击
    isAttacking(dir: ENTITY_DIRECTION_ENUM): Entity {
        const items = DataManager.instance.getAttackItems([this])
        for (let i = 0; i < items.length; i++) {
            const { x, y } = items[i]
            let attack: boolean = false
            switch (dir) {
                case ENTITY_DIRECTION_ENUM.UP:
                    if (this.x == x && this.y - 1 == y) attack = true
                    break
                case ENTITY_DIRECTION_ENUM.RIGHT:
                    if (this.x + 1 == x && this.y == y) attack = true
                    break
                case ENTITY_DIRECTION_ENUM.DOWN:
                    if (this.x == x && this.y + 1 == y) attack = true
                    break
                case ENTITY_DIRECTION_ENUM.LEFT:
                    if (this.x - 1 == x && this.y == y) attack = true
                    break
            }
            if (attack) return items[i]
        }
        return null
    }

    // 发动攻击
    onAttacking(attacker: Entity, attacked: Entity) {
        console.log('发动攻击', attacker, attacked)
        let dir = ENTITY_DIRECTION_ENUM.DOWN
        if (this.dir == ENTITY_DIRECTION_ENUM.DOWN) dir = ENTITY_DIRECTION_ENUM.UP
        if (this.dir == ENTITY_DIRECTION_ENUM.LEFT) dir = ENTITY_DIRECTION_ENUM.RIGHT
        if (this.dir == ENTITY_DIRECTION_ENUM.RIGHT) dir = ENTITY_DIRECTION_ENUM.LEFT
        switch (attacked.type) {
            case ENTITY_TYPE_ENUM.DOOR:
                if (DataManager.instance.hasItem(ENTITY_TYPE_ENUM.KEY)) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_ATTACK)
                    this.state = ENTITY_STATE_ENUM.ATTACK
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, attacked, this)
                } else {
                    showToast('似有尘缘未了……')
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_MOVE_BLOCK)
                    this._shack(attacker.dir)
                }
                break
            case ENTITY_TYPE_ENUM.BOX:
                EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.BOX_MOVE)
                // 带武器与否都能推动箱子
                this.state = this.isWeapon ? ENTITY_STATE_ENUM.MOVE_WEAPON : ENTITY_STATE_ENUM.MOVE
                EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, attacked, this)
                // 结束回合
                EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_FINISHED, this)
                break
            case ENTITY_TYPE_ENUM.PIG:
                this.state = this.isWeapon ? ENTITY_STATE_ENUM.MOVE_WEAPON : ENTITY_STATE_ENUM.MOVE
                const pig = attacked as Pig
                pig.onWarning(dir)
                break
            case ENTITY_TYPE_ENUM.DIRTPILE:
                if (DataManager.instance.hasItem(ENTITY_TYPE_ENUM.SHOVEL)) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_ATTACK)
                    this.state = ENTITY_STATE_ENUM.ATTACK
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, attacked, this)
                } else {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_MOVE_BLOCK)
                    this._shack(attacker.dir)
                }
                break
            case ENTITY_TYPE_ENUM.BEATLE:
            case ENTITY_TYPE_ENUM.SKELETON:
                if (DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON)) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_ATTACK)
                    this.state = ENTITY_STATE_ENUM.ATTACK
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, attacked, this)
                } else {
                    attacked.dir = dir
                    attacked.state = ENTITY_STATE_ENUM.ATTACK
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, this, attacked)
                }
                break
            default:
                if (DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON)) {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_ATTACK)
                    this.state = ENTITY_STATE_ENUM.ATTACK
                    EventManager.instance.emit(EVENT_ENUM.ENTITY_ATTACKED, attacked, this)
                } else {
                    EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_MOVE_BLOCK)
                    this._shack(attacker.dir)
                }
                break
        }
    }

    // 受到攻击
    onAttacked(entity: Entity) {
        if (this.state === ENTITY_STATE_ENUM.DIE || this.state == ENTITY_STATE_ENUM.FALL) return
        if (this.uuid === entity.uuid) {
            EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_DIE)
            this.state = ENTITY_STATE_ENUM.DIE
        }
    }

    // attackedBySpiderz() {
    //     EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_DIE)
    //     this.state = ENTITY_STATE_ENUM.DIE
    // }

    // 使用背包道具
    onInventoryTouch(type: ENTITY_TYPE_ENUM) {
        const attacked: Entity = this.isAttacking(this.dir)
        switch (type) {
            case ENTITY_TYPE_ENUM.SKULL_HEAD:
            case ENTITY_TYPE_ENUM.BOMB:
                this._throwing(type)
                break
            case ENTITY_TYPE_ENUM.KEY:
                if (attacked && attacked.type === ENTITY_TYPE_ENUM.DOOR) {
                    this.onAttacking(this, attacked)
                }
                break
            case ENTITY_TYPE_ENUM.SHOVEL:
                if (attacked && attacked.type === ENTITY_TYPE_ENUM.DIRTPILE) {
                    this.onAttacking(this, attacked)
                }
                break
            case ENTITY_TYPE_ENUM.WEAPON:
                if (attacked && attacked.type !== ENTITY_TYPE_ENUM.DOOR && attacked.type != ENTITY_TYPE_ENUM.DIRTPILE) {
                    this.onAttacking(this, attacked)
                }
                break
        }
    }

    // 是否碰撞
    isBlocking(dir: ENTITY_DIRECTION_ENUM): boolean | Entity {
        const { targetX: tx, targetY: ty } = this
        const { rows, columns } = DataManager.instance.map
        const { tiles } = DataManager.instance
        // 身体下个移动位置
        let bodyNextX: number = tx
        let bodyNextY: number = ty
        // console.log('下个移动位置坐标', tx, ty, rows, columns, dir)
        // 输入方向UP
        if (dir == ENTITY_DIRECTION_ENUM.UP) {
            bodyNextX = tx
            bodyNextY = ty - 1
            // 出界
            if (bodyNextY < 0) return true
            // if (bodyNextY < 2) return true
        }
        // 输入方向RIGHT
        if (dir == ENTITY_DIRECTION_ENUM.RIGHT) {
            bodyNextX = tx + 1
            bodyNextY = ty
            // 出界
            if (bodyNextX > rows - 1) return true
            // if (bodyNextX > rows) return true
        }
        // 输入方向DOWN
        if (dir == ENTITY_DIRECTION_ENUM.DOWN) {
            bodyNextX = tx
            bodyNextY = ty + 1
            // 出界
            if (bodyNextY > columns - 1) return true
            // if (bodyNextY > columns) return true
        }
        // 输入方向LEFT
        if (dir == ENTITY_DIRECTION_ENUM.LEFT) {
            bodyNextX = tx - 1
            bodyNextY = ty
            // 出界
            if (bodyNextX < 0) return true
            // if (bodyNextX < 1) return true
        }

        // 实体碰撞
        const blockItems = DataManager.instance.getBlockItemsWithEmpty()
        console.log('player检测实体碰撞', blockItems)
        for (let i = 0; i < blockItems.length; i++) {
            const { x: bx, y: by } = blockItems[i]
            if (bx === bodyNextX && by === bodyNextY) return blockItems[i]
        }

        // 与瓦片碰撞
        const bodyNextTile = tiles[bodyNextX]?.[bodyNextY]
        if (!(bodyNextTile && bodyNextTile.move)) return true

        return false
    }

    isWaterLily(entity: Entity) {
        if (entity.type === ENTITY_TYPE_ENUM.WATER) {
            const { water_lilies } = DataManager.instance
            const index = water_lilies.findIndex(lily => lily.x == entity.x && lily.y == entity.y)
            return index > -1
        }
        return false
    }

    // 移动
    onMoving(dir: ENTITY_DIRECTION_ENUM): void {
        switch (dir) {
            case ENTITY_DIRECTION_ENUM.LEFT:
                this.targetX -= 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.LEFT
                this.state = this.isWeapon ? ENTITY_STATE_ENUM.MOVE_WEAPON : ENTITY_STATE_ENUM.MOVE
                // this._dust(ENTITY_DIRECTION_ENUM.LEFT)
                break
            case ENTITY_DIRECTION_ENUM.RIGHT:
                this.targetX += 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.RIGHT
                this.state = this.isWeapon ? ENTITY_STATE_ENUM.MOVE_WEAPON : ENTITY_STATE_ENUM.MOVE
                // this._dust(ENTITY_DIRECTION_ENUM.RIGHT)
                break
            case ENTITY_DIRECTION_ENUM.UP:
                this.targetY -= 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.UP
                // this.dir = this.dir
                this.state = this.isWeapon ? ENTITY_STATE_ENUM.MOVE_WEAPON : ENTITY_STATE_ENUM.MOVE
                // this._dust(ENTITY_DIRECTION_ENUM.UP)
                break
            case ENTITY_DIRECTION_ENUM.DOWN:
                this.targetY += 1
                this.isMoving = true
                this.dir = ENTITY_DIRECTION_ENUM.DOWN
                this.state = this.isWeapon ? ENTITY_STATE_ENUM.MOVE_WEAPON : ENTITY_STATE_ENUM.MOVE
                // this._dust(ENTITY_DIRECTION_ENUM.DOWN)
                break
        }
    }

    // 动画事件
    onAttackAnimEvent() {
        EventManager.instance.emit(EVENT_ENUM.ENTITY_STEP_FINISHED, this)
    }

    // 投掷道具
    _throwing(type: ENTITY_TYPE_ENUM) {
        // 获取道具实体
        let throw_item = null
        if (type == ENTITY_TYPE_ENUM.SKULL_HEAD) {
            throw_item = DataManager.instance.skull_heads.find(item => item.state == ENTITY_STATE_ENUM.DIE)
        } else if (type == ENTITY_TYPE_ENUM.BOMB) {
            throw_item = DataManager.instance.bombs.find(item => item.state == ENTITY_STATE_ENUM.DIE)
        }
        if (throw_item) {
            // 播放声音
            EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.PLAYER_THROW)
            // 播放动画
            this.state = ENTITY_STATE_ENUM.ATTACK
            // 执行动作
            throw_item.onThrowing(this)
        }
    }

    // 抖动屏幕
    _shack(dir: ENTITY_DIRECTION_ENUM) {
        let shake_dir: SHAKE_DIRECTION_ENUM = SHAKE_DIRECTION_ENUM.UP
        switch (dir) {
            case ENTITY_DIRECTION_ENUM.UP:
                shake_dir = SHAKE_DIRECTION_ENUM.UP
                break
            case ENTITY_DIRECTION_ENUM.DOWN:
                shake_dir = SHAKE_DIRECTION_ENUM.DOWN
                break
            case ENTITY_DIRECTION_ENUM.LEFT:
                shake_dir = SHAKE_DIRECTION_ENUM.LEFT
                break
            case ENTITY_DIRECTION_ENUM.RIGHT:
                shake_dir = SHAKE_DIRECTION_ENUM.RIGHT
                break
        }
        EventManager.instance.emit(EVENT_ENUM.EFFECT_SCREEN_SHAKE, shake_dir)
    }

    // 生成灰尘
    _dust(dir: ENTITY_DIRECTION_ENUM) {
        EventManager.instance.emit(EVENT_ENUM.ENTITY_DUST_GENERATE, { dir, x: this.x, y: this.y })
    }

    onDestroy() {
        EventManager.instance.off(EVENT_ENUM.GAME_CTRL_INPUT, this.onInputProcess)
        EventManager.instance.off(EVENT_ENUM.ENTITY_ATTACKED, this.onAttacked)
        EventManager.instance.off(EVENT_ENUM.INVENTORY_TOUCH, this.onInventoryTouch)
    }
}
