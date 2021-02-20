import { _decorator, Component, Node } from 'cc';
import { ConfigManager } from '../../../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
import { IRecored } from './IRecored';
const { ccclass, property } = _decorator;

@ccclass('FinishedModelRecored')
export class FinishedModelRecored extends IRecored {

    start() {
        this.updateDisplay()
    }

    updateDisplay() {
        let finishCount = 0
        let config = ConfigManager.getInstance().mianConfig.json["MainList"]
        for (let levelName of config) {
            let finishResult = StorgeMgr.getInstance().getLevelInfo(levelName).finished
            if (finishResult) {
                finishCount += 1
            }
        }
        this.label.string = finishCount.toString()
    }

}
