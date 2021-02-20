import { _decorator, Component, Node, CCInteger } from 'cc';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { StorePage } from '../StorePage';
const { ccclass, property } = _decorator;

@ccclass('GenStroe')
export class GenStroe extends Component {

    @property(CCInteger)
    energyCount: number = 0

    @property(CCInteger)
    gemCount: number = 0

    @property(StorePage)
    storePage: StorePage = null

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    onTouch() {
        let gem = StorgeMgr.getInstance().gem
        if (gem < this.gemCount) {
            UIUtility.getInstance().showTopTips("水晶不足！")
        } else {
            StorgeMgr.getInstance().energy += this.energyCount
            StorgeMgr.getInstance().gem -= this.gemCount
            StorgeMgr.getInstance().update()
            this.storePage.updateDisPlay()
            let data = {
                label: this.energyCount.toString()
            }
            DialogManager.getInstance().showDlg("EnergyDialog", data)
        }
    }

}
