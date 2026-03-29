import DeadBody1 from './entity/dead_body1/DeadBody1';
import DeadBody2 from './entity/dead_body2/DeadBody2';
import Entity from './entity/Entity';
import { ENTITY_TYPE_ENUM, FLOOR_SPIKE_NUM_ENUM, INPUT_PROCESS_ENUM, EVENT_ENUM, ENTITY_STATE_ENUM } from './Enum';
// Created by carolsail

import { ENTITY_DIRECTION_ENUM } from "./Enum"
import ChatDialog from './prefabs/ChatDialog';
import DataManager from './runtime/DataManager';
import EventManager from './runtime/EventManager';

// 随机数
export function randomByRange(min: number, max: number) {
    const num = min + (max - min) * Math.random()
    return Math.floor(num)
}

// 获取当前什时间戳
export function getCurrentTimeStamp() {
    return Date.now()
}

// 加载sprite atlas
export function loadSpriteAtlas(url: string): Promise<cc.SpriteAtlas> {
    return new Promise((resolve, reject) => {
        cc.resources.load(url, cc.SpriteAtlas, (err, res: cc.SpriteAtlas) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

// 加载sprite frame
export function loadSpriteFrame(url: string): Promise<cc.SpriteFrame> {
    return new Promise((resolve, reject) => {
        cc.resources.load(url, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

// 加载spine
export function loadSpine(url: string): Promise<sp.SkeletonData> {
    return new Promise((resolve, reject) => {
        cc.resources.load(url, sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (err) reject(err)
            // console.log('——————————————————————————spine数据加载成功', res)
            resolve(res)
        })
    })
}

// 加载prefab
export function loadPrefab(url: string): Promise<cc.Prefab> {
    return new Promise((resolve, reject) => {
        cc.resources.load(url, cc.Prefab, (err, res: cc.Prefab) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

// 左上角坐标点的节点
export function createNodeWithLT(name?: string) {
    const node: cc.Node = new cc.Node()
    node.setAnchorPoint(cc.v2(0, 1));
    if (name) node.name = name
    return node
}

// 方向枚举与索引值之间映射
export function getIndexFromEntityDirectionEnum(data: ENTITY_DIRECTION_ENUM): number {
    let val = 0
    switch (data) {
        case ENTITY_DIRECTION_ENUM.UP:
            val = 0
            break
        case ENTITY_DIRECTION_ENUM.RIGHT:
            val = 1
            break
        case ENTITY_DIRECTION_ENUM.DOWN:
            val = 2
            break
        case ENTITY_DIRECTION_ENUM.LEFT:
            val = 3
            break
    }
    return val
}

// 索引值与方向枚举之间映射
export function getEnumfromEntityDirectionIndex(index: number): ENTITY_DIRECTION_ENUM {
    let val = ENTITY_DIRECTION_ENUM.UP
    switch (index) {
        case 0:
            val = ENTITY_DIRECTION_ENUM.UP
            break
        case 1:
            val = ENTITY_DIRECTION_ENUM.RIGHT
            break
        case 2:
            val = ENTITY_DIRECTION_ENUM.DOWN
            break
        case 3:
            val = ENTITY_DIRECTION_ENUM.LEFT
            break
    }
    return val
}

// 尖刺类型和尖刺总数之间映射
export function getTotalFromFloorSpikeTypeEnum(type: ENTITY_TYPE_ENUM): number {
    let total = 0
    switch (type) {
        case ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE:
            total = 2
            break
        case ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO:
            total = 3
            break
        case ENTITY_TYPE_ENUM.FLOOR_SPIKE_THREE:
            total = 4
            break
        case ENTITY_TYPE_ENUM.FLOOR_SPIKE_FOUR:
            total = 5
            break
    }
    return total
}

// 数值对应尖刺数类型枚举
export function getFloorSpikeNumEnumFromNum(num: number): FLOOR_SPIKE_NUM_ENUM {
    let type: FLOOR_SPIKE_NUM_ENUM = FLOOR_SPIKE_NUM_ENUM.ZERO
    switch (num) {
        case 0:
            type = FLOOR_SPIKE_NUM_ENUM.ZERO
            break
        case 1:
            type = FLOOR_SPIKE_NUM_ENUM.ONE
            break
        case 2:
            type = FLOOR_SPIKE_NUM_ENUM.TWO
            break
        case 3:
            type = FLOOR_SPIKE_NUM_ENUM.THREE
            break
        case 4:
            type = FLOOR_SPIKE_NUM_ENUM.FOUR
            break
        case 5:
            type = FLOOR_SPIKE_NUM_ENUM.FIVE
            break
    }
    return type
}

// 输入方向枚举与实体方向之间映射
export function getEntityDirectionEnumFromInputProcessEnum(input: INPUT_PROCESS_ENUM): ENTITY_DIRECTION_ENUM {
    let dir = ENTITY_DIRECTION_ENUM.DOWN
    if (input == INPUT_PROCESS_ENUM.UP) dir = ENTITY_DIRECTION_ENUM.UP
    if (input == INPUT_PROCESS_ENUM.LEFT) dir = ENTITY_DIRECTION_ENUM.LEFT
    if (input == INPUT_PROCESS_ENUM.RIGHT) dir = ENTITY_DIRECTION_ENUM.RIGHT
    return dir
}

/**
 * 游戏请求图片资源进行排序
 */
export function sortBySpriteName(frames: cc.SpriteFrame[]) {
    return frames.sort((a, b) => getNumberInSpriteName(a.name) - getNumberInSpriteName(b.name))
}
const getNumberInSpriteName = (name: string) => {
    const reg = /\d+/g
    return parseInt(name.match(reg)[0] || '0')
}

//展示对话
export function showChatDialog(entity: Entity) {
    let list: string[] = []
    switch (entity.type) {
        case ENTITY_TYPE_ENUM.TREE:
            list = ['小猴儿，是要只身闯这险关不成？', '前头那些陶罐厚实得很，赤手空拳可不够使。', '老夫在此守了百年，这根枝桠便赠予你了，去吧。']
            break
        case ENTITY_TYPE_ENUM.DEAD_BODY:
            if (entity instanceof DeadBody1) {
                list = ['你为何戴着那可笑面具？']
            } else if (entity instanceof DeadBody2) {
                list = ['爹爹的刀，娘亲的腰，天庭的桃子吃个饱……']
            }
            break
        default:
            break
    }

    //坐标转换
    const tileWidth = DataManager.instance.currentLevelTileWidth
    const positionX = (entity.x + 1) * tileWidth - tileWidth / 2 - (750 / 2)
    const positionY = 474.5 - entity.y * tileWidth

    //聊天框水平方向 默认居中
    const chatBgX = 0
    //聊天气泡箭头高度：24  聊天框背景高度：98
    const chatBgY = positionY + 24 + 98 / 2

    const scaleX = positionX >= 0 ? -1 : 1

    const arrowX = positionX + scaleX * 24

    console.log('NPC实际坐标', positionX, positionY)

    // 加载位于 resources 目录下的 Prefab
    cc.resources.load('prefabs/ChatDialog', cc.Prefab, (err, prefab) => {
        if (err) {
            console.error('Failed to load prefab:', err)
            return
        }

        // 实例化 Prefab
        const newNode: cc.Node = cc.instantiate(prefab as cc.Prefab)

        const dialog = newNode.getComponent(ChatDialog)
        dialog.dialogs = list
        dialog.chatBg.setPosition(chatBgX, chatBgY)
        dialog.arrowSprite.setPosition(arrowX, -58.3)
        dialog.arrowSprite.scaleX = scaleX

        // 将实例化后的节点添加到当前节点下
        const node = cc.find('Canvas')
        console.log('当前node', node)
        node.addChild(newNode)

        // 在其他脚本中监听事件
        dialog.node.on('dialog-finished', () => {
            dialog.node.active = false; // 关闭对话框
            // 树精赠武器：对话结束后将武器加入背包，并更新玩家持械状态
            if (entity.type === ENTITY_TYPE_ENUM.TREE) {
                EventManager.instance.emit(EVENT_ENUM.INVENTORY_ADD, ENTITY_TYPE_ENUM.WEAPON)
                if (DataManager.instance.player) {
                    DataManager.instance.player.state = ENTITY_STATE_ENUM.IDLE_WEAPON
                }
            }
        });
    })
}

//Toast
export function showToast(str: string) {
    // 加载位于 resources 目录下的 Prefab
    cc.resources.load('prefabs/Toast', cc.Prefab, (err, prefab) => {
        if (err) {
            console.error('Failed to load prefab:', err)
            return
        }

        // 实例化 Prefab
        const newNode: cc.Node = cc.instantiate(prefab as cc.Prefab)
        // 将实例化后的节点添加到当前节点下
        const node = cc.find('Canvas')
        node.addChild(newNode)
        newNode.getComponent('Toast').show(str)
    })
}