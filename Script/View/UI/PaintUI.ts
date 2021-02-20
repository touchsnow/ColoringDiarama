import { _decorator, Component, Node, ParticleSystemComponent, SpriteComponent, tween, LabelComponent, Tween, UIOpacityComponent } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { GameMgr } from '../../Game/Managers/GameMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { BombSkillState } from '../../Game/SceneState/BombSkillState';
import { SellectSceneState } from '../../Game/SceneState/SellectSceneState';
import { StarSkillState } from '../../Game/SceneState/StarSkillState';
const { ccclass, property } = _decorator;

@ccclass('PaintUI')
export class PaintUI extends Component {

    @property(Node)
    backToSellectButton: Node = null

    @property(SpriteComponent)
    progress: SpriteComponent = null

    @property(LabelComponent)
    progressLabel: LabelComponent = null

    @property(SpriteComponent)
    starFill: SpriteComponent = null

    @property(Node)
    skillStar: Node = null

    @property(Node)
    skillBomb: Node = null

    @property(Node)
    bombAddNode: Node = null

    @property(LabelComponent)
    bombLabel: LabelComponent = null

    @property(Node)
    promotyNode: Node = null

    @property(Node)
    promotyAddNode: Node = null

    @property(LabelComponent)
    promotyCount: LabelComponent = null


    public starProgress: number = 0
    private starMaxCount: number = 300

    private bombCount: number = 0

    private starAnimTween: Tween = null

    private tweenList: Tween[] = []

    start() {
        this.skillStar.on(Node.EventType.TOUCH_END, this.onSkillStar, this)
        this.skillBomb.on(Node.EventType.TOUCH_END, this.onSkillBomb, this)
        this.promotyNode.on(Node.EventType.TOUCH_END, this.onSkillPromoty, this)
        this.starProgress = StorgeMgr.getInstance().skillStarProgress
        this.bombCount = StorgeMgr.getInstance().bombCount
        this.updateDisplay()
    }

    onSkillStar() {
        if (this.starProgress != this.starMaxCount) return
        this.starProgress = 0
        this.starFill.fillRange = 0
        let gameInfo = StorgeMgr.getInstance()
        gameInfo.skillStarProgress = this.starProgress
        gameInfo.update()
        this.stopStarAnim()
        GameMgr.getInstance().switchSceneState(new StarSkillState(), false)
    }

    onSkillBomb() {
        if (this.bombCount > 0) {
            GameMgr.getInstance().switchSceneState(new BombSkillState(), false)
            this.bombCount -= 1
            StorgeMgr.getInstance().bombCount = this.bombCount
            StorgeMgr.getInstance().update()
            this.bombLabel.string = this.bombCount.toString()
            this.updateDisplay()
        } else {
            var acceptCallback = function () {
                let gameInfo = StorgeMgr.getInstance()
                gameInfo.bombCount += 1
                gameInfo.hadSeeAd = 1
                gameInfo.finishAdCount += 1
                gameInfo.update()
                this.updateDisplay()
                let bombData = {
                    label: "1"
                }
                DialogManager.getInstance().showDlg("BombDialog", bombData)
            }.bind(this)
            let data = {
                acceptCallback: acceptCallback,
            }
            DialogManager.getInstance().showDlg("BombAdRewardDialog", data)
        }
    }

    onSkillPromoty() {
        let promotyCount = StorgeMgr.getInstance().promotyCount
        if (promotyCount > 0) {
            StorgeMgr.getInstance().promotyCount -= 1
            StorgeMgr.getInstance().update()
            this.updateDisplay()
            GameMgr.getInstance().modelMgr.promoty()
        } else {
            var acceptCallback = function () {
                let gameInfo = StorgeMgr.getInstance()
                gameInfo.promotyCount += 2
                gameInfo.hadSeeAd = 1
                gameInfo.finishAdCount += 1
                gameInfo.update()
                this.updateDisplay()
                let bombData = {
                    label: "2"
                }
                DialogManager.getInstance().showDlg("PromotyDialog", bombData)
            }.bind(this)
            let data = {
                acceptCallback: acceptCallback,
            }
            DialogManager.getInstance().showDlg("PromotyAdRewardDialog", data)
        }
    }

    updateDisplay() {
        this.starFill.fillRange = this.starProgress / this.starMaxCount
        if (this.starFill.fillRange == 1) {
            this.playStarAnim()
        }
        this.bombCount = StorgeMgr.getInstance().bombCount
        this.bombLabel.string = this.bombCount.toString()
        if (this.bombCount <= 0) {
            this.bombAddNode.active = true
        } else {
            this.bombAddNode.active = false
        }
        let promotyCount = StorgeMgr.getInstance().promotyCount
        this.promotyCount.string = promotyCount.toString()
        if (promotyCount <= 0) {
            this.promotyAddNode.active = true
        } else {
            this.promotyAddNode.active = false
        }
    }

    onBackToSellectButton() {
        if (this.bombLabel)
            GameMgr.getInstance().switchSceneState(new SellectSceneState())
    }

    playProgressAnim(progress: number) {
        this.progressLabel.string = (progress * 100).toFixed(0) + "%"
        this.progress.fillRange = 0
        tween(this.progress)
            .to(1, { fillRange: progress })
            .start()
    }

    setProgress(progress: number) {
        this.progress.fillRange = progress
        this.progressLabel.string = (progress * 100).toFixed(0) + "%"
    }

    addStarFill() {
        this.starProgress += 1
        this.starProgress = this.starProgress >= this.starMaxCount ? this.starMaxCount : this.starProgress
        let gameInfo = StorgeMgr.getInstance()
        gameInfo.skillStarProgress = this.starProgress
        gameInfo.update()
        this.starFill.fillRange = this.starProgress / this.starMaxCount
        if (this.starProgress == this.starMaxCount) {
            this.playStarAnim()
        }
        this.bombLabel.string = gameInfo.bombCount.toString()
    }

    playStarAnim() {
        if (!this.starAnimTween) {
            AudioManager.getInstance().playEffectByPath("StarReady")
            this.skillStar.getChildByName("Skill-StarFinish").active = true
            this.starAnimTween = tween(this.skillStar).repeatForever(tween(this.skillStar)
                .to(0.08, { scale: cc.v3(1.1, 1.1, 1.1) }, { easing: "circOutIn" })
                .to(0.08, { scale: cc.v3(1.25, 1.25, 1.25) }, { easing: "circOut" })
                .delay(0.5)
                .start()).start()
            this.tweenList.push(this.starAnimTween)
        }
    }

    stopStarAnim() {
        if (this.starAnimTween) {
            this.skillStar.getChildByName("Skill-StarFinish").active = false
            this.skillStar.setScale(cc.v3(1, 1, 1))
            this.starAnimTween.stop()
            this.starAnimTween = null

        }
    }

    setTrue() {

        let opacity = this.node.getComponent(UIOpacityComponent)
        opacity.opacity = 0
        this.node.active = true
        let t = tween(opacity)
            .to(0.5, { opacity: 255 }, { easing: "circOut" })
            .start()
        this.tweenList.push(t)
    }

    setFalse() {
        // let opacity = this.node.getComponent(UIOpacityComponent)
        // opacity.opacity = 255
        // let t = tween(opacity)
        //     .to(0.5, { opacity: 0 }, { easing: "circOut" })
        //     .call(() => {
        this.node.active = false
        //     })
        //     .start()
        // this.tweenList.push(t)
    }

    fakeFalse() {
        let opacity = this.node.getComponent(UIOpacityComponent)
        opacity.opacity = 255
        let t = tween(opacity)
            .to(2, { opacity: 0 }, { easing: "circOut" })
            .call(() => {
                this.node.active = false
                opacity.opacity = 255
            })
            .start()
        this.tweenList.push(t)
    }

    onDestroy() {
        for (let tween of this.tweenList) {
            if (tween && this.node)
                tween.stop()
        }
    }
}
