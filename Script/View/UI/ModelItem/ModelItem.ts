import { _decorator, Component, Node, instantiate, MeshColliderComponent, UIModelComponent, UITransformComponent, Vec3, ModelComponent, SpriteComponent, tween, graphics, ProgressBarComponent, AffineTransform, LabelComponent, TERRAIN_HEIGHT_BASE, ColliderComponent } from 'cc';
import ASCAd from '../../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../Framework3D/Src/Base/UIUtility';
import { ColoringDioramaModel } from '../../../Data/ColoringDioramaModel';
import { ItemConfig } from '../../../Data/ItemConfig';
import { GameMgr } from '../../../Game/Managers/GameMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { PaintSceneState } from '../../../Game/SceneState/PaintSceneState';
import { ModelItemBase } from './ModelItemBase';
const { ccclass, property } = _decorator;

@ccclass('ModelItem')
export class ModelItem extends ModelItemBase {


    @property(Node)
    progressBar: Node = null

    @property(SpriteComponent)
    progress: SpriteComponent = null

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

    private models: ColoringDioramaModel[] = null
    public model: ColoringDioramaModel = null

    private special: boolean = false
    private unLock: boolean = false
    private cost: number = 0

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

    init(...agrs) {
        super.init(...agrs)
        this.models = agrs[1]
        this.model = this.models[0]
        let modelUI = instantiate(this.model.node)
        modelUI.removeComponent(ColoringDioramaModel)
        // modelUI.getComponent(MeshColliderComponent).enabled = false
        for (let model of this.models) {
            model.addMeshCollider()
        }
        //this.model.addMeshCollider()
        //modelUI.removeComponent(ColliderComponent)
        modelUI.addComponent(UITransformComponent)
        modelUI.addComponent(UIModelComponent)
        modelUI.setParent(this.allComt)
        modelUI.setPosition(cc.v3(0, 0, 200))
        let size = 14000 / this.model.modelSize
        modelUI.setWorldScale(modelUI.getScale().multiplyScalar(size))
        modelUI.setWorldRotation(this.model.node.worldRotation)
        let worldEuler: Vec3 = new Vec3()
        modelUI.getWorldRotation().getEulerAngles(worldEuler)
        modelUI.setWorldRotationFromEuler(worldEuler.x, worldEuler.y + 180, worldEuler.z)
        modelUI.getComponent(ModelComponent).setMaterial(this.uiMat, 0)
        modelUI.getComponent(ModelComponent).setMaterial(this.cutFaceMat, 1)
        this.scheduleOnce(() => {
            let modelWorldPos = modelUI.getWorldPosition()
            let modelBoxPos = modelUI.getComponent(ModelComponent).model.worldBounds.center
            let moveVec = modelBoxPos.subtract(modelWorldPos)
            modelUI.setWorldPosition(modelUI.worldPosition.subtract(moveVec))
        }, 0)
        this.sameModelLabel.string = "x " + this.models.length.toString()
        this.updateDisplay()
        let config = ItemConfig.getItemConfig(this.model.trangleScrIndices.length / 3)
        this.levelBG.color = config.itemColor
        this.cost = config.cost * this.models.length
        GameMgr.getInstance().totalCost += this.cost
        this.costLabel.string = this.cost.toString()
        if (this.model.modelName.includes("special")) {
            this.special = true
            this.costEnergy.node.active = false
        } else {
            this.costGem.node.active = false
        }
        let unlock = StorgeMgr.getInstance().getItem(this.model.modelName)
        if (unlock) {
            this.unLock = true
            this.costNode.active = false
        }
        else {
            this.unLock = false
        }
    }

    sellect() {
        let finishCount = this.model.paintedIndex.length
        let totalCount = this.model.trangleScrIndices.length / 3
        let progress = finishCount / totalCount
        tween(this.node)
            .to(0.1, { scale: cc.v3(1.2, 1.2, 1.2) }, { easing: "circOut" })
            .to(0.1, { scale: cc.v3(1, 1, 1) }, { easing: "circOutIn" })
            .start()
        this.sellectBg.active = true
        let sellectUI = GameMgr.getInstance().gameUIMgr.sellectUI
        if (progress >= 1) {
            sellectUI.paintButtons.active = false
        }
        else {
            if (this.unLock) {
                sellectUI.paintButtons.active = true
                sellectUI.paintButton.active = true
                sellectUI.adPaintButton.active = false
            } else {
                sellectUI.paintButtons.active = true
                sellectUI.paintButton.active = true
                sellectUI.adPaintButton.active = true
            }
            sellectUI.playPaintButtonAnim()
        }
        GameMgr.getInstance().modelMgr.sellectModelByModel(this.model)
        var callBack = function () {
            if (this.unLock) {
                AudioManager.getInstance().playEffectByPath("Click01")
                sellectUI.loadNode.active = true
                this.scheduleOnce(() => {
                    GameMgr.getInstance().switchSceneState(new PaintSceneState())
                }, 0.5)
            } else {
                AudioManager.getInstance().playEffectByPath("Click01")
                let storgeInfo = StorgeMgr.getInstance()
                if (this.special) {
                    let result = storgeInfo.gem - this.cost
                    if (result < 0) {
                        UIUtility.getInstance().showTopTips("钻石不足！")
                        return
                    }
                    storgeInfo.gem -= this.cost
                    storgeInfo.update()
                    sellectUI.playGemCostAnim(this.cost)
                    sellectUI.gemLabel.string = storgeInfo.gem.toString()
                } else {
                    let result = storgeInfo.energy - this.cost
                    if (result < 0) {
                        var unlockCallback = function () {
                            StorgeMgr.getInstance().setItem(this.model.modelName)
                            StorgeMgr.getInstance().hadSeeAd = 1
                            StorgeMgr.getInstance().finishAdCount +=1
                            StorgeMgr.getInstance().update()
                            sellectUI.loadNode.active = true
                            this.unLock = true
                            this.costNode.active = false
                            this.scheduleOnce(() => {
                                GameMgr.getInstance().switchSceneState(new PaintSceneState())
                            }, 0.5)
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
                        return
                    }
                    storgeInfo.energy -= this.cost
                    storgeInfo.update()
                    sellectUI.playEnergyCostAnim(this.cost)
                    sellectUI.energyLabel.string = storgeInfo.energy.toString()
                }
                StorgeMgr.getInstance().setItem(this.model.modelName)
                sellectUI.loadNode.active = true
                this.unLock = true
                this.costNode.active = false
                this.scheduleOnce(() => {
                    GameMgr.getInstance().switchSceneState(new PaintSceneState())
                }, 0.5)
            }
        }.bind(this)
        sellectUI.registerPaintButtonCB(callBack)

        var adsCallBack = function () {
            var callback = function (isEnd) {
                if (isEnd) {
                    StorgeMgr.getInstance().setItem(this.model.modelName)
                    sellectUI.loadNode.active = true
                    this.unLock = true
                    this.costNode.active = false
                    let gameInfo = StorgeMgr.getInstance()
                    gameInfo.hadSeeAd = 1
                    gameInfo.finishAdCount += 1
                    gameInfo.update()
                    this.scheduleOnce(() => {
                        GameMgr.getInstance().switchSceneState(new PaintSceneState())
                    }, 0.5)
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
        sellectUI.registerAdPaintButtonCB(adsCallBack)
    }

    cancleSellect() {
        this.sellectBg.active = false
    }

    onTouch(lock = true) {
        super.onTouch()
        this.sellectUI.selectItem(this)
        if (lock) {
            GameMgr.getInstance().cameraMgr.setCenterTarget(this.model.node, true)
        }
    }

    updateDisplay() {
        let finishCount = this.model.paintedIndex.length
        let totalCount = this.model.trangleScrIndices.length / 3
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
