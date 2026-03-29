// Created by carolsail 

import { AUDIO_EFFECT_ENUM, EVENT_ENUM, GAME_SCENE_ENUM } from "../Enum";
import DataManager from "../runtime/DataManager";
import EventManager from "../runtime/EventManager";
import LayerManager from "../runtime/LayerManager";
import { showToast } from "../Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuScene extends cc.Component {

    protected onLoad(): void {
        LayerManager.instance.fadeOut()
        cc.director.preloadScene(GAME_SCENE_ENUM.MAIN)
        cc.director.preloadScene(GAME_SCENE_ENUM.SELECT_LEVEL)
        EventManager.instance.on(EVENT_ENUM.RENDER_MENU, this.render, this)
        this.render()
    }

    render() {
        const on = cc.find('Canvas/Action/audio/on')
        const off = cc.find('Canvas/Action/audio/off')
        on.active = DataManager.instance.isAudioEnable
        off.active = !DataManager.instance.isAudioEnable
    }

    async onStartGame() {
        if (DataManager.instance.showPreorder == false) {
            await LayerManager.instance.fadeIn()
            cc.director.loadScene(GAME_SCENE_ENUM.PREORDER)
            return
        }
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.GAME_CLICK)
        await LayerManager.instance.fadeIn()
        cc.director.loadScene(GAME_SCENE_ENUM.MAIN)
    }

    async onSelectLevel() {
        if (DataManager.instance.showPreorder == false) {
            showToast('暂无过关关卡，请直接开始游戏')
            return
        }
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.GAME_CLICK)
        await LayerManager.instance.fadeIn()
        cc.director.loadScene(GAME_SCENE_ENUM.SELECT_LEVEL)
    }

    onAudioSwitch() {
        EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.GAME_CLICK)
        DataManager.instance.isAudioEnable = !DataManager.instance.isAudioEnable
        EventManager.instance.emit(EVENT_ENUM.RENDER_MENU)
    }

    protected onDestroy(): void {
        EventManager.instance.off(EVENT_ENUM.RENDER_MENU, this.render)
    }
}
