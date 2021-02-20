import { _decorator, Component, Node, sys } from 'cc';
import BaseDialog from '../../Base/BaseDialog';
import { SignItem } from './SignItem';
const { ccclass, property } = _decorator;

@ccclass('SignDialog')
export class SignDialog extends BaseDialog {

    /**签到奖励项 */
    @property([SignItem])
    signRewardItemList: SignItem[] = []
    /**领取按钮 */
    @property(Node)
    recieveButton: Node = null
    /**已经领取节点显示 */
    @property(Node)
    hadRecieveNode: Node = null
    /**关闭按钮 */
    @property(Node)
    closeButton: Node = null

    start() {
        super.start()
        this.recieveButton.on(Node.EventType.TOUCH_END, this.onRecieveButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        //初始化奖项
        this.initItem()
        //今天是否领取过？
        if (this.getRecieveState()) {
            //已领取过，显示已经领取节点
            this.hadRecieveNode.active = true
            this.recieveButton.active = false
        } else {
            //还未领取，显示领取按钮
            this.hadRecieveNode.active = false
            this.recieveButton.active = true
        }
        //如果需要开启新循环，把全部奖励设置为未领取状态
        if (!this.getRecieveState() && this.needStartNewCricle()) {
            for (let item of this.signRewardItemList) {
                item.setAbleRecieve()
            }
        }
    }
    /**初始化所有签到项 */
    initItem() {
        for (let item of this.signRewardItemList) {
            item.init()
        }
    }
    /**领取按钮 */
    onRecieveButton() {
        for (let item of this.signRewardItemList) {
            let recieved = item.getRecievedState()
            if (!recieved) {
                let caseValue = item.getCaseValue()
                item.setHadRecieve()
                this.enabledReward(caseValue, 1)
                break
            }
        }
        this.setRecieveState(true)
        this.hadRecieveNode.active = true
        this.recieveButton.active = false
    }

    /**
     * 点击领取时，自动设置奖励奖励
     * @说明 需要根据实际奖励填写
     * @caseValue 奖项的Case值
     * @addition 奖励是否加成
     */
    enabledReward(caseValue: number, addition: number = 1) {
        switch (caseValue) {
            case -1:
                console.log("默认值")
                break;
            default:
                break;
        }
    }
    /**是否需要开启一个新循环
     * @说明 如果签到已经全部被领取过，返回 true
     */
    needStartNewCricle() {
        for (let item of this.signRewardItemList) {
            if (!item.getRecievedState()) {
                return false
            }
        }
        return true
    }

    /**获取领取状态 */
    getRecieveState() {
        let key = new Date().toLocaleDateString() + "SignReward"
        let data = sys.localStorage.getItem(key)
        if (data) {
            let value = JSON.parse(data);
            return typeof value == 'undefined' || value == null ? false : value;
        }
        return false
    }

    /**设置领取状态 */
    setRecieveState(state: boolean) {
        let key = new Date().toLocaleDateString() + "SignReward"
        let data = JSON.stringify(state)
        sys.localStorage.setItem(key, data)
    }

    /**关闭按钮毁掉 */
    onCloseButton() {
        this.onTouchClose(null, false)
    }
    
}
