// Created by carolsail

const {ccclass, property} = cc._decorator;

@ccclass
export default class FadeManager extends cc.Component {
    onLoad(){
         // 常驻节点（多场景共用）
        cc.game.addPersistRootNode(this.node)
        this.node.opacity = 0
    }

    fadeIn(seconds: number = 0.2){
        return new Promise(resolve=>{
            this.node.opacity = 0
            cc.tween(this.node).to(seconds, {opacity: 255}).call(()=>{
                resolve('fade in over')
            }).start()
        })
    }

    fadeOut(seconds: number = 0.2){
        return new Promise(resolve=>{
            this.node.opacity = 255
            cc.tween(this.node).to(seconds, {opacity: 0}).call(()=>{
                resolve('fade out over')
            }).start()
        })
    }
}
