import { _decorator, Component, Node, tween, UIOpacityComponent, loader, instantiate, find, random, Prefab } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import { BackGroundUI } from '../../View/UI/BackGroundUI';
import { GameMgr } from '../Managers/GameMgr';
import { GFXOpearte } from '../Uitls/GFXOpearte';
import { NodeMotion } from '../Uitls/NodeMotion';
import { ISceneState } from './ISceneState';
import { PaintSceneState } from './PaintSceneState';
const { ccclass, property } = _decorator;

@ccclass('StarSkillState')
export class StarSkillState extends ISceneState {

    private specialBgOp = 0
    private normalBgOp = 0

    private modelAxis: Node = null
    private rotateAxis: Node = null

    private BgUI: BackGroundUI = null

    private specialBg: UIOpacityComponent = null
    private normalBg: UIOpacityComponent = null
    private starSkillBg: UIOpacityComponent = null

    private startFlag: boolean = false

    private remainingTime: number = 10

    private unpaintIndex: number[] = []

    private currentIndex = 0

    init(gameMgr: GameMgr, changeBg: boolean = true) {

        super.init(gameMgr)
        //this.cameraMgr.resetCamera(true)
        this.BgUI = this.gameUIMgr.backGroundUI
        this.gameUIMgr.paintUI.setFalse()
        let allIndex = this.modelMgr.paintingModel.model.trangleScrIndices
        this.unpaintIndex = []
        this.currentIndex = 0
        for (let i = 0; i < allIndex.length / 3; i++) {
            let index = allIndex[i * 3]
            if (!this.modelMgr.paintingModel.model.paintedIndex.includes(index)) {
                this.unpaintIndex.push(index)
            }
        }
        AudioManager.getInstance().stopMusic()
        this.rotateAxis = this.cameraMgr.mainCamera.node.parent
        this.modelAxis = this.modelMgr.paintingRotatePoint
        this.modelAxis.setWorldPosition(0, 0, 0)
        this.modelAxis.setWorldRotationFromEuler(-20, 0, 0)
        this.rotateAxis.setWorldPosition(0, 0, 0)
        this.rotateAxis.setWorldRotationFromEuler(0, 0, 0)
        let modelMgr = this.modelMgr
        modelMgr.rotatePoint.setWorldRotation(modelMgr.originalRotate)
        //初始化涂色模型
        let paintedModel = modelMgr.paintedModelDic.get(modelMgr.sellectModel.uuid)
        modelMgr.paintingModel = paintedModel
        paintedModel.initForStarSkill()

        if (changeBg) {
            this.specialBg = this.BgUI.specialBg.node.getComponent(UIOpacityComponent)
            this.normalBg = this.BgUI.normalBg.node.getComponent(UIOpacityComponent)
            this.starSkillBg = this.BgUI.starSkillBg.node.getComponent(UIOpacityComponent)
            this.specialBgOp = this.specialBg.opacity
            this.normalBgOp = this.normalBg.opacity
            tween(this.specialBg)
                .to(0.5, { opacity: 0 })
                .start()
            tween(this.normalBg)
                .to(0.5, { opacity: 0 })
                .start()
            this.scheduleOnce(() => {
                this.starSkillBg.opacity = 0
                this.starSkillBg.node.active = true
                tween(this.starSkillBg)
                    .to(0.5, { opacity: 255 })
                    .call(() => {
                        AudioManager.getInstance().playEffectByPath("ChangeBg")
                        AudioManager.getInstance().playMusicByPath("BGM_Star")
                        this.BgUI.starParticel.active = true
                        this.startFlag = true
                        this.BgUI.countDownLabel.node.active = true
                    })
                    .start()
            }, 1.5)
        } else {
            AudioManager.getInstance().playEffectByPath("ChangeBg")
            AudioManager.getInstance().playMusicByPath("BGM_Star")
            this.BgUI.starParticel.active = true
            this.startFlag = true
            this.BgUI.countDownLabel.node.active = true
            this.remainingTime = 10
        }

        // this.scheduleOnce(() => {
        //     this.starSkillBg.opacity = 0
        //     this.starSkillBg.node.active = true
        //     tween(this.starSkillBg)
        //         .to(0.5, { opacity: 255 })
        //         .call(() => {

        //         })
        //         .start()
        // }, 1.5)
    }

    release(changeBg: boolean = true) {
        if (changeBg) {
            tween(this.specialBg)
                .to(0.5, { opacity: this.specialBgOp })
                .start()
            tween(this.normalBg)
                .to(0.5, { opacity: this.normalBgOp })
                .start()
            tween(this.starSkillBg)
                .to(0.5, { opacity: 0 })
                .start()
        }

        this.BgUI.starParticel.active = false
        this.BgUI.countDownLabel.node.active = false


    }

    screenTouchEnd() {
        if (!this.startFlag) return
        let num = Math.floor(random() * 7)
        num += 3
        AudioManager.getInstance().playEffectByPath("Click0" + num.toString())
        let index = this.unpaintIndex[this.currentIndex]
        this.currentIndex += 1
        let wordlPos = GFXOpearte.getCenterByIndices(index, this.modelMgr.paintingModel.model)
        let camera = this.cameraMgr.mainCamera
        let screenPos = camera.convertToUINode(wordlPos, find("Canvas"))
        loader.loadRes("DelayLoader/StarParticle", Prefab, (err: any, prefab: Prefab) => {
            if (err) return
            let star = instantiate(prefab) as Node
            let startPos = this.BgUI.starParticel.getWorldPosition()
            var callBack = function () {
                this.paint(index)
            }.bind(this)
            star.addComponent(NodeMotion).init(star, startPos, screenPos, callBack)
            star.setParent(find("Canvas"))
            if (this.currentIndex == this.unpaintIndex.length) {
                this.startFlag = false
                this.BgUI.countDownLabel.node.active = false
                let paintingModel = this.modelMgr.paintingModel
                paintingModel.scrollView.currentItem.finished = true
                this.scheduleOnce(() => {
                    GameMgr.getInstance().switchSceneState(new PaintSceneState())
                }, 3.6)
            }
        })
    }

    update(dt) {
        if (!this.startFlag) return
        this.remainingTime -= dt
        this.BgUI.countDownLabel.string = this.remainingTime.toFixed(1)
        if (this.remainingTime <= 0) {
            this.startFlag = false
            this.BgUI.countDownLabel.node.active = false
            if (this.gameMgr.gameMode == this.gameMgr.GameMode.Guide) {
                this.scheduleOnce(() => {
                    GameMgr.getInstance().switchSceneState(new PaintSceneState())
                }, 3.6)
            } else {
                var acceptCallback = function () {
                    //this.scheduleOnce(() => {
                    //GameMgr.getInstance().switchSceneState(new StarSkillState())
                    this.startFlag = true
                    this.release(false)
                    this.init(this.gameMgr, false)
                    //}, 3.6)
                }.bind(this)
                var cancleCallback = function () {
                    this.scheduleOnce(() => {
                        GameMgr.getInstance().switchSceneState(new PaintSceneState())
                    }, 3.6)
                }.bind(this)
                let data = {
                    acceptCallback: acceptCallback,
                    cancleCallback: cancleCallback
                }
                DialogManager.getInstance().showDlg("StarAdRewardDialog", data)
            }
            // this.scheduleOnce(() => {
            //     GameMgr.getInstance().switchSceneState(new PaintSceneState())
            // }, 3.6)
        }
    }


    paint(index: number) {
        //恢复一个三角形
        let paintingModel = this.modelMgr.paintingModel
        paintingModel.destoryTrangle(index)
        paintingModel.disableSingleNum(index)
        paintingModel.currentpaintIndex.push(index)
        let color = paintingModel.getColorByIndex(index)
        //播放填涂动画
        paintingModel.playPaintAnim(index, color)
        let worldPos = GFXOpearte.getCenterByIndices(index, paintingModel.model)
        let worldScale = GFXOpearte.getMinDisByIndices(index, paintingModel.model)
        let parent = this.modelMgr.paintingRotatePoint
        //播放粒子特效
        this.effectMgr.playPaintEffect(worldPos, worldScale, parent, color)
        //计算进度
        let progress = paintingModel.model.paintedIndex.length / (paintingModel.model.trangleScrIndices.length / 3)
        this.gameUIMgr.paintUI.setProgress(progress)
    }
}
