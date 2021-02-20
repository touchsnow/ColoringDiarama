import { _decorator, Component, Node, LabelComponent, labelAssembler, SpriteComponent, loader, find, Asset } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
import { LevelInfo } from '../../Data/LevelInfo';
import { ConfigManager } from '../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('LevelUnlockTipDialog')
export class LevelUnlockTipDialog extends BasePuzzleDialog {

    @property(Node)
    closeButton: Node = null

    @property(Node)
    AdsButton: Node = null

    @property(Node)
    acceptButton: Node = null

    @property(LabelComponent)
    currentEnegry: LabelComponent = null

    @property(LabelComponent)
    currentGem: LabelComponent = null

    @property(LabelComponent)
    currentBomb: LabelComponent = null

    @property(LabelComponent)
    currentStar: LabelComponent = null

    @property(LabelComponent)
    totalEnery: LabelComponent = null

    @property(LabelComponent)
    levelName: LabelComponent = null

    @property(Node)
    stars: Node = null

    @property(SpriteComponent)
    levelSprite: SpriteComponent = null

    private levelInfo: LevelInfo = null

    start() {
        super.start()
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        this.AdsButton.on(Node.EventType.TOUCH_END, this.onAdsButton, this)
        this.acceptButton.on(Node.EventType.TOUCH_END, this.onAcceptButton, this)
        this.levelInfo = this._data.levelInfo
        this.stars.children[this.levelInfo.star - 1].active = true
        this.levelSprite.spriteFrame = loader.getRes(this.levelInfo.spritePath)
        this.totalEnery.string = this.levelInfo.totalEnergy.toString()
        this.currentEnegry.string = StorgeMgr.getInstance().energy.toString()
        this.currentGem.string = StorgeMgr.getInstance().gem.toString()
        this.currentBomb.string = StorgeMgr.getInstance().bombCount.toString()
        this.currentStar.string = (StorgeMgr.getInstance().skillStarProgress/3).toFixed(0) + "%"
        this.levelName.string = this.levelInfo.cnName
    }

    initData(data) {
        super.initData(data)
    }

    onCloseButton() {
        this.onTouchClose(null, false)
    }

    onAcceptButton() {
        if (this.levelInfo.star > StorgeMgr.getInstance().playerLevel) {
            UIUtility.getInstance().showTopTips("等级不够！")
            return
        }
        if (StorgeMgr.getInstance().energy >= 10) {
            StorgeMgr.getInstance().energy -= 10
            StorgeMgr.getInstance().update()
            this.currentEnegry.string = StorgeMgr.getInstance().energy.toString()
            ConfigManager.getInstance().setCurrentLevel(this.levelInfo.levelName)
            find("Canvas/Loading").active = true
            let resArray = [this.levelInfo.modelPath]
            let effectPath = ConfigManager.getInstance().currentLevel.effectPath
                if (effectPath !== "") {
                    resArray.push(effectPath)
                }
            this.onTouchClose(null, false)
            loader.loadResArray(resArray, Asset, () => {
                UIUtility.getInstance().loadScene("GameScene")
            })
        }
        else {
            this.onTouchClose(null, false)
            var unlockCallback = function () {
                ConfigManager.getInstance().setCurrentLevel(this.levelInfo.levelName)
                find("Canvas/Loading").active = true
                let resArray = [this.levelInfo.modelPath]
                let effectPath = ConfigManager.getInstance().currentLevel.effectPath
                if (effectPath !== "") {
                    resArray.push(effectPath)
                }
                this.onTouchClose(null, false)
                loader.loadResArray(resArray, Asset, () => {
                    UIUtility.getInstance().loadScene("GameScene")
                })
            }.bind(this)
            var acceptCallback = function () { }.bind(this)
            let data = {
                unlockCallback: unlockCallback,
                acceptCallback: acceptCallback,
                neededCount: "10"
            }
            DialogManager.getInstance().showDlg("EnergyInsufficientDialog", data)
        }
    }

    onAdsButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                ConfigManager.getInstance().setCurrentLevel(this.levelInfo.levelName)
                find("Canvas/Loading").active = true
                let resArray = [this.levelInfo.modelPath]
                let effectPath = ConfigManager.getInstance().currentLevel.effectPath
                if (effectPath !== "") {
                    resArray.push(effectPath)
                }
                let gameInfo = StorgeMgr.getInstance()
                gameInfo.hadSeeAd = 1
                gameInfo.finishAdCount += 1
                gameInfo.update()
                this.onTouchClose(null, false)
                loader.loadResArray(resArray, Asset, () => {
                    UIUtility.getInstance().loadScene("GameScene")
                })
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
    }



}
