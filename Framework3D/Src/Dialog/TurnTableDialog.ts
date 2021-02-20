import { _decorator, Node, sys } from 'cc';
import BaseDialog from '../Base/BaseDialog';
import UIUtility from '../Base/UIUtility';
const { ccclass, property } = _decorator;

/**转盘的旋转状态 */
enum pointerStage {
    /**加速状态 */
    accelerationStage = "accelerationStage",
    /**恒速状态 */
    constantsStage = "constantsStage",
    /**减速状态 */
    slowStage = "slowStage",
    /**移动到目标角度状态 */
    moveToTargetStage = "moveToTargetStage"
}
/**指针状态 */
const PointerStage = pointerStage
@ccclass('TurnTableDialog')
export class TurnTableDialog extends BaseDialog {

    /**
     * 转盘奖励列表配置：根据转盘各个奖励的名字，概率，放置角度进行配置
     * @说明 此配置只是实例，要更具实机奖项重写配置
     * @itemName 奖励项目名字
     * @probability 期望值，期望值越大，中奖概率越高
     * @angle 奖励放置的角度，若中奖了，指针最终会旋转到这个角度
     */
    protected itemList = [
        { itemName: "item1", probability: 35, angle: 330 },
        { itemName: "item2", probability: 20, angle: 265 },
        { itemName: "item3", probability: 10, angle: 210 },
        { itemName: "item4", probability: 9, angle: 150 },
        { itemName: "item5", probability: 25, angle: 90 },
        { itemName: "item6", probability: 9, angle: 30 },
    ]

    /**旋转指针节点 */
    @property(Node)
    pointer: Node = null

    /**开始抽奖按钮 */
    @property(Node)
    turnButton: Node = null

    /**关闭按钮 */
    @property(Node)
    closeButton: Node = null

    /**当前旋转速度 */
    protected speed: number = 0
    /**指针状态 */
    protected pointerStage: pointerStage = null
    /**指针加速度 */
    private acclerationRate: number = 0.2
    /**指针减速度 */
    private slowRate: number = 0.08
    /**指针最小速度 */
    private minSpeed: number = 1.5
    /**指针加速时间 */
    private acclerateTime: number = 1.5
    /**指针当前加速时间 */
    private currAcclerTime: number = 0
    /**指针恒速时间 */
    private constantTime: number = 0.5
    /**指针当前恒速时间 */
    private currConstantTime: number = 0
    /**减速时间 */
    private slowTime: number = 3
    /**指针当前减速时间 */
    private currSlowTime: number = 0
    /**指针旋转的最终角度，即中奖的角度 */
    protected targerPoint: number = 0
    /**中奖项目 */
    protected correctItem = null
    /**指针是否在旋转 */
    protected isRotating = false
    /**期望值总合 */
    protected totalPro = 0

    start() {
        super.start()
        this.turnButton.on(Node.EventType.TOUCH_END, this.onTurnButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        this.totalPro = 0
        for (let item of this.itemList) {
            this.totalPro += item.probability
        }
    }

    initData(data) {
        super.initData(data)
    }

    update(dt) {
        if (this.pointerStage) {
            switch (this.pointerStage) {
                case PointerStage.accelerationStage:
                    this.accelerationStage(dt)
                    break;
                case PointerStage.constantsStage:
                    this.constantsStage(dt)
                    break;
                case PointerStage.slowStage:
                    this.slowStage(dt)
                    break;
                case PointerStage.moveToTargetStage:
                    this.moveToTargetStage(dt)
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 初始化转盘
     * @说明 每次开始抽奖都会调用
     */
    protected initPointer() {
        this.speed = 0
        this.currAcclerTime = 0
        this.currConstantTime = 0
        this.currSlowTime = 0
    }

    /**关闭转盘 */
    protected onCloseButton() {
        if (this.isRotating == true) {
            UIUtility.getInstance().showTopTips("正在抽奖中....")
            return
        }
        this.onTouchClose(null, false)
    }

    /**开始抽奖 */
    protected onTurnButton() {
        if (this.isRotating) {
            UIUtility.getInstance().showTopTips("正在抽奖中....")
            return
        }
        this.initPointer()
        let randomNum = Math.random() * this.totalPro
        let probability = 0
        for (let i = 0; i < this.itemList.length; i++) {
            probability += this.itemList[i].probability
            if (randomNum <= probability) {
                this.correctItem = this.itemList[i]
                break
            }
        }
        this.targerPoint = this.correctItem.angle
        this.pointerStage = PointerStage.accelerationStage
        this.isRotating = true
        this.setLotteryCount(this.getLotteryCount() + 1)
    }

    private accelerationStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        this.speed += this.acclerationRate
        pos.z = pos.z + this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        this.currAcclerTime += dt
        if (this.currAcclerTime >= this.acclerateTime) {
            this.pointerStage = PointerStage.constantsStage
        }
    }

    private constantsStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        pos.z += this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        this.currConstantTime += dt
        if (this.currConstantTime >= this.constantTime) {
            this.pointerStage = PointerStage.slowStage
        }
    }

    private slowStage(dt) {
        this.speed -= this.slowRate
        this.currSlowTime += dt
        if (this.speed <= this.minSpeed || this.currSlowTime >= this.slowTime) {
            this.speed = this.minSpeed
            let round = Math.ceil(this.pointer.eulerAngles.z / 360)
            if (this.targerPoint + round * 360 > this.pointer.eulerAngles.z) {
                this.targerPoint = round * 360 + this.targerPoint
            } else {
                this.targerPoint = (round - 1) * 360 + this.targerPoint
            }
            this.pointerStage = pointerStage.moveToTargetStage
        }
        let pos = this.pointer.eulerAngles.clone()
        pos.z += this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
    }

    private moveToTargetStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        let dis = this.targerPoint - this.pointer.eulerAngles.z
        if (dis <= 100) {
            let speed = this.speed * dis / 100
            if (dis / 100 < 1 / 10) {
                speed = this.speed * 1 / 10
            }
            pos.z += speed
            this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        } else {
            pos.z += this.speed
            this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        }
        if (this.pointer.eulerAngles.z >= this.targerPoint) {
            console.log(this.correctItem)
            this.setReward()
            this.pointerStage = null
            this.isRotating = false
        }
    }

    /**转盘旋转结束后，进行奖励
     * @说明 要根据实际奖励进行重写
     */
    setReward() {
        switch (this.correctItem.itemName) {
            case this.itemList[0].itemName:
                console.log("颁发奖项：" + this.itemList[0].itemName)
                break
            case this.itemList[1].itemName:
                console.log("颁发奖项：" + this.itemList[1].itemName)
                break
            case this.itemList[2].itemName:
                console.log("颁发奖项：" + this.itemList[2].itemName)
                break
            case this.itemList[3].itemName:
                console.log("颁发奖项：" + this.itemList[3].itemName)
                break
            case this.itemList[4].itemName:
                console.log("颁发奖项：" + this.itemList[4].itemName)
                break
            case this.itemList[5].itemName:
                console.log("颁发奖项：" + this.itemList[5].itemName)
                break
            default:
                break
        }
    }

    /**获取当天已抽奖次数 */
    getLotteryCount() {
        let key = "Lottery" + new Date().toLocaleDateString()
        let data = sys.localStorage.getItem(key)
        if (data) {
            let value = JSON.parse(data)
            return typeof value == 'undefined' || value == null ? 0 : value
        }
        return 0
    }

    /**设置当天已抽奖次数 */
    setLotteryCount(num: number) {
        let key = "Lottery" + new Date().toLocaleDateString()
        let data = JSON.stringify(num)
        sys.localStorage.setItem(key, data)
    }
}
