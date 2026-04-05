import DataManager from "../runtime/DataManager";

const STORAGE_KEY = 'HSH_STORAGE_KEY'
const BAIING_PATHS = ['story/baiing_01', 'story/baiing_02', 'story/baiing_03']
const STORY_AUDIO_PATH = 'story/store'
const STORY_FALLBACK_DURATION = 9

const IMG2_FRACTION = 0.40
const IMG3_FRACTION = 0.70

const SCREEN_W = 750
const SCREEN_H = 1334
const DISPLAY_W = 700

// baiing_01=750×504, baiing_02=750×401, baiing_03=750×439
const IMG_SIZES = [
    { w: DISPLAY_W, h: Math.round(504 * DISPLAY_W / 750) },
    { w: DISPLAY_W, h: Math.round(401 * DISPLAY_W / 750) },
    { w: DISPLAY_W, h: Math.round(439 * DISPLAY_W / 750) },
]

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {

    @property(cc.Button)
    startBtn: cc.Button = null;

    @property(cc.Button)
    settingsBtn: cc.Button = null;

    @property(cc.Button)
    clearBtn: cc.Button = null;

    private storyAudioId: number = -1;
    private storyTimeouts: number[] = [];
    private isFinishing: boolean = false;
    private isChapterShowing: boolean = false;
    private imgNodes: cc.Node[] = [];
    private overlay: cc.Node = null;
    private chapterFont: cc.Font = null;
    private uiFont: cc.Font = null;

    onLoad() {
        cc.director.preloadScene('Main')
        cc.resources.load('fonts/dfdk', cc.Font, (err, font) => {
            if (!err) this.chapterFont = font as cc.Font
        })
        cc.resources.load('fonts/LXGWWenKai-Medium', cc.Font, (err, font) => {
            if (!err) this.uiFont = font as cc.Font
        })
    }

    enterMainScene() { this.onStartGame() }
    onSettingsClick() {}
    onClearClick() {
        cc.sys.localStorage.removeItem(STORAGE_KEY)
    }

    onStartGame() {
        this.node.children.forEach(child => {
            if (!child.getComponent(cc.Camera)) {
                child.active = false
            }
        })
        this.scheduleOnce(() => this.playBaiingStory(), 0.1)
    }

    private async playBaiingStory() {
        try {
            const [frames, audio] = await Promise.all([
                Promise.all(BAIING_PATHS.map(p => this.loadSpriteFrame(p))),
                this.loadAudioClip(STORY_AUDIO_PATH).catch(() => null)
            ])

            this.overlay = this.createOverlay()
            this.buildImages(this.overlay, frames)

            // Click anywhere to skip to chapter title
            this.overlay.on(cc.Node.EventType.TOUCH_END, this.onStoryTouch, this)

            let duration = STORY_FALLBACK_DURATION
            if (audio) {
                const d = (audio as any).getDuration?.() ||
                          (typeof (audio as any).duration === 'number' ? (audio as any).duration : 0)
                if (d > 0) duration = d
            }

            if (DataManager.instance.isAudioEnable && audio) {
                this.storyAudioId = cc.audioEngine.playEffect(audio, false)
            }

            this.storyTimeouts.push(window.setTimeout(() => {
                this.revealImage(1)
            }, duration * IMG2_FRACTION * 1000))

            this.storyTimeouts.push(window.setTimeout(() => {
                this.revealImage(2)
            }, duration * IMG3_FRACTION * 1000))

            // Story ends → go to chapter title
            this.storyTimeouts.push(window.setTimeout(() => {
                this.showChapterTitle()
            }, (duration + 0.3) * 1000))

        } catch (e) {
            cc.error('[Story] Failed:', e)
            this.finish()
        }
    }

    private onStoryTouch() {
        this.showChapterTitle()
    }

    // ─── Chapter title screen ────────────────────────────────────────────

    private showChapterTitle() {
        if (this.isChapterShowing || this.isFinishing) return
        this.isChapterShowing = true

        // Stop story audio & pending timers
        if (this.storyAudioId !== -1) {
            cc.audioEngine.stopEffect(this.storyAudioId)
            this.storyAudioId = -1
        }
        this.storyTimeouts.forEach(id => clearTimeout(id))
        this.storyTimeouts = []

        // Hide comic
        if (this.overlay && cc.isValid(this.overlay)) {
            this.overlay.active = false
        }

        const canvas = cc.find('Canvas')
        const screen = this.buildChapterScreen()
        canvas.addChild(screen)

        // Fade in
        screen.opacity = 0
        cc.tween(screen).to(0.6, { opacity: 255 }).start()

        // Touch anywhere to enter game
        screen.on(cc.Node.EventType.TOUCH_END, this.finish, this)
        // Any key to enter game
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.finish, this)
    }

    private buildChapterScreen(): cc.Node {
        const screen = new cc.Node('ChapterScreen')
        screen.setAnchorPoint(0.5, 0.5)
        screen.setContentSize(SCREEN_W, SCREEN_H)
        screen.setPosition(0, 0)
        screen.zIndex = 1000

        // ── Black background ──
        const bg = new cc.Node('BG')
        bg.setAnchorPoint(0.5, 0.5)
        bg.setContentSize(SCREEN_W, SCREEN_H)
        bg.setPosition(0, 0)
        bg.zIndex = 0
        const g = bg.addComponent(cc.Graphics)
        g.fillColor = new cc.Color(0, 0, 0, 255)
        g.fillRect(-SCREEN_W / 2, -SCREEN_H / 2, SCREEN_W, SCREEN_H)
        screen.addChild(bg)

        // ── Top decorative line ──
        screen.addChild(this.makeLine(160, 140, 0.4))

        // ── "第一章" ──
        screen.addChild(this.makeLabel('第  一  章', 28, new cc.Color(160, 140, 100), 0, 100, this.uiFont))

        // ── Bottom decorative line ──
        screen.addChild(this.makeLine(160, 62, 0.4))

        // ── Chapter title ──
        screen.addChild(this.makeLabel('树  下  有  声', 68, new cc.Color(240, 230, 210), 0, -20, this.chapterFont))

        // ── Long divider ──
        screen.addChild(this.makeLine(320, -110, 0.6))

        // ── Continue hint (blinking) ──
        const hint = this.makeLabel('按任意键继续', 22, new cc.Color(120, 110, 90), 0, -260, this.uiFont)
        cc.tween(hint)
            .repeatForever(
                cc.tween<cc.Node>()
                    .to(0.9, { opacity: 40 }, { easing: 'sineInOut' })
                    .to(0.9, { opacity: 220 }, { easing: 'sineInOut' })
            )
            .start()
        screen.addChild(hint)

        return screen
    }

    private makeLabel(text: string, fontSize: number, color: cc.Color, x: number, y: number, font?: cc.Font): cc.Node {
        const node = new cc.Node()
        node.setAnchorPoint(0.5, 0.5)
        node.setPosition(x, y)
        node.color = color
        node.zIndex = 1
        const label = node.addComponent(cc.Label)
        label.string = text
        label.fontSize = fontSize
        label.lineHeight = fontSize + 8
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER
        label.verticalAlign = cc.Label.VerticalAlign.CENTER
        if (font) label.font = font
        return node
    }

    private makeLine(width: number, y: number, alpha: number): cc.Node {
        const node = new cc.Node()
        node.setPosition(0, y)
        node.zIndex = 1
        const g = node.addComponent(cc.Graphics)
        g.strokeColor = new cc.Color(180, 160, 100, Math.round(alpha * 255))
        g.lineWidth = 1
        g.moveTo(-width / 2, 0)
        g.lineTo(width / 2, 0)
        g.stroke()
        return node
    }

    // ─── Comic helpers ───────────────────────────────────────────────────

    private createOverlay(): cc.Node {
        const canvas = cc.find('Canvas')
        const overlay = new cc.Node('BaiingOverlay')
        overlay.setAnchorPoint(0.5, 0.5)
        overlay.setContentSize(SCREEN_W, SCREEN_H)
        overlay.setPosition(0, 0)
        overlay.zIndex = 999
        canvas.addChild(overlay)
        return overlay
    }

    private buildImages(overlay: cc.Node, frames: cc.SpriteFrame[]) {
        const totalH = IMG_SIZES.reduce((s, img) => s + img.h, 0)
        let currentY = totalH / 2  // top of first image, stack is vertically centered

        for (let i = 0; i < frames.length; i++) {
            const { w, h } = IMG_SIZES[i]
            const imgNode = new cc.Node(`Img${i + 1}`)
            imgNode.setAnchorPoint(0.5, 1)
            imgNode.setContentSize(w, h)
            imgNode.setPosition(0, currentY)
            imgNode.opacity = i === 0 ? 255 : 0

            const sprite = imgNode.addComponent(cc.Sprite)
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM
            sprite.spriteFrame = frames[i]

            overlay.addChild(imgNode)
            this.imgNodes.push(imgNode)
            currentY -= h
        }
    }

    private revealImage(index: number) {
        if (this.isChapterShowing || this.isFinishing) return
        const node = this.imgNodes[index]
        if (!node || !cc.isValid(node)) return
        const finalY = node.y
        node.y = finalY - 30
        node.opacity = 0
        cc.tween(node)
            .to(0.6, { y: finalY, opacity: 255 }, { easing: 'sineOut' })
            .start()
    }

    // ─── Finish ──────────────────────────────────────────────────────────

    private finish = () => {
        if (this.isFinishing) return
        this.isFinishing = true
        this.storyTimeouts.forEach(id => clearTimeout(id))
        this.storyTimeouts = []
        if (this.storyAudioId !== -1) {
            cc.audioEngine.stopEffect(this.storyAudioId)
            this.storyAudioId = -1
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.finish, this)
        cc.director.loadScene('Main')
    }

    // ─── Loaders ─────────────────────────────────────────────────────────

    private loadSpriteFrame(path: string): Promise<cc.SpriteFrame> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, cc.Texture2D, (err, tex: cc.Texture2D) => {
                if (err) { reject(err); return }
                const frame = new cc.SpriteFrame(tex, new cc.Rect(0, 0, tex.width, tex.height))
                resolve(frame)
            })
        })
    }

    private loadAudioClip(path: string): Promise<cc.AudioClip> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, cc.AudioClip, (err, res: cc.AudioClip) => {
                if (err) { reject(err); return }
                resolve(res)
            })
        })
    }

    onDestroy() {
        this.storyTimeouts.forEach(id => clearTimeout(id))
        if (this.storyAudioId !== -1) {
            cc.audioEngine.stopEffect(this.storyAudioId)
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.finish, this)
    }
}
