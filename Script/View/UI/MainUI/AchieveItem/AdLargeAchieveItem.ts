import { _decorator, Component, Node, LabelComponent } from 'cc';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { Constants } from '../../../../Data/Constants';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IAchieveItem } from './IAchieveItem';
const { ccclass, property } = _decorator;

@ccclass('AdLargeAchieveItem')
export class AdLargeAchieveItem extends IAchieveItem {


    @property(LabelComponent)
    label: LabelComponent = null

    start() {
        this.updateDisplay()
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    updateDisplay() {
        this.targetCount = this.getTargetCount()
        let currentCount = StorgeMgr.getInstance().finishAdCount
        console.log("请完整观看视频5次以上" + currentCount)
        console.log("目标" + this.targetCount)
        this.content.string = "请完整观看视频5次以上。"
        //  console.log(currentCount)
        //  console.log(this.targetCount)
        let progress = (currentCount - this.targetCount + 5) / 5
        if (progress <= 0) {
            progress = 0
        }
        if (progress >= 1) {
            progress = 1
        }
        this.rewardCount = this.defaultReward
        this.rewardCountLabel.string = this.rewardCount.toString()
        if (progress >= 1) {
            if (this.getRecieveState()) {
                this.canRecieve = false
                this.enabledBg.active = false
                this.disabledBg.active = true
                this.label.string = "明日可领取"
            } else {
                this.canRecieve = true
                this.enabledBg.active = true
                this.disabledBg.active = false
                this.label.string = "领取"
            }

        } else {
            this.canRecieve = false
            this.enabledBg.active = false
            this.disabledBg.active = true
            if (this.getRecieveState()) {
                this.label.string = "明日可领取"
            } else {
                this.label.string = "领取"
            }
        }
        this.bar.fillRange = progress
        this.barlabel.string = progress * 5 + "/5"
    }

    setTargetCount() {
        this.targetCount += 5
        this.rewardCount = this.defaultReward
        let key = Constants.GameVer.toString() + this.node.name
        StorgeMgr.getInstance().set(key, this.targetCount)
    }

    onTouch() {
        if (this.canRecieve) {
            StorgeMgr.getInstance().gem += this.rewardCount
            StorgeMgr.getInstance().update()
            //  console.log(this.rewardCount)
            let data = {
                label: this.rewardCount.toString()
            }
            DialogManager.getInstance().showDlg("GemDialog", data)
            this.setTargetCount()
            this.updateDisplay()
            this.setRecieveState()
        } else {
            UIUtility.getInstance().showTopTips("不满足条件")
        }
    }

    getRecieveState() {
        let todayDay = new Date().toLocaleDateString()
        let key = Constants.GameVer.toString() + this.node.name + todayDay
        let value = StorgeMgr.getInstance().get(key, false)
        return value
    }

    setRecieveState() {
        let todayDay = new Date().toLocaleDateString()
        let key = Constants.GameVer.toString() + this.node.name + todayDay
        StorgeMgr.getInstance().set(key, true)
    }
}
