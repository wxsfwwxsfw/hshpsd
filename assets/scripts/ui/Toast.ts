const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    contentLabel: cc.Label = null;

    onLoad() {
        // this.node.opacity = 0
        this.contentLabel.node.color = cc.Color.WHITE
    }

    start() {

    }

    show(str: string) {
        this.contentLabel.string = str
        this.node.runAction(cc.sequence(
            cc.fadeIn(0.2),
            cc.delayTime(0.8),
            cc.fadeOut(0.6),
            cc.callFunc(() => {
                this.node.removeFromParent()
            })
        ))
    }
    // update (dt) {}
}
