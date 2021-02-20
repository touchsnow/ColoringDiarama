import { _decorator, Component, Node } from 'cc';
import ASCAd from '../../../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IStroeItem } from './IStroeItem';
const { ccclass, property } = _decorator;

@ccclass('NoviceGift')
export class NoviceGift extends IStroeItem {

    start() {
        super.start()
        this.reciecedFunc = function () { this.revieveFunc() }.bind(this)
        this.unrecievedFunc = function () { this.unRecieveFunc() }.bind(this)
        if(!this.getRecieveState()){
            this.storepage.showTip()
        }
    }

    revieveFunc() {
        var callback = function (isEnd) {
            if (isEnd) {
                this.setRecieveState()
                let gameInfo = StorgeMgr.getInstance()
                gameInfo.energy += 80
                gameInfo.gem += 8
                gameInfo.hadSeeAd = 1
                gameInfo.finishAdCount += 1
                gameInfo.update()
                this.setDisable()
                this.storepage.updateDisPlay()
                this.recieved = true
                let data = {
                    gemLabel:"8",
                    energyLabel:"80"
                }
                DialogManager.getInstance().showDlg("Gem&EnergyDialog",data)
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
