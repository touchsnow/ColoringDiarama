import { _decorator, Component, Node, CCInteger, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SignItem')
export class SignItem extends Component {

    /**可领取节点的显示 */
    @property(Node)
    ableNode: Node = null
    /**不可领取节点的显示 */
    @property(Node)
    unableNode: Node = null
    /**已领取节点的显示 */
    @property(Node)
    hadReceieveNode: Node = null
    /**奖励的Case值 */
    @property(CCInteger)
    caseValue: number = -1

    /**根据条件初始化领取状态 */
    init() {
        let recieved = this.getRecievedState()
        if (recieved) {
            this.setHadRecieve()
        } else {
            this.setAbleRecieve()
        }
    }

    /**设置可领取状态 */
    setAbleRecieve() {
        if (this.ableNode) this.ableNode.active = true
        if (this.unableNode) this.unableNode.active = false
        if (this.hadReceieveNode) this.hadReceieveNode.active = false
        this.setRecievedState(false)
    }

    /**设置不可领取状态 */
    setUnableRecieve() {
        if (this.ableNode) this.ableNode.active = false
        if (this.unableNode) this.unableNode.active = true
        if (this.hadReceieveNode) this.hadReceieveNode.active = false
    }

    /**设置已经领取状态 */
    setHadRecieve() {
        if (this.ableNode) this.ableNode.active = false
        if (this.unableNode) this.unableNode.active = false
        if (this.hadReceieveNode) this.hadReceieveNode.active = true
        this.setRecievedState(true)
    }
    /**获取是否已领取 */
    getRecievedState() {
        let data = sys.localStorage.getItem(this.node.name)
        if (data) {
            let value = JSON.parse(data);
            return typeof value == 'undefined' || value == null ? false : value;
        }
        return false
    }
    /**设置是否已领取 */
    setRecievedState(state: boolean) {
        let data = JSON.stringify(state)
        sys.localStorage.setItem(this.node.name, data)
    }
    /**后去Case值 */
    getCaseValue() {
        return this.caseValue
    }
}
