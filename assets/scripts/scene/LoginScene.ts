const STORAGE_KEY = 'HSH_STORAGE_KEY'

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {

    @property(cc.Button)
    startBtn: cc.Button = null;

    @property(cc.Button)
    settingsBtn: cc.Button = null;

    @property(cc.Button)
    clearBtn: cc.Button = null;

    onLoad() {
        cc.director.preloadScene('Main')
        this.startPulse()
    }

    startPulse() {
        const node = this.startBtn.node
        const scaleUp = cc.scaleTo(0.6, 1.06, 1.06).easing(cc.easeSineInOut())
        const scaleDown = cc.scaleTo(0.6, 1.0, 1.0).easing(cc.easeSineInOut())
        node.runAction(cc.repeatForever(cc.sequence(scaleUp, scaleDown)))
    }

    enterMainScene() {
        const node = this.startBtn.node
        node.stopAllActions()
        const click = cc.sequence(
            cc.scaleTo(0.08, 0.9, 0.9),
            cc.scaleTo(0.12, 1.1, 1.1),
            cc.scaleTo(0.08, 1.0, 1.0),
            cc.callFunc(() => {
                cc.director.loadScene('Main')
            })
        )
        node.runAction(click)
    }

    onSettingsClick() {
        // TODO: 打开设置面板
    }

    onClearClick() {
        cc.sys.localStorage.removeItem(STORAGE_KEY)
    }
}
