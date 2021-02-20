import { _decorator, Component, Node } from 'cc';
import { ConfigManager } from '../../../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IRecored } from './IRecored';
const { ccclass, property } = _decorator;

@ccclass('PlayedModelRecored')
export class PlayedModelRecored extends IRecored {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start() {
        this.updateDisplay()
    }

    updateDisplay() {
        let playedCount = 0
        let config = ConfigManager.getInstance().mianConfig.json["MainList"]
        for (let levelName of config) {
            let finishResult = StorgeMgr.getInstance().getLevelInfo(levelName).played
            if (finishResult) {
                playedCount += 1
            }
        }
        this.label.string = playedCount.toString()
    }
}
