import { _decorator, Component, Node } from 'cc';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { Constants } from '../../../../Data/Constants';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IAchieveItem } from './IAchieveItem';
const { ccclass, property } = _decorator;

@ccclass('LevelAchieveItem')
export class LevelAchieveItem extends IAchieveItem {
    start() {
        this.updateDisplay()
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    updateDisplay() {
        this.targetCount = this.getTargetCount()
        let currentCount = StorgeMgr.getInstance().playerLevel
        this.content.string = "请达到" + this.targetCount.toString() + "级以上。"
        let progress = currentCount / this.targetCount
        this.rewardCount = this.defaultReward
        this.rewardCountLabel.string = this.rewardCount.toString()
        if (progress >= 1) {
            this.canRecieve = true
            this.enabledBg.active = true
            this.disabledBg.active = false
        } else {
            this.canRecieve = false
            this.enabledBg.active = false
            this.disabledBg.active = true
        }
        this.bar.fillRange = progress
        this.barlabel.string = currentCount.toString() + "/" + this.targetCount
    }

    setTargetCount() {
        this.targetCount += 1
        this.rewardCount = this.defaultReward
        let key = Constants.GameVer.toString() + this.node.name
        StorgeMgr.getInstance().set(key, this.targetCount)
    }

    onTouch() {
        if (this.canRecieve) {
            StorgeMgr.getInstance().energy += this.rewardCount
            StorgeMgr.getInstance().update()
          //  console.log(this.rewardCount)
            let data = {
                label: this.rewardCount.toString()
            }
            DialogManager.getInstance().showDlg("EnergyDialog", data)
            this.setTargetCount()
            this.updateDisplay()
        } else {
            UIUtility.getInstance().showTopTips("不满足条件")
        }
    }
}
