// Created by carolsail

import { EVENT_ENUM, TILE_TYPE_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from './../Enum';
import Singleton from "../Singleton"
import EventManager from "./EventManager"
import Dust from '../entity/dust/Dust';
import Player from '../entity/player/Player';
import Weapon from '../entity/weapon/Weapon';
import Door from '../entity/door/Door';
import Key from '../entity/key/Key';
import Pot from '../entity/pot/Pot';
import Beetle from '../entity/beetle/Beetle';
import { Point } from '../AINavigate';
import { ILevelInfo } from '../level/Index';
import Water from '../entity/water/Water';
import SkullHead from '../entity/skull_head/SkullHead';
import Spider from '../entity/spider/Spider';
import Box from '../entity/box/Box';
import FloorBroken from '../entity/floor_broken/FloorBroken';
import FloorTrap from '../entity/floor_trap/FloorTrap';
import FloorTrapSwitch from '../entity/floor_trap_switch/FloorTrapSwitch';
import FloorSpike from '../entity/floor_spike/FloorSpike';
import Pig from '../entity/pig/Pig';
import Entity from '../entity/Entity';
import WaterLily from '../entity/water_lily/WaterLily';
import Spike from '../entity/spike/Spike';
import Mouse from '../entity/mouse/Mouse';
import Bomb from '../entity/bomb/Bomb';
import Shovel from '../entity/shovel/Shovel';
import Dirtpile from '../entity/dirtpile/Dirtpile';
import Skeleton from '../entity/skeleton/Skeleton';
import Stele from '../entity/stele/Stele';
import Grass from '../entity/grass/Grass';
import Stone from '../entity/stone/Stone';
import Tree from '../entity/tree/Tree';
import BlackDust from '../entity/black_dust/BlackDust';
import Cobweb from '../entity/cobweb/Cobweb';
import CobwebSpecial from '../entity/cobweb_s/CobwebSpecial';
import Cocoon1 from '../entity/cocoon1/Cocoon1';
import Cocoon2 from '../entity/cocoon2/Cocoon2';
import DeadBody1 from '../entity/dead_body1/DeadBody1';
import DeadBody2 from '../entity/dead_body2/DeadBody2';
import Expression from '../entity/expression/Expression';
import SpiderBoss from '../entity/spider_boss/SpiderBoss';
import Peach from '../entity/peach/Peach';
import Mushroom from '../entity/mushroom/Mushroom';

const STORAGE_KEY = 'DGE_STORAGE_KEY'
const STORAGE_KEY_TIP = 'DGE_STORAGE_KEY_TIP'

export type IRecordItem = Omit<ILevelInfo, 'map'>

export type IInventoryItem = { type: ENTITY_TYPE_ENUM, num: number }

class DataManager extends Singleton {
    _showPreorder: boolean = false
    private _currentLevel: number = 1
    private _currentMaxLevel: number = this.currentLevel
    private _isAudioEnable: boolean = true
    private _currentLevelTileWidth: number = 82

    // 地图信息
    map: { rows: number, columns: number, points: Map<number, Point> }

    //+++++新增地图元素信息
    stele: Stele = null
    grass: Grass[] = []
    stones: Stone[] = []
    tree: Tree = null
    black_dusts: BlackDust[] = []
    cobwebs: Cobweb[] = []
    cobweb_specials: CobwebSpecial[] = []
    cocoon1s: Cocoon1[] = []
    cocoon2s: Cocoon2[] = []
    dead_body1s: DeadBody1[] = []
    dead_body2s: DeadBody2[] = []
    expressions: Expression[] = []
    spiderzs: SpiderBoss[] = []
    peaches: Peach[] = []
    mushrooms: Mushroom[] = []
    //+++++


    // 瓦片数据信息
    tiles: Array<Array<{ type: TILE_TYPE_ENUM, move: boolean }>> = []
    // 灰尘缓冲池
    dusts: Dust[] = []
    // 玩家信息
    player: Player = null
    // 武器信息
    weapon: Weapon = null
    // 门信息
    doors: Door[] = []
    // 钥匙信息
    key: Key = null
    // 罐子
    pots: Pot[] = []
    // 敌人beetle
    beetles: Beetle[] = []
    // 敌人spider
    spiders: Spider[] = []
    // 水
    waters: Water[] = []
    // 骷髅头
    skull_heads: SkullHead[] = []
    // 箱子
    boxes: Box[] = []
    // 地板塌陷
    floor_brokens: FloorBroken[] = []
    // 地板陷阱
    floor_traps: FloorTrap[] = []
    floor_trap_switches: FloorTrapSwitch[] = []
    // 地板钉刺
    floor_spikes: FloorSpike[] = []
    // 野猪
    pigs: Pig[] = []
    // 荷叶
    water_lilies: WaterLily[] = []
    // 钉刺陷阱
    spikes: Spike[] = []
    // 老鼠
    mouses: Mouse[] = []
    // 炸弹
    bombs: Bomb[] = []
    // 铲子
    shovel: Shovel = null
    // 垃圾堆
    dirtpiles: Dirtpile[] = []
    // 骷髅
    skeletons: Skeleton[] = []
    // 道具背包
    items: Array<IInventoryItem> = []
    // 关卡记录(配合subLevel使用)
    records: Map<string, IRecordItem> = new Map()

    static get instance() {
        return super.getInstance<DataManager>()
    }

    reset(isSubLevel: boolean = false) {
        this.map = { rows: 0, columns: 0, points: new Map() }
        //++++++新增地图元素
        this.grass = []
        this.stele = null
        this.stones = []
        this.tree = null
        this.black_dusts = []
        this.cobwebs = []
        this.cobweb_specials = []
        this.cocoon1s = []
        this.cocoon2s = []
        this.dead_body1s = []
        this.dead_body2s = []
        this.expressions = []
        this.spiderzs = []
        this.peaches = []
        this.mushrooms = []
        //++++++


        this.tiles = []
        this.dusts = []
        this.player = null
        this.weapon = null
        this.doors = []
        this.key = null
        this.pots = []
        this.beetles = []
        this.spiders = []
        this.waters = []
        this.skull_heads = []
        this.boxes = []
        this.floor_brokens = []
        this.floor_traps = []
        this.floor_trap_switches = []
        this.floor_spikes = []
        this.pigs = []
        this.water_lilies = []
        this.spikes = []
        this.mouses = []
        this.bombs = []
        this.shovel = null
        this.dirtpiles = []
        this.skeletons = []
        // 进入sub level的时候，共用背包及保存关卡记录
        if (!isSubLevel) {
            this.items = []
            this.records = new Map()
        }
    }

    restore() {
        const _data = cc.sys.localStorage.getItem(STORAGE_KEY) as any
        try {
            const data = JSON.parse(_data)
            this.showPreorder = data.showPreorder
            this.currentLevel = data.currentLevel
            this.currentMaxLevel = data.currentMaxLevel
            this.isAudioEnable = data.isAudioEnable
        } catch {
            this.showPreorder = false
            this.currentLevel = 1
            this.currentMaxLevel = 1
            this.isAudioEnable = true
            this.reset()
        }
    }

    save() {
        cc.sys.localStorage.setItem(STORAGE_KEY, JSON.stringify({
            showPreorder: this.showPreorder,
            currentLevel: this.currentLevel,
            currentMaxLevel: this.currentMaxLevel,
            isAudioEnable: this.isAudioEnable,
        }))
    }

    // 判断是否有道具
    hasItem(type: ENTITY_TYPE_ENUM) {
        const index = this.items.findIndex(item => item.type === type)
        return index > -1
    }

    // 可坠落实体
    getFallItems() {
        const items = []
        if (this.player && this.player.state != ENTITY_STATE_ENUM.FALL) items.push(this.player)
        if (this.boxes && this.boxes.length) {
            const boxArr = this.boxes.filter(item => (item.state != ENTITY_STATE_ENUM.FALL && item.state != ENTITY_STATE_ENUM.DIE))
            items.push(...boxArr)
        }
        if (this.beetles && this.beetles.length) {
            const beetleArr = this.beetles.filter(item => (item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...beetleArr)
        }
        if (this.spiders && this.spiders.length) {
            const spiderArr = this.spiders.filter(item => (item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...spiderArr)
        }
        if (this.skull_heads && this.skull_heads.length) {
            const skullHeadArr = this.skull_heads.filter(item => (item.state != ENTITY_STATE_ENUM.FALL && item.state != ENTITY_STATE_ENUM.DIE))
            items.push(...skullHeadArr)
        }
        if (this.pigs && this.pigs.length) {
            const pigArr = this.pigs.filter(item => (item.state != ENTITY_STATE_ENUM.FALL && item.state != ENTITY_STATE_ENUM.DIE))
            items.push(...pigArr)
        }
        if (this.skeletons && this.skeletons.length) {
            const skeletonArr = this.skeletons.filter(item => (item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...skeletonArr)
        }
        return items
    }

    // 可攻击实体
    getAttackItems(entities: Entity[] = []) {
        const items = []
        if (this.player && (entities.length == 0 || entities.indexOf(this.player) == -1) && this.player.state != ENTITY_STATE_ENUM.FALL && this.player.state != ENTITY_STATE_ENUM.DIE) {
            items.push(this.player)
        }
        if (this.doors && this.doors.length) {
            const doorArr = this.doors.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...doorArr)
        }
        if (this.pots && this.pots.length) {
            const potArr = this.pots.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...potArr)
        }
        if (this.boxes && this.boxes.length) {
            const boxArr = this.boxes.filter(item => (item.state != ENTITY_STATE_ENUM.DIE && item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...boxArr)
        }
        if (this.beetles && this.beetles.length) {
            const beetleArr = this.beetles.filter(item => ((entities.length == 0 || entities.indexOf(item) == -1) && item.state != ENTITY_STATE_ENUM.DIE && item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...beetleArr)
        }
        if (this.spiders && this.spiders.length) {
            const spiderArr = this.spiders.filter(item => ((entities.length == 0 || entities.indexOf(item) == -1) && item.state != ENTITY_STATE_ENUM.DIE && item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...spiderArr)
        }
        if (this.pigs && this.pigs.length) {
            const pigArr = this.pigs.filter(item => ((entities.length == 0 || entities.indexOf(item) == -1) && item.state != ENTITY_STATE_ENUM.DIE && item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...pigArr)
        }
        if (this.dirtpiles && this.dirtpiles.length) {
            const dirtpileArr = this.dirtpiles.filter(item => ((entities.length == 0 || entities.indexOf(item) == -1) && item.state != ENTITY_STATE_ENUM.DIE))
            items.push(...dirtpileArr)
        }
        if (this.skeletons && this.skeletons.length) {
            const skeletonArr = this.skeletons.filter(item => ((entities.length == 0 || entities.indexOf(item) == -1) && item.state != ENTITY_STATE_ENUM.DIE && item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...skeletonArr)
        }
        return items
    }

    // 漏空的碰撞实体
    getBlockItemsWithEmpty() {
        const items = []
        if (this.waters && this.waters.length) {
            const waterArr = this.waters.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...waterArr)
        }
        if (this.floor_brokens && this.floor_brokens.length) {
            const floorBrokenArr = this.floor_brokens.filter(item => item.state == ENTITY_STATE_ENUM.DIE)
            items.push(...floorBrokenArr)
        }
        if (this.floor_traps && this.floor_traps.length) {
            const floorTrapArr = this.floor_traps.filter(item => item.state != ENTITY_STATE_ENUM.IDLE)
            items.push(...floorTrapArr)
        }
        if (this.stele) {
            items.push(this.stele)
        }
        if (this.stones && this.stones.length) {
            const stoneArr = this.stones.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...stoneArr)
        }
        if (this.tree) {
            items.push(this.tree)
        }
        if (this.cocoon1s && this.cocoon1s.length) {
            const arr = this.cocoon1s.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...arr)
        }
        if (this.cocoon2s && this.cocoon2s.length) {
            const arr = this.cocoon2s.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...arr)
        }
        if (this.dead_body1s && this.dead_body1s.length) {
            const arr = this.dead_body1s.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...arr)
        }
        if (this.dead_body2s && this.dead_body2s.length) {
            const arr = this.dead_body2s.filter(item => item.state == ENTITY_STATE_ENUM.IDLE)
            items.push(...arr)
        }
        if (this.spiderzs && this.spiderzs.length) {
            const arr = this.spiderzs.filter(item => (item.state != ENTITY_STATE_ENUM.FALL))
            items.push(...arr)
        }
        return items
    }
    // 碰撞实体
    getBlockItems(entities: Entity[] = []) {
        const attack = this.getAttackItems(entities)
        const empty = this.getBlockItemsWithEmpty()
        const items = attack.concat(empty)
        return items
    }

    // 获取关卡是否已经提示
    getTipNotice(level: number): boolean {
        const _tips = cc.sys.localStorage.getItem(STORAGE_KEY_TIP)
        const tips = JSON.parse(_tips) || []
        if (tips.indexOf(level) >= 0) return true
        return false
    }
    // 设置已获得提示的关卡
    setTipNotice(level: number) {
        const _tips = cc.sys.localStorage.getItem(STORAGE_KEY_TIP)
        const tips = JSON.parse(_tips) || []
        tips.push(level)
        cc.sys.localStorage.setItem(STORAGE_KEY_TIP, JSON.stringify(tips))
    }

    get currentLevelTileWidth() {
        if (this.map.rows > 0 && this.map.columns > 0) {
            const width = Math.min(750 / (this.map.columns), 750 / (this.map.rows))
            return Math.floor(width)
        }
        return 82
    }

    get showPreorder() {
        return this._showPreorder
    }

    set showPreorder(data: boolean) {
        this._showPreorder = data
        this.save()
    }

    get currentLevel() {
        return this._currentLevel
    }

    set currentLevel(data: number) {
        this._currentLevel = data
        this.save()
    }

    get currentMaxLevel() {
        return this._currentMaxLevel
    }

    set currentMaxLevel(data: number) {
        this._currentMaxLevel = data
        this.save()
    }

    get isAudioEnable() {
        return this._isAudioEnable
    }

    set isAudioEnable(data: boolean) {
        this._isAudioEnable = data
        this.save()
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY)
    }
}

export default DataManager
