import { _decorator, Component, Node } from 'cc';
import ASCAd from '../../../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IStroeItem } from './IStroeItem';
const { ccclass, property } = _decorator;

@ccclass('Vip')
export class Vip extends IStroeItem {

    @property(Node)
    VipDailyIssuse: Node = null

    private isVip: boolean = false


    start() {
        this.reciecedFunc = function () { this.revieveFunc() }.bind(this)
        this.unrecievedFunc = function () { this.unRecieveFunc() }.bind(this)
        this.isVip = StorgeMgr.getInstance().isVip
        if (this.isVip) {
            this.recieved = true
            this.setDisable()
        } else {
            this.recieved = false
            this.setEnadble()
            if (!this.getRecieveState()) {
                this.storepage.showTip()
            }
        }
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    revieveFunc() {
        var callback = function (isEnd) {
            if (isEnd) {
                this.setRecieveState()
                let gameInfo = StorgeMgr.getInstance()
                gameInfo.isVip = true
                this.recieved = true
                gameInfo.hadSeeAd = 1
                gameInfo.finishAdCount += 1
                gameInfo.update()
                this.setDisable()
                DialogManager.getInstance().showDlg("VipDialog")
                this.VipDailyIssuse.getComponent("VipDailyIssuse").updateDisplay()
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

    unRecieveFunc() {
        UIUtility.getInstance().showTopTips("您已经是Vip会员了！")
    }

    updateDisplay() {
        this.isVip = StorgeMgr.getInstance().isVip
        if (this.isVip) {
            this.recieved = true
            this.setDisable()
        } else {
            this.recieved = false
            this.setEnadble()
        }
    }
}
