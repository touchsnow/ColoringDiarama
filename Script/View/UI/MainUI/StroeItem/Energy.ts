import { _decorator, Component, Node, CCInteger } from 'cc';
import ASCAd from '../../../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IStroeItem } from './IStroeItem';
const { ccclass, property } = _decorator;

@ccclass('Energy')
export class Energy extends IStroeItem {

    @property(CCInteger)
    reward: number = 0

    start() {
        //super.start()
        this.setEnadble()
        this.reciecedFunc = function () { this.revieveFunc() }.bind(this)
        this.unrecievedFunc = function () { this.unRecieveFunc() }.bind(this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    revieveFunc() {
        var callback = function (isEnd) {
            if (isEnd) {
                //this.setRecieveState()
                let gameInfo = StorgeMgr.getInstance()
                gameInfo.energy += this.reward
                gameInfo.hadSeeAd = 1
                gameInfo.finishAdCount += 1
                //this.recieved = true
                gameInfo.update()
                //this.setDisable()
                this.storepage.updateDisPlay()
                let data = {
                    label: this.reward.toString()
                }
                DialogManager.getInstance().showDlg("EnergyDialog", data)
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
        UIUtility.getInstance().showTopTips("已领取过！")
    }
}
