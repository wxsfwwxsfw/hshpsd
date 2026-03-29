

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatDialog extends cc.Component {

    @property(cc.Node)
    chatBg: cc.Node = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Node)
    nextSprite: cc.Node = null;

    @property(cc.Node)
    arrowSprite: cc.Node = null;

    private interval: number = 0.05; // 每个字符的显示间隔（秒）

    dialogs: string[] = []; // 对话内容数组

    private currentText: string = "";
    private currentIndex: number = 0;
    private isTyping: boolean = false;
    private dialogIndex: number = 0;

    onLoad() {

    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);

        if (this.dialogs.length > 0) {
            this.startTyping(this.dialogs[0]);
        }
    }

    startTyping(text: string) {
        this.nextSprite.active = this.dialogIndex < this.dialogs.length - 1
        this.currentText = text;
        this.currentIndex = 0;
        this.isTyping = true;
        this.label.string = "";
        this.schedule(this.typeNextChar, this.interval);
    }

    typeNextChar() {
        if (this.currentIndex < this.currentText.length) {
            this.label.string += this.currentText[this.currentIndex++];
        } else {
            this.unschedule(this.typeNextChar);
            this.isTyping = false;
            this.dialogIndex++;
        }
    }

    onTouch() {
        if (this.isTyping) {
            // 快速完成当前对话-点击屏幕任意地方，完整显示当前对话
            this.unschedule(this.typeNextChar);
            this.label.string = this.currentText;
            this.isTyping = false;
            this.dialogIndex++;
        } else if (this.dialogIndex < this.dialogs.length) {
            // 开始下一条对话
            this.startTyping(this.dialogs[this.dialogIndex]);
        } else {
            // 所有对话结束
            this.node.emit('dialog-finished');
        }
    }

    // update(dt) { }
}
