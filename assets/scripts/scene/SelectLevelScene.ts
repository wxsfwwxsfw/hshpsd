import { AUDIO_EFFECT_ENUM, EVENT_ENUM } from './../Enum';
// Created by carolsail

import { GAME_SCENE_ENUM } from './../Enum';
import { LEVEL_COUNT } from "../level/Index";
import DataManager from "../runtime/DataManager";
import EventManager from '../runtime/EventManager';
import LayerManager from '../runtime/LayerManager';

const LEVEL_NAMES: Record<string, string> = {
    '1': '贪桃',
    '2': '退路',
    '3': '险径',
    '4': '推关',
    '5': '引蛛',
    '6': '两关',
    '7': '险关',
    '8': '绝境',
    '9': '移障',
    '10': '暗渡',
    '11': '三煞',
    '12': '连环',
    '13': '四面',
    '14': '复道',
    '15': '深渊',
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectLevelScene extends cc.Component {

    @property(cc.Prefab)
    levelItem: cc.Prefab = null;

    @property(cc.Node)
    levelContentNode: cc.Node = null;

    onLoad(){
        LayerManager.instance.fadeOut()
        cc.director.preloadScene(GAME_SCENE_ENUM.MENU)
        cc.director.preloadScene(GAME_SCENE_ENUM.MAIN)
        this.render()
    }

    render() {
        this.levelContentNode.removeAllChildren()
        for(let i = 1; i <= LEVEL_COUNT; i++){
            const item = cc.instantiate(this.levelItem)
            item.setParent(this.levelContentNode)
            const label = item.getChildByName('level').getComponent(cc.Label)
            const name = LEVEL_NAMES[String(i)]
            const numName = 'L' + i
            if (name) {
                label.string = numName + '\n' + name
                label.fontSize = 20
            } else {
                label.string = numName
                label.fontSize = 26
            }
            item.getChildByName('bg').active = false
            const button = item.getComponent(cc.Button)
            button.enabled = true
            const event = new cc.Component.EventHandler()
            event.target = this.node
            event.component = "SelectLevelScene"
            event.handler = "onLevelItemSelect"
            event.customEventData = `${i}`
            button.clickEvents.push(event)
        }
    }

    async onLevelItemSelect(_: cc.Event, _level: string){
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.GAME_CLICK)
        await LayerManager.instance.fadeIn()
        const level = parseInt(_level) as number
        DataManager.instance.currentLevel = level
        cc.director.loadScene(GAME_SCENE_ENUM.MAIN)
    }

    async onBack(){
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.GAME_CLICK)
        await LayerManager.instance.fadeIn()
        cc.director.loadScene(GAME_SCENE_ENUM.MENU)
    }
}
