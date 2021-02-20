import { _decorator, Component, Node, DirectionalLightComponent } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('UnlockWelfareDialog')
export class UnlockWelfareDialog extends BasePuzzleDialog {

    @property(Node)
    acceptButton: Node = null

    @property(Node)
    cancleButton: Node = null

    @property(Node)
    bombAd: Node = null

    @property(Node)
    bombRecieved: Node = null

    @property(Node)
    promotyAd: Node = null

    @property(Node)
    promotyRecieved: Node = null

    @property(Node)
    starAd: Node = null

    @property(Node)
    starRecieved: Node = null

    @property(Node)
    bombFree: Node = null

    @property(Node)
    promotyFree: Node = null

    @property(Node)
    starFree: Node = null

    private acceptCallback = null
    private cancleCallbak = null



    start() {
        super.start()
        this.acceptCallback = this._data.acceptCallback
        this.cancleCallbak = this._data.cancleCallback
        this.acceptButton.on(Node.EventType.TOUCH_END, this.onAcceptButton, this)
        this.cancleButton.on(Node.EventType.TOUCH_END, this.onCancleButton, this)

        this.bombAd.on(Node.EventType.TOUCH_END, this.onBombAd, this)
        this.starAd.on(Node.EventType.TOUCH_END, this.onStarAd, this)
        this.promotyAd.on(Node.EventType.TOUCH_END, this.onPromotyAd, this)
        this.bombFree.on(Node.EventType.TOUCH_END, this.onBombFree, this)
        this.starFree.on(Node.EventType.TOUCH_END, this.onStarFree, this)
        this.promotyFree.on(Node.EventType.TOUCH_END, this.onPromotyFree, this)
    }

    onAcceptButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                StorgeMgr.getInstance().bombCount += 1
                StorgeMgr.getInstance().promotyCount += 1
                StorgeMgr.getInstance().skillStarProgress += 90
                if (StorgeMgr.getInstance().skillStarProgress >= 300) {
                    StorgeMgr.getInstance().skillStarProgress = 300
                }
                StorgeMgr.getInstance().update()
                if (this.acceptCallback) this.acceptCallback()
                this.onTouchClose(null, false)
                DialogManager.getInstance().showDlg("WelfareRewardDialog")
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

    onCancleButton() {
        this.onTouchClose(null, false)
        if (this.cancleCallbak) this.cancleCallbak()
    }

    onBombFree() {
        console.log("onBombFree")
        StorgeMgr.getInstance().bombCount += 1
        StorgeMgr.getInstance().update()
        this.bombFree.active = false
        this.bombAd.active = false
        this.bombRecieved.active = true
        this.promotyAd.active = true
        this.promotyFree.active = false
        this.starAd.active = true
        this.starFree.active = false
    }

    onPromotyFree() {
        console.log("onPromotyFree")

        StorgeMgr.getInstance().promotyCount += 1
        StorgeMgr.getInstance().update()
        this.promotyFree.active = false
        this.promotyAd.active = false
        this.promotyRecieved.active = true
        this.bombAd.active = true
        this.bombFree.active = false
        this.starAd.active = true
        this.starFree.active = false

    }

    onStarFree() {
        console.log("onStarFree")

        StorgeMgr.getInstance().skillStarProgress += 90
        if (StorgeMgr.getInstance().skillStarProgress >= 300) {
            StorgeMgr.getInstance().skillStarProgress = 300
        }
        StorgeMgr.getInstance().update()
        this.starFree.active = false
        this.starAd.active = false
        this.starRecieved.active = true
        this.bombAd.active = true
        this.bombFree.active = false
        this.promotyAd.active = true
        this.promotyFree.active = false

    }

    onBombAd() {
        var callback = function (isEnd) {
            if (isEnd) {
                StorgeMgr.getInstance().bombCount += 1
                StorgeMgr.getInstance().update()
                this.bombRecieved.active = true
                this.bombAd.active = false
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

    onPromotyAd() {
        var callback = function (isEnd) {
            if (isEnd) {
                StorgeMgr.getInstance().promotyCount += 1
                StorgeMgr.getInstance().update()
                this.promotyRecieved.active = true
                this.promotyAd.active = false
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

    onStarAd() {
        var callback = function (isEnd) {
            if (isEnd) {
                StorgeMgr.getInstance().skillStarProgress += 90
                if (StorgeMgr.getInstance().skillStarProgress >= 300) {
                    StorgeMgr.getInstance().skillStarProgress = 300
                }
                StorgeMgr.getInstance().update()
                this.starRecieved.active = true
                this.starAd.active = false
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
