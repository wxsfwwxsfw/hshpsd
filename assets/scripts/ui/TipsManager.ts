import { EVENT_ENUM, TIP_NODE_ENUM, NODE_ZINDEX_ENUM, GAME_SCENE_ENUM } from './../Enum';
// Created by carolsail

import EventManager from "../runtime/EventManager";
import DataManager from '../runtime/DataManager';
import LayerManager from '../runtime/LayerManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsManager extends cc.Component {
    private currentTip: TIP_NODE_ENUM

    onLoad(){
        EventManager.instance.on(EVENT_ENUM.RENDER_TIPS, this.render, this)
        EventManager.instance.on(EVENT_ENUM.CLOSE_TIPS, this.onTipsClose, this)
        this.node.zIndex = NODE_ZINDEX_ENUM.TIPS
    }

    render(name: TIP_NODE_ENUM = TIP_NODE_ENUM.EMPTY){
        console.log(name)
        this.node.children.forEach(tip=>{
            if(tip.name === name){
                this.currentTip = name
                tip.active = true
                tip.once(cc.Node.EventType.TOUCH_START, this.onTipsClose, this)
            }else{
                tip.active = false
            }
        })
    }

    async onTipsClose(){
        if(this.currentTip == TIP_NODE_ENUM.LEVEL_COMPLETE){
            await LayerManager.instance.fadeIn()
            cc.director.loadScene(GAME_SCENE_ENUM.MENU)
        }else{
            EventManager.instance.emit(EVENT_ENUM.RENDER_TIPS, TIP_NODE_ENUM.EMPTY)
        }
    }

    protected onDestroy(): void {
        EventManager.instance.off(EVENT_ENUM.RENDER_TIPS, this.render)
        EventManager.instance.off(EVENT_ENUM.CLOSE_TIPS, this.onTipsClose)
    }
}
