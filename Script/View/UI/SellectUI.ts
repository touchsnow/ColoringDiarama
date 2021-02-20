import { _decorator, Component, Node, instantiate, loader, game, SpriteComponent, Tween, tween, UIComponent, UIOpacityComponent, LabelComponent, easing, find } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { ColoringDioramaModel } from '../../Data/ColoringDioramaModel';
import { GameMgr } from '../../Game/Managers/GameMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { ModelItem } from './ModelItem/ModelItem';
import { ModelItemBase } from './ModelItem/ModelItemBase';
import { MotherModelItem } from './ModelItem/MotherModelItem';
import { SubScrollViewMgr } from './SubScrollViewMgr';
const { ccclass, property } = _decorator;

@ccclass('SellectUI')
export class SellectUI extends Component {

    @property(Node)
    paintButton: Node = null

    @property(Node)
    adPaintButton: Node = null

    @property(Node)
    paintButtons: Node = null

    @property(Node)
    normalContent: Node = null

    @property(Node)
    speicialContent: Node = null

    @property(SpriteComponent)
    progressBar1: SpriteComponent = null

    @property(SpriteComponent)
    progressBar2: SpriteComponent = null

    @property(Node)
    backToMainButton: Node = null

    @property(LabelComponent)
    energyLabel: LabelComponent = null

    @property(LabelComponent)
    gemLabel: LabelComponent = null

    @property(LabelComponent)
    bombLabel: LabelComponent = null

    @property(LabelComponent)
    starLabel: LabelComponent = null

    @property(Node)
    bombAddButton: Node = null

    @property(Node)
    energyCost: Node = null

    @property(Node)
    gemCost: Node = null

    @property(Node)
    loadNode: Node = null

    @property(Node)
    normalTap: Node = null

    @property(Node)
    specialTap: Node = null

    @property(Node)
    normalScrollView: Node = null

    @property(Node)
    specialScrollView: Node = null

    @property(Node)
    gif: Node = null

    public currentSellectItem: ModelItemBase = null

    private itemList: ModelItemBase[] = []

    private subViewMgrList: SubScrollViewMgr[] = []

    private tweenList: Tween[] = []

    private onPaintButtonCallback = null
    private onAdPaintButtonCallback = null

    start() {
        this.backToMainButton.on(Node.EventType.TOUCH_END, this.onBackToMainButton, this)
        this.normalTap.on(Node.EventType.TOUCH_END, this.onNormalTap, this)
        this.specialTap.on(Node.EventType.TOUCH_END, this.onSpecialTap, this)
        this.bombLabel.node.parent.on(Node.EventType.TOUCH_END, this.onBombDisplay, this)
    }

    onBackToMainButton() {
        AudioManager.getInstance().playEffectByPath("Click01")
        UIUtility.getInstance().loadScene("MainScene")
    }

    onPaintButton() {
        //  console.log("onPaintButton")
        if (this.onPaintButtonCallback) this.onPaintButtonCallback()
    }

    onAdPaintButton() {
        if (this.onAdPaintButtonCallback) this.onAdPaintButtonCallback()
    }

    onNormalTap() {
        AudioManager.getInstance().playEffectByPath("Click01")
        this.normalTap.getChildByName("Tap-White").active = true
        this.normalTap.getChildByName("Tap-Blank").active = false
        this.specialTap.getChildByName("Tap-White").active = false
        this.specialTap.getChildByName("Tap-Blank").active = true
        this.normalScrollView.active = true
        this.specialScrollView.active = false
        tween(this.normalTap)
            .to(0.1, { scale: cc.v3(1.15, 1.15, 1.15) })
            .to(0.1, { scale: cc.v3(1, 1, 1) })
            .start()
    }

    onSpecialTap() {
        AudioManager.getInstance().playEffectByPath("Click01")
        this.specialTap.getChildByName("Tap-White").active = true
        this.specialTap.getChildByName("Tap-Blank").active = false
        this.normalTap.getChildByName("Tap-White").active = false
        this.normalTap.getChildByName("Tap-Blank").active = true
        this.normalScrollView.active = false
        this.specialScrollView.active = true
        tween(this.specialTap)
            .to(0.1, { scale: cc.v3(1.15, 1.15, 1.15) })
            .to(0.1, { scale: cc.v3(1, 1, 1) })
            .start()
    }

    initScrollView() {
        //初始化模型列表
        let modelDic = GameMgr.getInstance().modelMgr.modelDic
        let motherMdoelDic = GameMgr.getInstance().modelMgr.motherModelDic
        //let subModelDic = GameMgr.getInstance().modelMgr.subModelDic
        for (let i of modelDic.values()) {
            let modelItemNode = instantiate(loader.getRes("UI/ModelItem"))
            let modelItem = modelItemNode.getComponent(ModelItem)
            modelItem.init(this, i)
            if (i[0].modelName.includes("special")) {
                modelItemNode.setParent(this.speicialContent)
            } else {
                modelItemNode.setParent(this.normalContent)
            }
            this.itemList.push(modelItem)
        }
        for (let i of motherMdoelDic.values()) {
            let subScrollViewNode = instantiate(loader.getRes("UI/SubScrollView"))
            subScrollViewNode.setParent(this.node)
            let subScrollView = subScrollViewNode.addComponent(SubScrollViewMgr)
            subScrollView.init(i, this)
            let modelItemNode = instantiate(loader.getRes("UI/MotherModelItem"))
            let modelItem = modelItemNode.getComponent(MotherModelItem)
            let modelList: ColoringDioramaModel[] = []
            for (let j of i) {
                for (let k of j) {
                    modelList.push(k)
                }
            }
            modelItem.init(this, modelList, subScrollView)
            if (modelList[0].parentName.includes("special")) {
                this.specialTap.active = true
                modelItemNode.setParent(this.speicialContent)
            } else {
                modelItemNode.setParent(this.normalContent)
            }
            subScrollView.matherItem = modelItemNode.getComponent(MotherModelItem)
            this.itemList.push(modelItem)
            this.subViewMgrList.push(subScrollView)
        }
    }

    selectItem(item: ModelItemBase) {
        if (this.currentSellectItem) {
            this.currentSellectItem.cancleSellect(item)
        }
        this.currentSellectItem = item
        this.currentSellectItem.sellect()
    }

    updateDisplay() {
        for (let i of this.itemList) {
            i.updateDisplay()
        }
        for (let i of this.subViewMgrList) {
            i.updateDisplay()
        }
        this.energyLabel.string = StorgeMgr.getInstance().energy.toString()
        this.gemLabel.string = StorgeMgr.getInstance().gem.toString()
        let bombCount = StorgeMgr.getInstance().bombCount
        this.bombLabel.string = bombCount.toString()
        if (bombCount <= 0) {
            this.bombAddButton.active = true
        } else {
            this.bombAddButton.active = false
        }
        // console.log(StorgeMgr.getInstance().skillStarProgress)
        this.starLabel.string = (StorgeMgr.getInstance().skillStarProgress/3).toFixed(0) + "%"
    }

    sellectAItem() {
        if (this.currentSellectItem == null || this.currentSellectItem.finished) {
            for (let i of this.itemList) {
                if (!i.finished) {
                    i.onTouch(false)
                    break
                }
            }
        } else {
            this.currentSellectItem.onTouch(false)
        }
    }

    setProgress(progress: number) {
        let progress1 = progress - 0.5 <= 0 ? progress * 2 : 1
        let progress2 = progress - 0.5 <= 0 ? 0 : (progress - 0.5) * 2
        this.progressBar1.fillRange = progress1
        this.progressBar2.fillRange = progress2
    }

    getItem(item: ColoringDioramaModel) {
        //是不是子模型
        //let motherName = item.parentName
        for (let mgr of this.subViewMgrList) {
            for (let subItem of mgr.subItemList) {
                if (subItem.model.modelName === item.modelName && subItem.model.parentName === item.parentName) {
                    return mgr.matherItem
                }
            }
        }
        for (let thisitem of this.itemList) {
            let modelItem = thisitem as ModelItem
            if (modelItem.model) {
                if (modelItem.model.modelName === item.modelName && modelItem.model.parentName === item.parentName) {
                    return thisitem
                }
            }
        }
    }

    playPaintButtonAnim() {
        this.paintButtons.getComponent(UIOpacityComponent).opacity = 0
        let t = tween(this.paintButtons.getComponent(UIOpacityComponent))
            .to(0.2, { opacity: 255 })
            .start()
        this.tweenList.push(t)
    }

    playEnergyCostAnim(num: number) {
        let uiOpacity = this.energyCost.getComponent(UIOpacityComponent)
        uiOpacity.opacity = 255
        this, this.energyCost.setPosition(0, 0, 0)
        this.energyCost.active = true
        this.energyCost.getChildByName("Label").getComponent(LabelComponent).string = num.toString()
        let pos = this.energyCost.getPosition()
        pos.y += 20
        tween(this.energyCost)
            .to(0.5, { position: pos })
            .call(() => {
                this.energyCost.active = false
            })
            .start()
        tween(uiOpacity)
            .to(0.5, { opacity: 0 }, { easing: "circOutIn" })
            .start()
    }

    playGemCostAnim(num: number) {
        let uiOpacity = this.gemCost.getComponent(UIOpacityComponent)
        uiOpacity.opacity = 255
        this, this.gemCost.setPosition(0, 0, 0)
        this.gemCost.active = true
        this.gemCost.getChildByName("Label").getComponent(LabelComponent).string = num.toString()
        let pos = this.gemCost.getPosition()
        pos.y += 20
        tween(this.gemCost)
            .to(0.5, { position: pos })
            .call(() => {
                this.gemCost.active = false
            })
            .start()
        tween(uiOpacity)
            .to(0.5, { opacity: 0 }, { easing: "circOutIn" })
            .start()
    }

    registerPaintButtonCB(cb) {
        this.onPaintButtonCallback = cb
    }

    registerAdPaintButtonCB(cb) {
        this.onAdPaintButtonCallback = cb
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
        this.node.active = false
    }

    onBombDisplay() {
        if (this.bombAddButton.active == true) {
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

    oneButtonFinishLevel(){
        let gameMgr = find("GamaManagers").getComponent("GameMgr")
        //@ts-ignore
        gameMgr.oneButtonFinishLevel()
    }

    onDestroy() {
        for (let i of this.tweenList) {
            if (i && this.node) {
                i.stop()
            }
        }
    }
}
