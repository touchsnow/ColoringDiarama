import { _decorator, Component, Node, game, textureUtil, SpriteComponent, loader, LabelComponent, tween, Tween } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
import { ConfigManager } from '../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('SettlePageDialog')
export class SettlePageDialog extends BasePuzzleDialog {

    @property(Node)
    gifNode: Node = null

    @property(Node)
    gifButton: Node = null

    @property(Node)
    bombNode: Node = null

    @property(Node)
    bombButton: Node = null

    @property(Node)
    doubleBombButton: Node = null

    @property(Node)
    energyNode: Node = null

    @property(Node)
    energyButton: Node = null

    @property(Node)
    doubleEnergyButton: Node = null

    @property(Node)
    congratulationNode: Node = null

    @property(Node)
    congratulationButton: Node = null

    @property(Node)
    backNode: Node = null

    @property(Node)
    backToMainButton: Node = null

    @property(SpriteComponent)
    levelSprite: SpriteComponent = null

    @property(SpriteComponent)
    backLevelSprite: SpriteComponent = null

    @property(SpriteComponent)
    playerIcon: SpriteComponent = null

    @property(LabelComponent)
    playerLevel: LabelComponent = null

    @property(Node)
    playerNode: Node = null

    @property(Node)
    playerButton: Node = null

    tween: Tween = null

    start() {
        super.start()
        this.congratulationButton.on(Node.EventType.TOUCH_END, this.onCongratulationButton, this)
        this.gifButton.on(Node.EventType.TOUCH_END, this.onGifButton, this)
        this.bombButton.on(Node.EventType.TOUCH_END, this.onBombButton, this)
        this.doubleBombButton.on(Node.EventType.TOUCH_END, this.onDoubleBombButton, this)
        this.energyButton.on(Node.EventType.TOUCH_END, this.onEnergyButton, this)
        this.doubleEnergyButton.on(Node.EventType.TOUCH_END, this.onDoubleEnergyButton, this)
        this.playerButton.on(Node.EventType.TOUCH_END, this.onPlayerButton, this)
        this.backToMainButton.on(Node.EventType.TOUCH_END, this.onBackToMainButton, this)
        this.levelSprite.spriteFrame = loader.getRes(this._data.spritePath)
        this.backLevelSprite.spriteFrame = loader.getRes(this._data.spritePath)
        let levelName = ConfigManager.getInstance().currentLevel.levelName
        let levelInfo = StorgeMgr.getInstance().getLevelInfo(levelName)
        levelInfo.finished = true
        levelInfo.showSettlePage = true
        StorgeMgr.getInstance().setLevelInfo(levelName, levelInfo)
        StorgeMgr.getInstance().playerLevel += 0.25
        StorgeMgr.getInstance().energy += 10
        StorgeMgr.getInstance().bombCount += 1
        StorgeMgr.getInstance().update()
        ASCAd.getInstance().getIntersFlag() && ASCAd.getInstance().showInters();
    }

    initData(data) {
        super.initData(data)
    }

    onCongratulationButton() {
        this.congratulationNode.active = false
        this.gifNode.active = true
        AudioManager.getInstance().playEffectByPath("Click03")
    }

    onGifButton() {
        this.gifNode.active = false
        this.bombNode.active = true
        AudioManager.getInstance().playEffectByPath("Click04")
    }

    onBombButton() {
        this.bombNode.active = false
        this.energyNode.active = true
        AudioManager.getInstance().playEffectByPath("Click05")
    }

    onDoubleBombButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                console.log("this.bombNode")
                this.bombNode.active = false
                this.energyNode.active = true
                StorgeMgr.getInstance().bombCount += 1
                StorgeMgr.getInstance().hadSeeAd = 1
                StorgeMgr.getInstance().finishAdCount += 1
                StorgeMgr.getInstance().update()
                AudioManager.getInstance().playEffectByPath("Click05")
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

    onEnergyButton() {
        this.energyNode.active = false
        AudioManager.getInstance().playEffectByPath("Click06")
        this.enablePlayerPage()
    }

    onDoubleEnergyButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                this.energyNode.active = false
                StorgeMgr.getInstance().energy += 10
                StorgeMgr.getInstance().hadSeeAd = 1
                StorgeMgr.getInstance().finishAdCount += 1
                StorgeMgr.getInstance().update()
                AudioManager.getInstance().playEffectByPath("Click06")
                this.enablePlayerPage()
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


    enablePlayerPage() {
        this.playerNode.active = true
        let level = StorgeMgr.getInstance().playerLevel
        let lastLevel = level - 0.25
        this.playerLevel.string = "Lv." + Math.floor(lastLevel).toString()
        let prgress = lastLevel - Math.floor(lastLevel)
        this.playerIcon.fillRange = prgress
        this.tween = tween(this.playerIcon)
            .to(0.5, { fillRange: prgress + 0.25 })
            .call(() => {
                this.playerLevel.string = "Lv." + Math.floor(level).toString()
            })
            .start()
    }

    onPlayerButton() {
        this.playerNode.active = false
        this.backNode.active = true
        AudioManager.getInstance().playEffectByPath("Click03")
        ASCAd.getInstance().getIntersFlag() && ASCAd.getInstance().showInters();
    }

    onBackToMainButton() {
        UIUtility.getInstance().loadScene("MainScene")
    }

    onDestroy() {
        if (this.tween) {
            this.tween.stop()
        }
    }
}
