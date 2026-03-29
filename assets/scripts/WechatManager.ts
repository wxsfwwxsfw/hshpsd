// Created by carolsail

const {ccclass, property} = cc._decorator;

@ccclass
export default class WechatManager extends cc.Component {

    // 横幅广告
    private adBannerUnitId: string = '';
    private bannerAd = null;

    private shareMsg: string = '谁来救救我，我被困在第18层地牢了';

    onLoad () {
        cc.game.addPersistRootNode(this.node)
        this.passiveShare()
        this.initBannerAd();
    }

    // 初始化横幅广告
    initBannerAd(){
        if (typeof wx === 'undefined' || this.adBannerUnitId == '') return;
        let winSize = wx.getSystemInfoSync();
        if(this.bannerAd == null){
            this.bannerAd = wx.createBannerAd({
                adUnitId: this.adBannerUnitId,
                adIntervals: 15,
                style: {
                    height: winSize.windowHeight - 80,
                    left: 0,
                    top: 500,
                    width: winSize.windowWidth
                }
            });
            this.bannerAd.onResize((res: any) => {
                this.bannerAd.style.top = winSize.windowHeight - this.bannerAd.style.realHeight;
                this.bannerAd.style.left = winSize.windowWidth / 2 - this.bannerAd.style.realWidth / 2;
            });
            this.bannerAd.onError((err: any) => {});
        }
    }

    // 被动分享
    passiveShare() {
        // 监听小程序右上角菜单的「转发」按钮
        if (typeof wx === 'undefined') return;
        // 显示当前页面的转发按钮
        wx.showShareMenu({
            success: (res: any) => {},
            fail: (res: any) => {}
        });
        // 获取当前棋局oneChess信息，JSON.stringfy()后传入query
        wx.onShareAppMessage(() => {
            return { title: this.shareMsg }
        });
    }

    // 跳转其他小游戏
    turnToApp(appId: string){
        if (typeof wx === 'undefined') return;
        wx.navigateToMiniProgram({
            appId: appId
        });
    }
}
