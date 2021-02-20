import { _decorator, Component, Node, Vec4, Color, SpriteComponent, LabelComponent, tween, spriteAssembler, UIOpacityComponent, Tween } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { ColoringDioramaModel } from '../../Data/ColoringDioramaModel';
import { ColorItemMgr } from '../../Game/Managers/ColorItemMgr';
const { ccclass, property } = _decorator;

@ccclass('ColorItem')
export class ColorItem extends Component {

    @property(Node)
    sellectUI: Node = null

    @property(Node)
    unSellectUI: Node = null

    @property(SpriteComponent)
    sellectUIColor: SpriteComponent = null

    @property(SpriteComponent)
    unSellectUIColor: SpriteComponent = null

    @property(LabelComponent)
    colorNum: LabelComponent = null

    @property(LabelComponent)
    unpaintNum: LabelComponent = null

    @property(Node)
    checkNode: Node = null

    @property(Node)
    falsh: Node = null

    @property(Node)
    fakeSpite: Node = null

    @property(SpriteComponent)
    progress: SpriteComponent = null


    public model: ColoringDioramaModel = null

    public color: Vec4 = new Vec4()

    public num: number = 0

    public manager: ColorItemMgr = null

    private finishCount = 0

    private totalCount = 0

    private tweenList: Tween[] = []

    public finished: boolean = false

    init(color: Vec4, num: number, colorModel: ColoringDioramaModel, manager: ColorItemMgr) {
        this.color = color
        this.num = num
        this.model = colorModel
        this.manager = manager
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        let thiscolor = new Color(this.color.x * 255, this.color.y * 255, this.color.z * 255, this.color.w * 255)
        this.sellectUIColor.color = thiscolor
        this.unSellectUIColor.color = thiscolor
        this.colorNum.string = this.num.toString()
        this.checkNode.active = false
        this.sellectUI.active = false
        this.totalCount = this.model.sameColorList[num - 1].length
        for (let i = 0; i < this.totalCount; i++) {
            if (this.model.paintedIndex.includes(this.model.sameColorList[num - 1][i])) {
                this.finishCount += 1
            }
        }
        this.unpaintNum.string = (this.totalCount - this.finishCount).toString()
        if (this.totalCount - this.finishCount == 0) {
            this.finished = true
            this.unpaintNum.node.active = false
            this.checkNode.active = true
        }
        this.playProgressAnim()
    }

    onTouchEnd() {
        AudioManager.getInstance().playEffectByPath("Click02")
        this.manager.sellectColorNum(this)
    }

    sellect() {
        this.sellectUI.active = true
        let t = tween(this.node)
            .to(0.1, { scale: cc.v3(1.1, 1.1, 1.1) })
            .to(0.1, { scale: cc.v3(1, 1, 1) })
            .start()
        this.tweenList.push(t)
        t = tween(this.falsh)
            .call(() => {
                this.falsh.setPosition(cc.v3(-110, 110))
            })
            .to(0.3, { position: cc.v3(110, -110) })
            .start()
        this.tweenList.push(t)
    }

    cancle() {
        this.sellectUI.active = false
        this.node.setScale(cc.v3(1, 1, 1))
    }

    paint() {
        this.finishCount += 1
        this.unpaintNum.string = (this.totalCount - this.finishCount).toString()
        this.progress.fillRange = this.finishCount / this.totalCount
        if (this.progress.fillRange === 1) {
            this.unpaintNum.node.active = false
            this.finished = true
            this.playCheckAnim()
            this.manager.sellectAColor()
        }
    }

    playProgressAnim() {
        this.progress.fillRange = 0
        let t = tween(this.progress)
            .to(1, { fillRange: this.finishCount / this.totalCount })
            .start()
        this.tweenList.push(t)
    }

    playFakeAnim() {
        this.fakeSpite.active = true
        this.fakeSpite.getComponent(UIOpacityComponent).opacity = 255
        let t = tween(this.fakeSpite.getComponent(UIOpacityComponent))
            .to(1.2, { opacity: 0 })
            .call(() => {
                if (this.node) {
                    this.fakeSpite.active = false
                }
            })
            .start()
        this.tweenList.push(t)
    }

    playCheckAnim() {
        this.checkNode.setScale(2, 2, 2)
        this.checkNode.active = true

        tween(this.checkNode)
            .to(0.2, { scale: cc.v3(1, 1, 1) })
            .to(0.1, { scale: cc.v3(1.3, 1.3, 1.3) })
            .to(0.1, { scale: cc.v3(1, 1, 1) })
            .start()
    }

    updateDisplay() {
        this.finishCount = 0
        this.totalCount = this.model.sameColorList[this.num - 1].length
        for (let i = 0; i < this.totalCount; i++) {
            if (this.model.paintedIndex.includes(this.model.sameColorList[this.num - 1][i])) {
                this.finishCount += 1
            }
        }
        this.unpaintNum.string = (this.totalCount - this.finishCount).toString()
        if (this.totalCount - this.finishCount == 0) {
            this.finished = true
            this.unpaintNum.node.active = false
            this.checkNode.active = true
        }
    }

    onDestroy() {
        for (let i = 0; i < this.tweenList.length; i++) {
            if (this.tweenList[i]) {
                this.tweenList[i].stop()
            }
        }
    }
}
