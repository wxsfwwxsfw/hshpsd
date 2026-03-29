// Created by carolsail

import { ISubLevelData } from './../level/Index';
import { TIP_NODE_ENUM, TILE_TYPE_ENUM, TILE_INFO_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, GAME_SCENE_ENUM, EVENT_ENUM, INPUT_PROCESS_ENUM, NODE_ZINDEX_ENUM, ENTITY_DIRECTION_ENUM } from './../Enum';
import Levels, { ILevelInfo, LEVEL_COUNT } from './../level/Index';
import EventManager from "../runtime/EventManager";
import DataManager, { IRecordItem } from '../runtime/DataManager';
import { createNodeWithLT, loadSpriteAtlas } from '../Util';
import Player from '../entity/player/Player';
import Dust from '../entity/dust/Dust';
import Weapon from '../entity/weapon/Weapon';
import ShakeManager from '../effect/ShakeManager';
import LayerManager from '../runtime/LayerManager';
import Door from '../entity/door/Door';
import Key from '../entity/key/Key';
import Pot from '../entity/pot/Pot';
import Beetle from '../entity/beetle/Beetle';
import { Point } from '../AINavigate';
import Water from '../entity/water/Water';
import SkullHead from '../entity/skull_head/SkullHead';
import Spider from '../entity/spider/Spider';
import SpiderWeb from '../entity/spider_web/SpiderWeb';
import Box from '../entity/box/Box';
import FloorBroken from '../entity/floor_broken/FloorBroken';
import FloorTrap from '../entity/floor_trap/FloorTrap';
import FloorTrapSwitch from '../entity/floor_trap_switch/FloorTrapSwitch';
import FloorSpike from '../entity/floor_spike/FloorSpike';
import Pig from '../entity/pig/Pig';
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    stageNode: cc.Node = null
    levelInfo: ILevelInfo = null
    @property(cc.Label)
    currentLevelLabel: cc.Label = null

    protected onLoad(): void {
        LayerManager.instance.fadeOut()
        cc.director.preloadScene(GAME_SCENE_ENUM.MENU)
        cc.director.preloadScene(GAME_SCENE_ENUM.SELECT_LEVEL)
        // 创建舞台节点
        this.stageNode = createNodeWithLT('Stage')
        this.stageNode.setParent(this.node)
        this.stageNode.addComponent(ShakeManager)
        this.stageNode.zIndex = NODE_ZINDEX_ENUM.STAGE
        // 监听事件
        EventManager.instance.on(EVENT_ENUM.RENDER_MAIN, this.onInitLevel, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_DUST_GENERATE, this.onGenerateDust, this)
        EventManager.instance.on(EVENT_ENUM.ENTITY_SPIDERWEB_GENERATE, this.onGenerateSpiderWeb, this)
        EventManager.instance.on(EVENT_ENUM.GAME_LEVEL_NEXT, this.onNextLevel, this)
        EventManager.instance.on(EVENT_ENUM.GAME_LEVEL_RESTART, this.onRestartLevel, this)
        EventManager.instance.on(EVENT_ENUM.GAME_LEVEL_DATA_RESET, this.onLevelDataReset, this)
        EventManager.instance.on(EVENT_ENUM.GAME_LEVEL_DATA_RECORD, this.onLevelDataRecord, this)
        EventManager.instance.on(EVENT_ENUM.GAME_LEVEL_DATA_REVOKE, this.onLevelDataRevoke, this)
        // 渲染
        this.onInitLevel()
    }

    onCtrlInput(_: cc.Event, action: INPUT_PROCESS_ENUM) {
        EventManager.instance.emit(EVENT_ENUM.GAME_CTRL_INPUT, action)
    }

    async onInitLevel(isFadeEffect: boolean = false, subLevel: ISubLevelData = null) {
        // console.log('+++++++++++++++++++++++++++++初始化新的关卡', isFadeEffect, subLevel)

        if (isFadeEffect) await LayerManager.instance.fadeIn()

        if (subLevel) {
            this.levelInfo = Levels[subLevel.to]
        } else {
            this.levelInfo = Levels[`L${DataManager.instance.currentLevel}`]
        }
        if (!this.levelInfo) return

        const LEVEL_NAMES: Record<string, string> = { '1': '贪桃', '2': '退路', '3': '险径', '4': '推关', '5': '引蛛', '6': '两关', '7': '险关', '8': '绝境', '9': '移障', '10': '暗渡', '11': '三煞', '12': '连环', '13': '四面', '14': '复道', '15': '深渊' }
        const LEVEL_NUM_NAMES: Record<string, string> = { '1': '第一关', '2': '第二关', '3': '第三关', '4': '第四关', '5': '第五关' }
        const lv = DataManager.instance.currentLevel
        const lvName = LEVEL_NAMES[String(lv)]
        const lvNumName = LEVEL_NUM_NAMES[String(lv)] || ('L' + lv)
        if (this.currentLevelLabel) {
            const lbl = this.currentLevelLabel
            lbl.string = lvName ? `${lvNumName} · ${lvName}` : lvNumName
            lbl.fontSize = 32
            lbl.spacingX = 6
            lbl.node.color = new cc.Color(255, 195, 20, 255)   // 琥珀金
        }

        // 清空舞台
        this.stageNode?.destroyAllChildren()
        // 重置数据
        if (subLevel) {
            EventManager.instance.emit(EVENT_ENUM.GAME_LEVEL_DATA_RESET, true)
        } else {
            EventManager.instance.emit(EVENT_ENUM.GAME_LEVEL_DATA_RESET)
        }

        // 保存map信息
        DataManager.instance.map = { rows: this.levelInfo.map.length, columns: this.levelInfo.map[0].length, points: new Map() }

        // 生产数据
        await Promise.all([
            this.generateMap(),
            this.generatePlayer(),
            this.generatePot(),
            this.generateDoor(),
            this.generateBeetle(),
            this.generateSpider(),
            this.generateWater(),
            this.generateStele(),
            this.generateGrass(),
            this.generateStone(),
            this.generateTree(),
            this.generateBlackDust(),
            this.generateCobweb(),
            this.generateCobwebSpecial(),
            this.generateCocoon1s(),
            this.generateCocoon2s(),
            this.generateDeadBody1s(),
            this.generateDeadBody2s(),
            this.generateSpiderzs(),
            this.generatePeach(),
            this.generateMushroom(),
            this.generateExpression(),
            this.generateBox(),
            this.generateSkullHead(),
            this.generateKey(),
            this.generateWeapon(),
            this.generateFloorBroken(),
            this.generateFloorTrap(),
            this.generateFloorTrapSwitch(),
            this.generateFloorSpike(),
            this.generatePig(),
            this.generateWaterLily(),
            this.generateSpike(),
            this.generateMouse(),
            this.generateBomb(),
            this.generateShovel(),
            this.generateDirtpile(),
            this.generateSkeleton(),
        ])
        this.generateInventory()

        // 恢复数据
        if (subLevel) EventManager.instance.emit(EVENT_ENUM.GAME_LEVEL_DATA_REVOKE, subLevel)

        if (isFadeEffect) await LayerManager.instance.fadeOut()
    }

    async generateMap() {
        const mapNode: cc.Node = createNodeWithLT('Map')
        mapNode.setParent(this.stageNode)
        const mapOverlayNode: cc.Node = createNodeWithLT('MapOverlay')
        mapOverlayNode.setParent(this.stageNode)
        mapOverlayNode.zIndex = NODE_ZINDEX_ENUM.PLAYER + 1
        // const atlas = await loadSpriteAtlas('map/tile')
        const atlas = await loadSpriteAtlas('map/map')
        const { map } = this.levelInfo
        DataManager.instance.tiles = []
        for (let i = 0; i < map.length; i++) {
            DataManager.instance.tiles[i] = []
            for (let j = 0; j < map[i].length; j++) {
                const item = map[i][j]
                if (item.type == null) continue
                let tile = { type: TILE_TYPE_ENUM.WALL, move: false }
                switch (item.type) {
                    case TILE_TYPE_ENUM.FLOOR:
                        tile = { type: TILE_TYPE_ENUM.FLOOR, move: true }
                        DataManager.instance.map.points.set(i + j * DataManager.instance.currentLevelTileWidth, new Point(i, j))
                        break
                    case TILE_TYPE_ENUM.WALL:
                        tile = { type: TILE_TYPE_ENUM.WALL, move: false }
                        break
                }
                // 保存瓦片信息
                DataManager.instance.tiles[i][j] = tile
                // 生成节点
                const tileNode: cc.Node = createNodeWithLT(`tile_${i}_${j}`)
                // j=0顶行的WALL砖块放入叠加层，让其渲染在玩家上方（遮挡悟空伸入石墙的身体部分）
                tileNode.setParent(j === 0 && item.type === TILE_TYPE_ENUM.WALL ? mapOverlayNode : mapNode)
                const tileSprite = tileNode.addComponent(cc.Sprite)
                // TODO 随机性
                const { name } = item
                tileSprite.spriteFrame = atlas.getSpriteFrame(`${name}`)
                tileNode.setPosition(i * DataManager.instance.currentLevelTileWidth, j * DataManager.instance.currentLevelTileWidth * -1)
                tileNode.setContentSize(DataManager.instance.currentLevelTileWidth, DataManager.instance.currentLevelTileWidth)
            }
        }
        // 让map居中
        const { rows, columns } = DataManager.instance.map
        const x = DataManager.instance.currentLevelTileWidth * rows / 2 * -1
        // const y = DataManager.instance.currentLevelTileWidth * columns / 2 + 200
        const y = DataManager.instance.currentLevelTileWidth * columns / 2 + 146
        console.log('舞台位置', x, y)
        // 设置舞台居中位置
        this.stageNode.setPosition(x, y)
        // 加载关卡tip
        if (this.levelInfo?.tip) {
            const level = DataManager.instance.currentLevel
            if (DataManager.instance.getTipNotice(level)) return
            DataManager.instance.setTipNotice(level)
            EventManager.instance.emit(EVENT_ENUM.RENDER_TIPS, this.levelInfo.tip)
        }
    }

    async generatePlayer() {
        if (this.levelInfo?.player) {
            const node: cc.Node = createNodeWithLT('Player')
            node.setParent(this.stageNode)
            node.zIndex = NODE_ZINDEX_ENUM.PLAYER
            const player = node.addComponent(Player)
            await player.init(this.levelInfo.player)
            DataManager.instance.player = player
        }
    }

    async onGenerateDust({ dir, x, y }) {
        const item = DataManager.instance.dusts.find(item => item.state == ENTITY_STATE_ENUM.DIE)
        if (item) {
            // console.log('缓冲池')
            item.x = x
            item.y = y
            item.dir = dir
            item.state = ENTITY_STATE_ENUM.IDLE
            const px = x * DataManager.instance.currentLevelTileWidth - DataManager.instance.currentLevelTileWidth * 0.5
            const py = y * DataManager.instance.currentLevelTileWidth * -1 + DataManager.instance.currentLevelTileWidth * 0.5
            item.node.setPosition(px, py)
        } else {
            const node: cc.Node = createNodeWithLT('Dust')
            node.setParent(this.stageNode)
            node.zIndex = NODE_ZINDEX_ENUM.DUST
            const dust = node.addComponent(Dust)
            await dust.init({
                type: ENTITY_TYPE_ENUM.DUST,
                x: x,
                y: y,
                dir: dir,
                state: ENTITY_STATE_ENUM.IDLE
            })
            DataManager.instance.dusts.push(dust)
        }
    }

    async generateDoor() {
        if (this.levelInfo?.doors) {
            const doors = this.levelInfo.doors
            const promises = []
            for (let i = 0; i < doors.length; i++) {
                const node: cc.Node = createNodeWithLT(`Door_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.DOOR
                const door = node.addComponent(Door)
                promises.push(door.init(doors[i]))
                DataManager.instance.doors.push(door)
            }
            await Promise.all(promises)
        }
    }

    async generatePot() {
        if (this.levelInfo?.pots) {
            const pots = this.levelInfo.pots
            const promises = []
            for (let i = 0; i < pots.length; i++) {
                const node: cc.Node = createNodeWithLT(`Pot_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.POT
                const pot = node.addComponent(Pot)
                promises.push(pot.init(pots[i]))
                DataManager.instance.pots.push(pot)
            }
            await Promise.all(promises)
        }
    }

    //甲壳虫🐞
    async generateBeetle() {
        if (this.levelInfo?.beetles) {
            const beetles = this.levelInfo.beetles
            const promises = []
            for (let i = 0; i < beetles.length; i++) {
                const node: cc.Node = createNodeWithLT(`Beetle_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.BEATLE
                const beetle = node.addComponent(Beetle)
                promises.push(beetle.init(beetles[i]))
                DataManager.instance.beetles.push(beetle)
            }
            await Promise.all(promises)
        }
    }

    //蜘蛛🕷
    async generateSpider() {
        if (this.levelInfo?.spiders) {
            const spiders = this.levelInfo.spiders
            const promises = []
            for (let i = 0; i < spiders.length; i++) {
                const node: cc.Node = createNodeWithLT(`Spider_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.SPIDER
                const spider = node.addComponent(Spider)
                promises.push(spider.init(spiders[i]))
                DataManager.instance.spiders.push(spider)
            }
            await Promise.all(promises)
        }
    }

    async generateWater() {
        if (this.levelInfo?.waters) {
            const waters = this.levelInfo.waters
            const promises = []
            for (let i = 0; i < waters.length; i++) {
                const node: cc.Node = createNodeWithLT(`Water_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.WATER
                const water = node.addComponent(Water)
                promises.push(water.init(waters[i]))
                DataManager.instance.waters.push(water)
            }
            await Promise.all(promises)
        }
    }

    async generateStele() {
        if (this.levelInfo?.stele) {
            const node: cc.Node = createNodeWithLT(`Stele`)
            node.setParent(this.stageNode)
            node.zIndex = NODE_ZINDEX_ENUM.STELE
            const stele = node.addComponent(Stele)
            await stele.init(this.levelInfo.stele)
            DataManager.instance.stele = stele
        }
    }

    async generateGrass() {
        if (this.levelInfo?.grass) {
            const grass = this.levelInfo.grass
            const promises = []
            for (let i = 0; i < grass.length; i++) {
                const node: cc.Node = createNodeWithLT(`Grass_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.GRASS
                const cao = node.addComponent(Grass)
                promises.push(cao.init(grass[i]))
                DataManager.instance.grass.push(cao)
            }
            await Promise.all(promises)
        }
    }

    async generatePeach() {
        if (this.levelInfo?.peaches) {
            const peaches = this.levelInfo.peaches
            const promises = []
            for (let i = 0; i < peaches.length; i++) {
                const node: cc.Node = createNodeWithLT(`Peach_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.PEACH
                const peach = node.addComponent(Peach)
                promises.push(peach.init(peaches[i]))
                DataManager.instance.peaches.push(peach)
            }
            await Promise.all(promises)
        }
    }

    async generateMushroom() {
        if (this.levelInfo?.mushrooms) {
            const mushrooms = this.levelInfo.mushrooms
            const promises = []
            for (let i = 0; i < mushrooms.length; i++) {
                const node: cc.Node = createNodeWithLT(`Mushroom_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.MUSHROOM
                const mushroom = node.addComponent(Mushroom)
                promises.push(mushroom.init(mushrooms[i]))
                DataManager.instance.mushrooms.push(mushroom)
            }
            await Promise.all(promises)
        }
    }

    async generateStone() {
        if (this.levelInfo?.stones) {
            const stones = this.levelInfo.stones
            const promises = []
            for (let i = 0; i < stones.length; i++) {
                const node: cc.Node = createNodeWithLT(`Stone_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.STONE
                const stone = node.addComponent(Stone)
                promises.push(stone.init(stones[i]))
                DataManager.instance.stones.push(stone)
            }
            await Promise.all(promises)
        }
    }

    async generateTree() {
        if (this.levelInfo?.tree) {
            const node: cc.Node = createNodeWithLT(`Tree`)
            node.setParent(this.stageNode)
            node.zIndex = NODE_ZINDEX_ENUM.TREE
            const tree = node.addComponent(Tree)
            await tree.init(this.levelInfo.tree)
            DataManager.instance.tree = tree
        }
    }

    async generateBlackDust() {
        if (this.levelInfo?.black_dusts) {
            const dusts = this.levelInfo.black_dusts
            const promises = []
            for (let i = 0; i < dusts.length; i++) {
                const node: cc.Node = createNodeWithLT(`BlackDust_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.BLACK_DUST
                const dust = node.addComponent(BlackDust)
                promises.push(dust.init(dusts[i]))
                DataManager.instance.black_dusts.push(dust)
            }
            await Promise.all(promises)
        }
    }

    async generateCobweb() {
        if (this.levelInfo?.cobwebs) {
            const webs = this.levelInfo.cobwebs
            const promises = []
            for (let i = 0; i < webs.length; i++) {
                const node: cc.Node = createNodeWithLT(`Cobweb_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.COBWEB
                const web = node.addComponent(Cobweb)
                promises.push(web.init(webs[i]))
                DataManager.instance.cobwebs.push(web)
            }
            await Promise.all(promises)
        }
    }

    async generateCobwebSpecial() {
        if (this.levelInfo?.cobweb_specils) {
            const webs = this.levelInfo.cobweb_specils
            const promises = []
            for (let i = 0; i < webs.length; i++) {
                const node: cc.Node = createNodeWithLT(`CobwebSpecial_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.COBWEB
                const web = node.addComponent(CobwebSpecial)
                promises.push(web.init(webs[i]))
                DataManager.instance.cobweb_specials.push(web)
            }
            await Promise.all(promises)
        }
    }

    async generateCocoon1s() {
        if (this.levelInfo?.cocoon1s) {
            const cocoons = this.levelInfo.cocoon1s
            const promises = []
            for (let i = 0; i < cocoons.length; i++) {
                const node: cc.Node = createNodeWithLT(`Cocoon1_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.COCOON
                const cocoon = node.addComponent(Cocoon1)
                promises.push(cocoon.init(cocoons[i]))
                DataManager.instance.cocoon1s.push(cocoon)
            }
            await Promise.all(promises)
        }
    }

    async generateCocoon2s() {
        if (this.levelInfo?.cocoon2s) {
            const cocoons = this.levelInfo.cocoon2s
            const promises = []
            for (let i = 0; i < cocoons.length; i++) {
                const node: cc.Node = createNodeWithLT(`Cocoon2_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.COCOON
                const cocoon = node.addComponent(Cocoon2)
                promises.push(cocoon.init(cocoons[i]))
                DataManager.instance.cocoon2s.push(cocoon)
            }
            await Promise.all(promises)
        }
    }

    async generateDeadBody1s() {
        if (this.levelInfo?.dead_body1s) {
            const bodys = this.levelInfo.dead_body1s
            const promises = []
            for (let i = 0; i < bodys.length; i++) {
                const node: cc.Node = createNodeWithLT(`DeadBody1_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.DEAD_BODY
                const body = node.addComponent(DeadBody1)
                promises.push(body.init(bodys[i]))
                DataManager.instance.dead_body1s.push(body)
            }
            await Promise.all(promises)
        }
    }

    async generateDeadBody2s() {
        if (this.levelInfo?.dead_body2s) {
            const bodys = this.levelInfo.dead_body2s
            const promises = []
            for (let i = 0; i < bodys.length; i++) {
                const node: cc.Node = createNodeWithLT(`DeadBody2_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.DEAD_BODY
                const body = node.addComponent(DeadBody2)
                promises.push(body.init(bodys[i]))
                DataManager.instance.dead_body2s.push(body)
            }
            await Promise.all(promises)
        }
    }

    async generateExpression() {
        if (this.levelInfo?.expressions) {
            const arr = this.levelInfo.expressions
            const promises = []
            for (let i = 0; i < arr.length; i++) {
                const node: cc.Node = createNodeWithLT(`Expression_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.DEAD_BODY
                const expression = node.addComponent(Expression)
                promises.push(expression.init(arr[i]))
                DataManager.instance.expressions.push(expression)
            }
            await Promise.all(promises)
        }
    }

    async generateSpiderzs() {
        if (this.levelInfo?.spiderzs) {
            const arr = this.levelInfo.spiderzs
            const promises = []
            for (let i = 0; i < arr.length; i++) {
                const node: cc.Node = createNodeWithLT(`SpiderBoss_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.SPIDERZ
                const spiderz = node.addComponent(SpiderBoss)
                promises.push(spiderz.init(arr[i]))
                DataManager.instance.spiderzs.push(spiderz)
            }
            await Promise.all(promises)
        }
    }

    async generateBox() {
        if (this.levelInfo?.boxes) {
            const boxes = this.levelInfo.boxes
            const promises = []
            for (let i = 0; i < boxes.length; i++) {
                const node: cc.Node = createNodeWithLT(`Box_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.BOX
                const box = node.addComponent(Box)
                promises.push(box.init(boxes[i]))
                DataManager.instance.boxes.push(box)
            }
            await Promise.all(promises)
        }
    }

    //生成蜘蛛网
    async onGenerateSpiderWeb({ spider, prey }) {
        if (spider.x == prey.x) {
            if (spider.y > prey.y) {
                const promises = []
                for (let i = spider.y - 1; i > prey.y; i--) {
                    const node: cc.Node = createNodeWithLT(`SpiderWeb${i}`)
                    node.setParent(this.stageNode)
                    node.zIndex = NODE_ZINDEX_ENUM.SPIDER_WEB
                    const sweb = node.addComponent(SpiderWeb)
                    promises.push(sweb.init({ type: ENTITY_TYPE_ENUM.SPIDER_WEB, x: spider.x, y: i, state: ENTITY_STATE_ENUM.IDLE }))
                }
                await Promise.all(promises)
            } else {
                const promises = []
                for (let i = spider.y + 1; i < prey.y; i++) {
                    const node: cc.Node = createNodeWithLT(`SpiderWeb${i}`)
                    node.setParent(this.stageNode)
                    node.zIndex = NODE_ZINDEX_ENUM.SPIDER_WEB
                    const sweb = node.addComponent(SpiderWeb)
                    promises.push(sweb.init({ type: ENTITY_TYPE_ENUM.SPIDER_WEB, x: spider.x, y: i, state: ENTITY_STATE_ENUM.IDLE }))
                }
                await Promise.all(promises)
            }
        } else {
            if (spider.x > prey.x) {
                const promises = []
                for (let i = spider.x - 1; i > prey.x; i--) {
                    const node: cc.Node = createNodeWithLT(`SpiderWeb${i}`)
                    node.setParent(this.stageNode)
                    node.zIndex = NODE_ZINDEX_ENUM.SPIDER_WEB
                    const sweb = node.addComponent(SpiderWeb)
                    promises.push(sweb.init({ type: ENTITY_TYPE_ENUM.SPIDER_WEB, x: i, y: spider.y, state: ENTITY_STATE_ENUM.IDLE }))
                }
                await Promise.all(promises)
            } else {
                const promises = []
                for (let i = spider.x + 1; i < prey.x; i++) {
                    const node: cc.Node = createNodeWithLT(`SpiderWeb${i}`)
                    node.setParent(this.stageNode)
                    node.zIndex = NODE_ZINDEX_ENUM.SPIDER_WEB
                    const sweb = node.addComponent(SpiderWeb)
                    promises.push(sweb.init({ type: ENTITY_TYPE_ENUM.SPIDER_WEB, x: i, y: spider.y, state: ENTITY_STATE_ENUM.IDLE }))
                }
                await Promise.all(promises)
            }
        }
    }

    async generateWeapon() {
        if (this.levelInfo?.weapon) {
            const node: cc.Node = createNodeWithLT(`Weapon`)
            node.setParent(this.stageNode)
            node.zIndex = NODE_ZINDEX_ENUM.WEAPON
            const weapon = node.addComponent(Weapon)
            await weapon.init(this.levelInfo.weapon)
            DataManager.instance.weapon = weapon
        }
    }

    async generateKey() {
        if (this.levelInfo?.key) {
            const node: cc.Node = createNodeWithLT(`Key`)
            node.setParent(this.stageNode)
            node.zIndex = NODE_ZINDEX_ENUM.KEY
            const key = node.addComponent(Key)
            await key.init(this.levelInfo.key)
            DataManager.instance.key = key
        }
    }

    //生成骷髅头
    async generateSkullHead() {
        if (this.levelInfo?.skull_heads) {
            const skull_heads = this.levelInfo.skull_heads
            const promises = []
            for (let i = 0; i < skull_heads.length; i++) {
                const node: cc.Node = createNodeWithLT(`SkullHead_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.SKULL_HEAD
                const skull_head = node.addComponent(SkullHead)
                promises.push(skull_head.init(skull_heads[i]))
                DataManager.instance.skull_heads.push(skull_head)
            }
            await Promise.all(promises)
        }
    }

    async generateFloorBroken() {
        if (this.levelInfo?.floor_brokens) {
            const floor_brokens = this.levelInfo.floor_brokens
            const promises = []
            for (let i = 0; i < floor_brokens.length; i++) {
                const node: cc.Node = createNodeWithLT(`FloorBroken_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.FLOOR_BROKEN
                const floor_broken = node.addComponent(FloorBroken)
                promises.push(floor_broken.init(floor_brokens[i]))
                DataManager.instance.floor_brokens.push(floor_broken)
            }
            await Promise.all(promises)
        }
    }

    async generateFloorTrap() {
        if (this.levelInfo?.floor_traps) {
            const floor_traps = this.levelInfo.floor_traps
            const promises = []
            for (let i = 0; i < floor_traps.length; i++) {
                const node: cc.Node = createNodeWithLT(`FloorTrap_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.FLOOR_TRAP
                const floor_trap = node.addComponent(FloorTrap)
                promises.push(floor_trap.init(floor_traps[i]))
                DataManager.instance.floor_traps.push(floor_trap)
            }
            await Promise.all(promises)
        }
    }

    async generateFloorTrapSwitch() {
        if (this.levelInfo?.floor_trap_switches) {
            const floor_trap_switches = this.levelInfo.floor_trap_switches
            const promises = []
            for (let i = 0; i < floor_trap_switches.length; i++) {
                const node: cc.Node = createNodeWithLT(`FloorTrapSwitch_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.FLOOR_TRAP_SWITCH
                const floor_trap_switch = node.addComponent(FloorTrapSwitch)
                promises.push(floor_trap_switch.init(floor_trap_switches[i]))
                DataManager.instance.floor_trap_switches.push(floor_trap_switch)
            }
            await Promise.all(promises)
        }
    }

    async generateFloorSpike() {
        if (this.levelInfo?.floor_spikes) {
            const floor_spikes = this.levelInfo.floor_spikes
            const promises = []
            for (let i = 0; i < floor_spikes.length; i++) {
                const node: cc.Node = createNodeWithLT(`FloorSpike_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.FLOOR_SPIKE
                const floor_spike = node.addComponent(FloorSpike)
                promises.push(floor_spike.init(floor_spikes[i]))
                DataManager.instance.floor_spikes.push(floor_spike)
            }
            await Promise.all(promises)
        }
    }

    async generatePig() {
        if (this.levelInfo?.pigs) {
            const pigs = this.levelInfo.pigs
            const promises = []
            for (let i = 0; i < pigs.length; i++) {
                const node: cc.Node = createNodeWithLT(`Pig_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.PIG
                const pig = node.addComponent(Pig)
                promises.push(pig.init(pigs[i]))
                DataManager.instance.pigs.push(pig)
            }
            await Promise.all(promises)
        }
    }

    async generateWaterLily() {
        if (this.levelInfo?.water_lilies) {
            const water_lilies = this.levelInfo.water_lilies
            const promises = []
            for (let i = 0; i < water_lilies.length; i++) {
                const node: cc.Node = createNodeWithLT(`WaterLily_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.WATER_LILY
                const lily = node.addComponent(WaterLily)
                promises.push(lily.init(water_lilies[i]))
                DataManager.instance.water_lilies.push(lily)
            }
            await Promise.all(promises)
        }
    }

    //钉子
    async generateSpike() {
        if (this.levelInfo?.spikes) {
            const spikes = this.levelInfo.spikes
            const promises = []
            for (let i = 0; i < spikes.length; i++) {
                const node: cc.Node = createNodeWithLT(`Spike_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.SPIKE
                const spike = node.addComponent(Spike)
                promises.push(spike.init(spikes[i]))
                DataManager.instance.spikes.push(spike)
            }
            await Promise.all(promises)
        }
    }

    async generateMouse() {
        if (this.levelInfo?.mouses) {
            const mouses = this.levelInfo.mouses
            const promises = []
            for (let i = 0; i < mouses.length; i++) {
                const node: cc.Node = createNodeWithLT(`Mouse_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.MOUSE
                const mouse = node.addComponent(Mouse)
                promises.push(mouse.init(mouses[i]))
                DataManager.instance.mouses.push(mouse)
            }
            await Promise.all(promises)
        }
    }

    async generateBomb() {
        if (this.levelInfo?.bombs) {
            const bombs = this.levelInfo.bombs
            const promises = []
            for (let i = 0; i < bombs.length; i++) {
                const node: cc.Node = createNodeWithLT(`Bomb_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.BOMB
                const bomb = node.addComponent(Bomb)
                promises.push(bomb.init(bombs[i]))
                DataManager.instance.bombs.push(bomb)
            }
            await Promise.all(promises)
        }
    }

    //铲子
    async generateShovel() {
        if (this.levelInfo?.shovel) {
            const node: cc.Node = createNodeWithLT(`Shovel`)
            node.setParent(this.stageNode)
            node.zIndex = NODE_ZINDEX_ENUM.SHOVEL
            const shovel = node.addComponent(Shovel)
            await shovel.init(this.levelInfo.shovel)
            DataManager.instance.shovel = shovel
        }
    }

    //生成土堆
    async generateDirtpile() {
        if (this.levelInfo?.dirtpiles) {
            const dirtpiles = this.levelInfo.dirtpiles
            const promises = []
            for (let i = 0; i < dirtpiles.length; i++) {
                const node: cc.Node = createNodeWithLT(`Dirtpile_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.DIRTPILE
                const dirtpile = node.addComponent(Dirtpile)
                promises.push(dirtpile.init(dirtpiles[i]))
                DataManager.instance.dirtpiles.push(dirtpile)
            }
            await Promise.all(promises)
        }
    }

    //生成骷髅
    async generateSkeleton() {
        if (this.levelInfo?.skeletons) {
            const skeletons = this.levelInfo.skeletons
            const promises = []
            for (let i = 0; i < skeletons.length; i++) {
                const node: cc.Node = createNodeWithLT(`Skeleton_${i}`)
                node.setParent(this.stageNode)
                node.zIndex = NODE_ZINDEX_ENUM.SKELETON
                const skeleton = node.addComponent(Skeleton)
                promises.push(skeleton.init(skeletons[i]))
                DataManager.instance.skeletons.push(skeleton)
            }
            await Promise.all(promises)
        }
    }

    generateInventory() {
        if (this.levelInfo?.items) {
            Object.assign(DataManager.instance.items, this.levelInfo.items)
        }
        EventManager.instance.emit(EVENT_ENUM.RENDER_INVENTORY)
    }

    onNextLevel(subLevel: ISubLevelData = null) {
        // 副关卡
        if (subLevel) {
            EventManager.instance.emit(EVENT_ENUM.RENDER_MAIN, true, subLevel)
            return
        }
        // 是否通关
        if (DataManager.instance.currentLevel < LEVEL_COUNT) {
            DataManager.instance.currentLevel++
            EventManager.instance.emit(EVENT_ENUM.RENDER_MAIN, true)
        } else {
            EventManager.instance.emit(EVENT_ENUM.RENDER_TIPS, TIP_NODE_ENUM.LEVEL_COMPLETE)
        }
        // 已解锁最大关卡
        if (DataManager.instance.currentLevel > DataManager.instance.currentMaxLevel) {
            DataManager.instance.currentMaxLevel = DataManager.instance.currentLevel
        }
    }

    onRestartLevel() {
        DataManager.instance.reset()
        EventManager.instance.emit(EVENT_ENUM.RENDER_MAIN, true)
        EventManager.instance.emit(EVENT_ENUM.CLOSE_TIPS)
    }

    onPauseClick() {
        EventManager.instance.emit(EVENT_ENUM.RENDER_TIPS, TIP_NODE_ENUM.PAUSE_PANEL)
    }

    onResumeClick() {
        EventManager.instance.emit(EVENT_ENUM.CLOSE_TIPS)
    }

    onHomeClick() {
        cc.director.loadScene(GAME_SCENE_ENUM.SELECT_LEVEL)
    }

    onLevelDataReset(isSubLevel: boolean = false) {
        DataManager.instance.reset(isSubLevel)
    }

    onLevelDataRecord(subLevel: ISubLevelData) {
        const { player, key, weapon, pots, skull_heads, boxes, spiders, mouses } = DataManager.instance
        let { x: px, y: py, dir: pdir, type: ptype } = player
        switch (pdir) {
            case ENTITY_DIRECTION_ENUM.UP:
                py = py + 1
                pdir = ENTITY_DIRECTION_ENUM.DOWN
                break
            case ENTITY_DIRECTION_ENUM.DOWN:
                py = py - 1
                pdir = ENTITY_DIRECTION_ENUM.UP
                break
            case ENTITY_DIRECTION_ENUM.LEFT:
                px = px + 1
                pdir = ENTITY_DIRECTION_ENUM.RIGHT
                break
            case ENTITY_DIRECTION_ENUM.RIGHT:
                px = px - 1
                pdir = ENTITY_DIRECTION_ENUM.LEFT
                break
        }
        const record: IRecordItem = {
            player: {
                type: ptype,
                x: px,
                y: py,
                dir: pdir,
                state: DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON) ? ENTITY_STATE_ENUM.IDLE_WEAPON : ENTITY_STATE_ENUM.IDLE
            }
        }
        if (key) {
            record.key = {
                type: key.type,
                x: key.x,
                y: key.y,
                state: key.state
            }
        }
        if (weapon) {
            record.weapon = {
                type: weapon.type,
                x: weapon.x,
                y: weapon.y,
                state: weapon.state
            }
        }
        if (pots && pots.length) {
            const potArr = pots.map(({ type, x, y, state }) => {
                return { type, x, y, state }
            })
            record.pots = potArr
        }
        if (skull_heads && skull_heads.length) {
            // 记录了skull_heads最新状态die
            const sheads = skull_heads.map(({ type, x, y, state }) => {
                return { type, x, y, state }
            })
            record.skull_heads = sheads
        }
        if (boxes && boxes.length) {
            const boxArr = boxes.map(({ type, x, y }) => {
                return { type, x, y }
            })
            record.boxes = boxArr
        }
        if (spiders && spiders.length) {
            const spiderArr = spiders.map(({ type, x, y, state, dir }) => {
                return { type, x, y, dir, state }
            })
            record.spiders = spiderArr
        }
        if (mouses && mouses.length) {
            const mouseArr = mouses.map(({ type, x, y, state, dir }) => {
                return { type, x, y, dir, state }
            })
            record.mouses = mouseArr
        }
        DataManager.instance.records.set(subLevel.from, record)
    }

    onLevelDataRevoke(subLevel: ISubLevelData) {
        const { records } = DataManager.instance
        if (records) {
            const record = records.get(subLevel.to)
            if (!record) return
            const { player, key, weapon, pots, skull_heads, boxes, spiders, mouses } = record
            const pstate = DataManager.instance.hasItem(ENTITY_TYPE_ENUM.WEAPON) ? ENTITY_STATE_ENUM.IDLE_WEAPON : ENTITY_STATE_ENUM.IDLE
            Object.assign(DataManager.instance.player, player, { targetX: player.x, targetY: player.y, state: pstate })
            if (key) {
                DataManager.instance.key.x = key.x
                DataManager.instance.key.y = key.y
                DataManager.instance.key.dir = key.dir
                DataManager.instance.key.state = key.state
            }
            if (weapon) {
                DataManager.instance.weapon.x = weapon.x
                DataManager.instance.weapon.y = weapon.y
                DataManager.instance.weapon.dir = weapon.dir
                DataManager.instance.weapon.state = weapon.state
            }
            if (pots && pots.length) {
                pots.forEach((pot, index) => {
                    DataManager.instance.pots[index].x = pot.x
                    DataManager.instance.pots[index].y = pot.y
                    DataManager.instance.pots[index].state = pot.state
                })
            }
            if (skull_heads && skull_heads.length) {
                skull_heads.forEach((skull_head, index) => {
                    DataManager.instance.skull_heads[index].x = skull_head.x
                    DataManager.instance.skull_heads[index].y = skull_head.y
                    DataManager.instance.skull_heads[index].targetX = skull_head.x
                    DataManager.instance.skull_heads[index].targetY = skull_head.y
                    DataManager.instance.skull_heads[index].state = skull_head.state
                })
            }
            if (boxes && boxes.length) {
                boxes.forEach((box, index) => {
                    DataManager.instance.boxes[index].x = box.x
                    DataManager.instance.boxes[index].y = box.y
                    DataManager.instance.boxes[index].targetX = box.x
                    DataManager.instance.boxes[index].targetY = box.y
                })
            }
            if (spiders && spiders.length) {
                spiders.forEach((spider, index) => {
                    DataManager.instance.spiders[index].x = spider.x
                    DataManager.instance.spiders[index].y = spider.y
                    DataManager.instance.spiders[index].targetX = spider.x
                    DataManager.instance.spiders[index].targetY = spider.y
                    DataManager.instance.spiders[index].dir = spider.dir
                    DataManager.instance.spiders[index].state = spider.state
                })
            }
            if (mouses && mouses.length) {
                mouses.forEach((mouse, index) => {
                    DataManager.instance.mouses[index].x = mouse.x
                    DataManager.instance.mouses[index].y = mouse.y
                    DataManager.instance.mouses[index].targetX = mouse.x
                    DataManager.instance.mouses[index].targetY = mouse.y
                    DataManager.instance.mouses[index].state = mouse.state
                })
            }
        }
    }

    protected onDestroy(): void {
        EventManager.instance.off(EVENT_ENUM.RENDER_MAIN, this.onInitLevel)
        EventManager.instance.off(EVENT_ENUM.ENTITY_DUST_GENERATE, this.onGenerateDust)
        EventManager.instance.off(EVENT_ENUM.ENTITY_SPIDERWEB_GENERATE, this.onGenerateSpiderWeb)
        EventManager.instance.off(EVENT_ENUM.GAME_LEVEL_NEXT, this.onNextLevel)
        EventManager.instance.off(EVENT_ENUM.GAME_LEVEL_RESTART, this.onRestartLevel)
        EventManager.instance.off(EVENT_ENUM.GAME_LEVEL_DATA_RESET, this.onLevelDataReset)
        EventManager.instance.off(EVENT_ENUM.GAME_LEVEL_DATA_RECORD, this.onLevelDataRecord)
        EventManager.instance.off(EVENT_ENUM.GAME_LEVEL_DATA_REVOKE, this.onLevelDataRevoke)
    }
}
