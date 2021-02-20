import { _decorator, Component, Node, ValueType, loader } from 'cc';
import AudioManager from '../../../../../Framework3D/Src/Base/AudioManager';
import { Constants } from '../../../../Data/Constants';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { StorePage } from '../StorePage';
const { ccclass, property } = _decorator;

@ccclass('IStroeItem')
export class IStroeItem extends Component {

    @property(Node)
    disableNode: Node = null

    @property(Node)
    enableNode: Node = null

    @property(StorePage)
    storepage: StorePage = null

    protected recieved = false
    protected reciecedFunc = null
    protected unrecievedFunc = null

    start() {
        let result = this.getRecieveState()
        if (result) {
            this.recieved = true
            this.setDisable()
        } else {
            this.recieved = false
            this.setEnadble()
        }
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    setEnadble() {
        this.disableNode.active = false
        this.enableNode.active = true
    }

    setDisable() {
        this.disableNode.active = true
        this.enableNode.active = false
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

    onTouch() {
        AudioManager.getInstance().playEffectByPath("Click01")
        if (!this.recieved) {
            if (this.reciecedFunc) this.reciecedFunc()
        } else {
            if (this.unrecievedFunc) this.unrecievedFunc()
        }
    }

}
