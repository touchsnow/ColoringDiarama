import { _decorator, Component, Node } from 'cc';
import ASCAd from '../../../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IStroeItem } from './IStroeItem';
const { ccclass, property } = _decorator;

@ccclass('VipDailyIssuse')
export class VipDailyIssuse extends IStroeItem {

    @property(Node)
    vipItem: Node = null

    @property(Node)
    lockButton: Node = null

    start() {

        let result = this.getRecieveState()
        let isVip = StorgeMgr.getInstance().isVip
        if (isVip) {
            this.lockButton.active = false

            if (result) {
                this.recieved = true
                this.setDisable()
            } else {
                this.recieved = false
                this.setEnadble()
                if (!this.getRecieveState()) {
                    this.storepage.showTip()
                }
            }
        } else {
            this.enableNode.active = false
            this.disableNode.active = false
            this.lockButton.active = true
        }

        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        this.reciecedFunc = function () { this.revieveFunc() }.bind(this)
        this.unrecievedFunc = function () { this.unRecieveFunc() }.bind(this)
    }

    revieveFunc() {
        let isVip = StorgeMgr.getInstance().isVip
        if (isVip) {
            var callback = function (isEnd) {
                if (isEnd) {
                    this.setRecieveState()
                    this.recieved = true
                    let gameInfo = StorgeMgr.getInstance()
                    gameInfo.energy += 100
                    gameInfo.gem += 10
                    gameInfo.hadSeeAd = 1
                    gameInfo.finishAdCount += 1

                    gameInfo.update()
                    this.setDisable()
                    this.storepage.updateDisPlay()
                    let data = {
                        gemLabel: "10",
                        energyLabel: "100"
                    }
                    DialogManager.getInstance().showDlg("Gem&EnergyDialog", data)
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
        } else {

            var callBack = function () {
                var subcallback = function (isEnd) {
                    if (isEnd) {
                        StorgeMgr.getInstance().isVip = true
                        StorgeMgr.getInstance().hadSeeAd = 1
                        StorgeMgr.getInstance().finishAdCount += 1
                        StorgeMgr.getInstance().update()
                        this.updateDisplay()
                        this.vipItem.getComponent("Vip").updateDisplay()
                        DialogManager.getInstance().showDlg("VipDialog")
                    }
                    else {
                        UIUtility.getInstance().showTopTips("视频未播放完成！")
                    }
                    AudioManager.getInstance().resumeMusic()
                }.bind(this)
                if (ASCAd.getInstance().getVideoFlag()) {
                    ASCAd.getInstance().showVideo(subcallback)
                    AudioManager.getInstance().pauseMusic()
                }
                else {
                    UIUtility.getInstance().showTopTips("视频未加载完成！")
                }
            }.bind(this)

            let data = {
                callBack: callBack
            }
            DialogManager.getInstance().showDlg("UnLockVipTip", data)
        }
    }

    unRecieveFunc() {
        UIUtility.getInstance().showTopTips("已领取过！")
    }

    updateDisplay() {
        let result = this.getRecieveState()
        let isVip = StorgeMgr.getInstance().isVip
        if (isVip) {
            this.lockButton.active = false

            if (result) {
                this.recieved = true
                this.setDisable()

            } else {
                this.recieved = false
                this.setEnadble()
            }
        } else {
            this.enableNode.active = false
            this.disableNode.active = false
            this.lockButton.active = true
        }
    }

}
