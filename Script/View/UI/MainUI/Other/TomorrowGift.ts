import { _decorator, Component, Node, LabelComponent, tween, Tween } from 'cc';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import { Constants } from '../../../../Data/Constants';
import { SignMgr } from '../../../../Game/Managers/SignMgr';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { NodeBreath } from '../../../Anim/NodeBreath';
const { ccclass, property } = _decorator;

@ccclass('TomorrowGift')
export class TomorrowGift extends Component {

    recieved: boolean = false

    @property(LabelComponent)
    label: LabelComponent = null

    // @property(NodeBreath)
    // nodeBreath: NodeBreath = null
    tween:Tween = null

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onTomorrowGift, this)
        this.tween = tween(this.node)
            .to(0.35, { scale: cc.v3(1.1, 1.1, 1.1) })
            .to(0.35, { scale: cc.v3(1, 1, 1) })
            .union()
            .repeatForever()
        this.updateTomorrowGift()
        
    }

    onTomorrowGift() {
        if (this.recieved) return
        StorgeMgr.getInstance().gem += 10
        StorgeMgr.getInstance().update()
        this.setRecieveState()
        this.updateTomorrowGift()
        let data = {
            label: 10
        }
        DialogManager.getInstance().showDlg("GemDialog", data)
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

    updateTomorrowGift() {
        let dataString = new Date().toLocaleDateString()
        console.log(dataString)
        console.log(SignMgr.getInstance().getFirstSignDate())
        if (this.getRecieveState() || dataString == SignMgr.getInstance().getFirstSignDate()) {
            this.tween.stop()
            this.node.setScale(cc.v3(1, 1, 1))
            this.recieved = true
            this.label.string = "明日登录可领取钻石*10"
        } else {
            this.tween.start()
            this.label.string = "领取登录奖励钻石*10"
        }
    }

}
