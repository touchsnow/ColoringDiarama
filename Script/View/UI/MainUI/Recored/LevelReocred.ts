import { _decorator, Component, Node } from 'cc';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IRecored } from './IRecored';
const { ccclass, property } = _decorator;

@ccclass('LevelReocred')
export class LevelReocred extends IRecored {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        this.updateDisplay()
    }
    updateDisplay(){
        this.label.string = StorgeMgr.getInstance().playerLevel.toString()
    }
    
}
