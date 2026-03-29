// Created by carolsail 

import { GAME_SCENE_ENUM } from "../Enum";
import DataManager from "../runtime/DataManager";
import LayerManager from "../runtime/LayerManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingScene extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    
    onLoad () {
        cc.director.preloadScene(GAME_SCENE_ENUM.MENU)
        cc.resources.preloadDir("/", (current: number, total: number)=>{
            this.progressBar.progress = current / total
        }, async ()=>{
            // 读取存档信息
            DataManager.instance.restore()
            await LayerManager.instance.fadeIn()
            cc.director.loadScene(GAME_SCENE_ENUM.MENU)
        })
    }
}
