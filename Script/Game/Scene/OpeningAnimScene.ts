import { _decorator, Component, Node, loader, Asset } from 'cc';
import BaseScene from '../../../Framework3D/Src/Base/BaseScene';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { ConfigManager } from '../Managers/ConfigManager';
import { StorgeMgr } from '../Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('OpeningAnimScene')
export class OpeningAnimScene extends BaseScene {

    // @property(Node)
    // skipNode: Node = null

    start() {
        super.start()
        //this.skipNode.on(Node.EventType.TOUCH_END, this.onSkipNode, this)
    }

    // onSkipNode() {
    //     ConfigManager.getInstance().setCurrentLevel("00202_CuteHamsterEatingCarrot")
    //     let resArray = ["Model/00202_CuteHamsterEatingCarrot"]
    //     loader.loadResArray(resArray, Asset, () => {
    //         StorgeMgr.getInstance().openingState = true
    //         StorgeMgr.getInstance().update()
    //         UIUtility.getInstance().loadScene("GameScene")
    //     })
    // }
}
