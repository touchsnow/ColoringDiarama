import { _decorator, Component, Node, LabelComponent, SpriteComponent, CCInteger } from 'cc';
import { Constants } from '../../../../Data/Constants';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('IAchieveItem')
export class IAchieveItem extends Component {

    @property(LabelComponent)
    content: LabelComponent = null

    @property(SpriteComponent)
    bar: SpriteComponent = null

    @property(LabelComponent)
    barlabel: LabelComponent = null

    @property(Node)
    enabledBg: Node = null

    @property(Node)
    disabledBg: Node = null

    @property(LabelComponent)
    rewardCountLabel: LabelComponent = null

    @property(CCInteger)
    defaultTargetValue: number = 0

    @property(CCInteger)
    defaultReward: number = 0

    targetCount: number = 0

    rewardCount: number = 0

    canRecieve: boolean = false

    start() { }

    updateDisplay() { }

    getTargetCount() {
        let key = Constants.GameVer.toString() + this.node.name
        return StorgeMgr.getInstance().get(key, this.defaultTargetValue)
    }

    setTargetCount() { }


}
