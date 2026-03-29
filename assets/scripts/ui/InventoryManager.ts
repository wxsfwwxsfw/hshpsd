// Created by carolsail

import DataManager, { IInventoryItem } from './../runtime/DataManager';
import { EVENT_ENUM, ENTITY_TYPE_ENUM } from './../Enum';
import EventManager from "../runtime/EventManager";
import { loadSpriteFrame } from '../Util';

const {ccclass, property} = cc._decorator;

@ccclass
export default class InventoryManager extends cc.Component {

    @property(cc.Node)
    placeholder: cc.Node = null

    @property(cc.Prefab)
    weaponPrefab: cc.Prefab = null

    @property(cc.Prefab)
    keyPrefab: cc.Prefab = null

    @property(cc.Prefab)
    skullHeadPrefab: cc.Prefab = null

    @property(cc.Prefab)
    bombPrefab: cc.Prefab = null

    @property(cc.Prefab)
    shovelPrefab: cc.Prefab = null

    onLoad(){
        EventManager.instance.on(EVENT_ENUM.RENDER_INVENTORY, this.render, this)
        EventManager.instance.on(EVENT_ENUM.INVENTORY_ADD, this.add, this)
        EventManager.instance.on(EVENT_ENUM.INVENTORY_DEL, this.del, this)
    }

    render(){
        this.placeholder.destroyAllChildren()
        const items = DataManager.instance.items
        if(items.length > 0){
            items.forEach(item=>{
                if(item.num > 0){
                    this.generateItem(item)
                }
            })
        }
    }

    generateItem(item: IInventoryItem){
        let node: cc.Node = null
        switch(item.type){
            case ENTITY_TYPE_ENUM.KEY:
                node = cc.instantiate(this.keyPrefab)
            break
            case ENTITY_TYPE_ENUM.WEAPON:
                node = cc.instantiate(this.weaponPrefab)
            break
            case ENTITY_TYPE_ENUM.SKULL_HEAD:
                node = cc.instantiate(this.skullHeadPrefab)
            break
            case ENTITY_TYPE_ENUM.BOMB:
                node = cc.instantiate(this.bombPrefab)
            break
            case ENTITY_TYPE_ENUM.SHOVEL:
                node = cc.instantiate(this.shovelPrefab)
            break
            case ENTITY_TYPE_ENUM.PEACH:
                node = cc.instantiate(this.skullHeadPrefab)
            break
            case ENTITY_TYPE_ENUM.MUSHROOM:
                node = cc.instantiate(this.skullHeadPrefab)
            break
        }
        if (!node) return
        this.placeholder.addChild(node)
        this.applyItemIcon(node, item.type)

        let num = ''
        if(item.num > 1) num = `${item.num}`
        const label = node?.getChildByName('num')
        if(label) label.getComponent(cc.Label).string = num

        const button = node?.getComponent(cc.Button)
        if(button){
            const event = new cc.Component.EventHandler()
            event.target = this.node // 挂载脚本节点
            event.component = "InventoryManager" // 脚本名字
            event.handler = "onItemTouch" // 方法名
            event.customEventData = `${item.type}` // 传递参数
            button.clickEvents.push(event)
        }
    }

    async applyItemIcon(node: cc.Node, type: ENTITY_TYPE_ENUM) {
        let path = ''
        switch (type) {
            case ENTITY_TYPE_ENUM.PEACH:
                path = 'peach/peach_bait'
                break
            case ENTITY_TYPE_ENUM.MUSHROOM:
                path = 'mushroom/cave_mushroom'
                break
            default:
                return
        }
        const iconNode = node.children.find(child => child.name !== 'bg' && child.name !== 'num')
        const sprite = iconNode?.getComponent(cc.Sprite)
        if (!sprite) return
        try {
            sprite.spriteFrame = await loadSpriteFrame(path)
        } catch (error) {
            console.warn(`load inventory icon failed: ${path}`, error)
        }
    }

    add(type: ENTITY_TYPE_ENUM){
        const item = DataManager.instance?.items.find(item=>item.type == type)
        if(item){
            item.num++
        }else{
            DataManager.instance.items.push({type, num: 1})
        }
        this.render()
    }

    del(type: ENTITY_TYPE_ENUM){
        const index = DataManager.instance?.items.findIndex(item=>item.type == type)
        if(index > -1){
            const item = DataManager.instance.items[index]
            if(item.num == 1){
                DataManager.instance.items.splice(index, 1)
            }else{
                item.num--
            }
            this.render()
        }
    }

    onItemTouch(_: cc.Event, type: ENTITY_TYPE_ENUM){
        switch(type){
            case ENTITY_TYPE_ENUM.WEAPON:
            case ENTITY_TYPE_ENUM.KEY:
            case ENTITY_TYPE_ENUM.SKULL_HEAD:
            case ENTITY_TYPE_ENUM.BOMB:
            case ENTITY_TYPE_ENUM.SHOVEL:
            case ENTITY_TYPE_ENUM.PEACH:
            case ENTITY_TYPE_ENUM.MUSHROOM:
                EventManager.instance.emit(EVENT_ENUM.INVENTORY_TOUCH, type)
            break
        }
    }

    protected onDestroy(): void {
        EventManager.instance.off(EVENT_ENUM.RENDER_INVENTORY, this.render)
        EventManager.instance.off(EVENT_ENUM.INVENTORY_ADD, this.add)
        EventManager.instance.off(EVENT_ENUM.INVENTORY_DEL, this.del)
    }
}
