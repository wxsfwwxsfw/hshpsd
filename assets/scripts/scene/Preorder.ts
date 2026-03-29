import { AUDIO_EFFECT_ENUM, EVENT_ENUM, GAME_SCENE_ENUM } from "../Enum";
import ChatDialog from "../prefabs/ChatDialog";
import DataManager from "../runtime/DataManager";
import EventManager from "../runtime/EventManager";
import LayerManager from "../runtime/LayerManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Preorder extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Button)
    nextButton: cc.Button = null;

    @property(cc.Node)
    animationNode: cc.Node = null;

    // 配置参数
    duration: number = 2;

    startColor: cc.Color = new cc.Color(0, 0, 0, 255); // 纯黑

    endColor: cc.Color = new cc.Color(135, 206, 235, 0); // 浅蓝色+透明

    private isShowChatDialog: boolean = false;
    private playerStandUp: boolean = false;


    start() {

    }

    onLoad() {
        DataManager.instance.showPreorder = true
    }

    async nextStep() {
        if (this.isShowChatDialog == false) {
            this.showChatDialog()
        } else if (this.playerStandUp == false) {
            this.playerAnimation()
        } else {
            this.backgroundAnimation()

            setTimeout(async () => {
                EventManager.instance.emit(EVENT_ENUM.EFFECT_AUDIO_PLAY, AUDIO_EFFECT_ENUM.GAME_CLICK)
                await LayerManager.instance.fadeIn()
                cc.director.loadScene(GAME_SCENE_ENUM.MAIN)
            }, 360);
        }
    }

    showChatDialog() {
        // let animation = this.animationNode.getComponent(cc.Animation)
        // animation.pause()
        this.animationNode.active = false
        // 加载位于 resources 目录下的 Prefab
        cc.resources.load('prefabs/ChatDialog', cc.Prefab, (err, prefab) => {
            if (err) {
                console.error('Failed to load prefab:', err);
                return;
            }

            // 实例化 Prefab
            const newNode: cc.Node = cc.instantiate(prefab as cc.Prefab);

            const dialog = newNode.getComponent(ChatDialog);
            dialog.dialogs = ['大师兄, 师父被妖怪抓走了……'];
            // dialog.dialogs = ['大师兄，师傅被妖怪抓走了！大师兄，师傅被妖怪抓走了！', '二师兄，师父被妖怪抓走了！二师兄，师父被妖怪抓走了！', '大师兄、二师兄，师傅被妖怪抓走了！'];
            dialog.chatBg.setPosition(80, 200);
            dialog.arrowSprite.setPosition(180, -58.3);
            dialog.arrowSprite.scaleX = -1;

            // 将实例化后的节点添加到当前节点下
            this.node.addChild(newNode);

            // 在其他脚本中监听事件
            dialog.node.on('dialog-finished', () => {
                dialog.node.active = false; // 关闭对话框
            });

            this.isShowChatDialog = true;
        });
    }

    backgroundAnimation() {
        console.log("backgroundAnimation");
        // 设置初始状态
        this.background.color = this.startColor

        // 创建Tween动画
        // cc.tween(this.background.color)
        //     .to(this.duration, {
        //         r: this.endColor.r,
        //         g: this.endColor.g,
        //         b: this.endColor.b,
        //         a: this.endColor.a
        //     }, {
        //         progress: (start, end, current) => {
        //             return new cc.Color(current.r, current.g, current.b, current.a)
        //         }
        //     })
        //     .start()

        cc.tween(this.background)
            .to(this.duration, { color: this.endColor })
            .start()
        // this.background.node.runAction(cc.sequence(
        //     cc.fadeIn(0.5),
        //     cc.delayTime(1),
        //     cc.fadeOut(0.5)
        // ));
    }

    playerAnimation() {
        cc.tween(this.player)
            .to(0.4, { angle: 0 })
            // 当前面的动作都执行完毕后才会调用这个回调函数
            .call(() => {
                console.log('player animation finish')
                this.playerStandUp = true
            })
            .start()
    }

    // update (dt) {}
}
