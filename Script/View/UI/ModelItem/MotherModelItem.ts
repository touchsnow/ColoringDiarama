import { _decorator, Component, Node, ModelComponent, Vec3, instantiate, MeshColliderComponent, UITransformComponent, UIModelComponent, tween, SpriteComponent, ProgressBarComponent, LabelComponent, ColliderComponent } from 'cc';
import ASCAd from '../../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../Framework3D/Src/Base/UIUtility';
import { ColoringDioramaModel } from '../../../Data/ColoringDioramaModel';
import { ItemConfig } from '../../../Data/ItemConfig';
import { GameMgr } from '../../../Game/Managers/GameMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { SubScrollViewMgr } from '../SubScrollViewMgr';
import { ModelItemBase } from './ModelItemBase';
const { ccclass, property } = _decorator;

@ccclass('MotherModelItem')
export class MotherModelItem extends ModelItemBase {

    @property(Node)
    progressBar: Node = null

    @property(SpriteComponent)
    progress: SpriteComponent = null


    private subScrollView: SubScrollViewMgr = null
    private subModel: ColoringDioramaModel[] = []
    private special: boolean = false
    private unLock: boolean = false
    private cost: number = 0

    @property(SpriteComponent)
    levelBG: SpriteComponent = null

    @property(Node)
    costNode: Node = null

    @property(SpriteComponent)
    costEnergy: SpriteComponent = null

    @property(SpriteComponent)
    costGem: SpriteComponent = null

    @property(LabelComponent)
    costLabel: LabelComponent = null

    @property(Node)
    allComt: Node = null

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    update() {
        if (this.node.worldPosition.x > 1190 || this.node.worldPosition.x < -110) {
            this.setDisable()
        } else {
            this.setEnable()
        }
    }

    init(...args) {
        super.init(...args)
        this.subModel = args[1]
        this.subScrollView = args[2]
        let modelNode = this.subModel[0].originalParentNode
        //计算模型大小
        let mergeSize = 0
        let mixAndMaxPos: Vec3[] = []
        let worldScale: number[] = []
        for (let i = 0; i < this.subModel.length; i++) {
            let theModel = this.subModel[i].node.getComponent(ModelComponent)
            let min: Vec3 = new Vec3()
            let max: Vec3 = new Vec3()
            theModel.model.worldBounds.getBoundary(min, max)
            mixAndMaxPos.push(min.multiplyScalar(1 / Math.abs(theModel.node.parent.getScale().x)))
            mixAndMaxPos.push(max.multiplyScalar(1 / Math.abs(theModel.node.parent.getScale().x)))
        }
        // console.log(mixAndMaxPos)
        // console.log(worldScale)
        for (let i = 0; i < mixAndMaxPos.length; i++) {
            for (let j = 0; j < mixAndMaxPos.length; j++) {
                let size = Vec3.distance(mixAndMaxPos[i], mixAndMaxPos[j])
                if (i != j) {
                    if (size > mergeSize) {
                        mergeSize = size
                    }
                }
            }
        }
        let modelUI = instantiate(modelNode)
        modelUI.setParent(this.allComt)
        modelUI.setPosition(cc.v3(0, 0, 0))
        //mergeSize *= Math.abs(theModel.node.getWorldScale().x)
        let size = 18000 / mergeSize
        modelUI.setWorldScale(cc.v3(size, size, size))
        modelUI.setWorldRotation(modelNode.worldRotation)
        let worldEuler: Vec3 = new Vec3()
        modelUI.getWorldRotation().getEulerAngles(worldEuler)
        modelUI.setWorldRotationFromEuler(worldEuler.x, worldEuler.y + 180, worldEuler.z)
        modelUI.children.forEach(element => {
            let paintModel = element.getComponent(ColoringDioramaModel)
            if (paintModel) {
                element.removeComponent(ColoringDioramaModel)
                //this.model.addMeshCollider()
                // let meshComt = element.removeComponent(ColliderComponent)
                // meshComt.forEach(element => {
                //     element.enabled = false
                // })
                element.getComponent(ModelComponent).setMaterial(this.uiMat, 0)
                element.getComponent(ModelComponent).setMaterial(this.cutFaceMat, 1)
                element.addComponent(UITransformComponent)
                element.addComponent(UIModelComponent)
            }
        })
        for (let model of this.subModel) {
            model.addMeshCollider()
        }
        this.sameModelLabel.string = "x 1"
        let trangleCount = 0
        for (let i of this.subModel) {
            trangleCount += i.trangleScrIndices.length / 3
        }
        let itemConfig = ItemConfig.getItemConfig(trangleCount)
        this.levelBG.color = itemConfig.itemColor
        this.cost = itemConfig.cost
        GameMgr.getInstance().totalCost += this.cost
        this.costLabel.string = this.cost.toString()
        if (this.subModel[0].parentName.includes("special")) {
            this.special = true
            this.costEnergy.node.active = false
        } else {
            this.costGem.node.active = false
        }
        let unLock = StorgeMgr.getInstance().getItem(this.subModel[0].parentName)
        if (unLock) {
            this.unLock = true
            this.costNode.active = false
        } else {
            this.unLock = false
        }
    }

    sellect() {
        //this.onTouch()
        tween(this.node)
            .to(0.1, { scale: cc.v3(1.2, 1.2, 1.2) }, { easing: "circOut" })
            .to(0.1, { scale: cc.v3(1, 1, 1) }, { easing: "circOutIn" })
            .start()

        this.sellectBg.active = true
        GameMgr.getInstance().modelMgr.playSellectAnim(this.subModel[0].node)
        let sellectUI = GameMgr.getInstance().gameUIMgr.sellectUI
        if (this.unLock) {
            this.subScrollView.enable()
        } else {
            var callback = function () {
                let strogeInfo = StorgeMgr.getInstance()
                if (this.special) {
                    let result = strogeInfo.gem - this.cost
                    if (result < 0) {
                        UIUtility.getInstance().showTopTips("钻石不足！")
                        return
                    }
                    strogeInfo.gem -= this.cost
                    strogeInfo.update()
                    sellectUI.playGemCostAnim(this.cost)
                    sellectUI.gemLabel.string = strogeInfo.gem.toString()
                } else {
                    let result = strogeInfo.energy - this.cost
                    if (result < 0) {
                        var unlockCallback = function () {
                            StorgeMgr.getInstance().setItem(this.subModel[0].parentName)
                            this.unLock = true
                            this.costNode.active = false
                            this.subScrollView.enable()
                            StorgeMgr.getInstance().hadSeeAd = 1
                            StorgeMgr.getInstance().finishAdCount += 1
                            StorgeMgr.getInstance().update()
                        }.bind(this)
                        var acceptCallback = function () {
                            GameMgr.getInstance().gameUIMgr.sellectUI.updateDisplay()
                        }.bind(this)
                        let data = {
                            unlockCallback: unlockCallback,
                            acceptCallback: acceptCallback,
                            neededCount: this.cost.toString()
                        }
                        DialogManager.getInstance().showDlg("EnergyInsufficientDialog", data)
                        UIUtility.getInstance().showTopTips("水晶不足！")
                        return
                    }
                    strogeInfo.energy -= this.cost
                    strogeInfo.update()
                    sellectUI.playEnergyCostAnim(this.cost)
                    sellectUI.energyLabel.string = strogeInfo.energy.toString()
                }
                StorgeMgr.getInstance().setItem(this.subModel[0].parentName)
                this.unLock = true
                this.costNode.active = false
                this.subScrollView.enable()
            }.bind(this)
            sellectUI.adPaintButton.active = true
            sellectUI.paintButton.active = true
            sellectUI.paintButtons.active = true
            sellectUI.playPaintButtonAnim()
            sellectUI.registerPaintButtonCB(callback)

            var adsCallback = function () {
                var callback = function (isEnd) {
                    if (isEnd) {
                        StorgeMgr.getInstance().setItem(this.subModel[0].parentName)
                        this.unLock = true
                        this.costNode.active = false
                        this.subScrollView.enable()
                        let gameInfo = StorgeMgr.getInstance()
                        gameInfo.hadSeeAd = 1
                        gameInfo.finishAdCount += 1
                        gameInfo.update()
                    }
                    else {
                        UIUtility.getInstance().showTopTips("视频未播放完成！")
                    }
                    AudioManager.getInstance().resumeMusic()
                }.bind(this)
                if (ASCAd.getInstance().getVideoFlag()) {
                    ASCAd.getInstance().showVideo(callback)
                    AudioManager.getInstance().pauseMusic()
                }
                else {
                    UIUtility.getInstance().showTopTips("视频未加载完成！")
                }
            }.bind(this)
            sellectUI.registerAdPaintButtonCB(adsCallback)
        }
    }

    cancleSellect() {
        if (!this.unLock) {
            this.sellectBg.active = false
        }
    }

    cancleSellectBySubModel() {
        this.sellectBg.active = false
    }

    onTouch(lock = true) {
        super.onTouch()
        this.sellectUI.selectItem(this)
        if (lock) {
            GameMgr.getInstance().cameraMgr.setCenterTarget(this.subModel[0].node, true)
        }
        // tween(this.node)
        //     .to(0.1, { scale: cc.v3(1.2, 1.2, 1.2) }, { easing: "circOut" })
        //     .to(0.1, { scale: cc.v3(1, 1, 1) }, { easing: "circOutIn" })
        //     .start()
        // GameMgr.getInstance().cameraMgr.setCenterTarget(this.subModel[0].node, true)
        // this.sellectBg.active = true
        // GameMgr.getInstance().modelMgr.playSellectAnim(this.subModel[0].node)
        // let sellectUI = GameMgr.getInstance().gameUIMgr.sellectUI
        // if (this.unLock) {
        //     this.subScrollView.enable()
        // } else {
        //     var callback = function () {
        //         let strogeInfo = StorgeMgr.getInstance()
        //         strogeInfo.energy -= this.cost
        //         strogeInfo.update()
        //         StorgeMgr.getInstance().setItem(this.subModel[0].parentName)
        //         sellectUI.energyLabel.string = strogeInfo.energy.toString()
        //         sellectUI.playEnergyCostAnim(this.cost)
        //         this.unLock = true
        //         this.costNode.active = false
        //         this.subScrollView.enable()
        //     }.bind(this)
        //     sellectUI.registerPaintButtonCB(callback)
        // }


    }


    updateDisplay() {
        let finishCount = 0
        let totalCount = 0
        for (let model of this.subModel) {
            finishCount += model.paintedIndex.length
            totalCount += model.trangleScrIndices.length / 3
        }
        let progress = finishCount / totalCount
        this.progress.fillRange = 0
        tween(this.progress)
            .to(1, { fillRange: progress })
            .start()
        if (progress == 1) {
            this.checkNode.active = true
            this.finished = true
        }
    }

    setDisable() {
        if (this.allComt.active == true) {
            this.allComt.active = false
        }
    }

    setEnable() {
        if (this.allComt.active == false) {
            this.allComt.active = true
        }
    }
}
