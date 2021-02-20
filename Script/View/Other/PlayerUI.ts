import { _decorator, Component, Node, SpriteComponent, LabelComponent } from 'cc';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('PlayerUI')
export class PlayerUI extends Component {
    @property(SpriteComponent)
    levelRound:SpriteComponent = null

    @property(LabelComponent)
    levelLabel:LabelComponent = null
    start () {
        this.levelLabel.string = "Lv."+ Math.floor(StorgeMgr.getInstance().playerLevel).toString() 
        
        this.levelRound.fillRange = StorgeMgr.getInstance().playerLevel - Math.floor(StorgeMgr.getInstance().playerLevel)
    
        
    }
}
