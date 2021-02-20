import { _decorator, Component, Node, tween } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import { ConfigManager } from '../Managers/ConfigManager';
import { GameMgr } from '../Managers/GameMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
import { ISceneState } from './ISceneState';
const { ccclass, property } = _decorator;

@ccclass('SettlePageAnimState')
export class SettlePageAnimState extends ISceneState {
    init(gameMgr: GameMgr) {
        super.init(gameMgr)
        this.gameUIMgr.sellectUI.backToMainButton.off(Node.EventType.TOUCH_END)
        this.gameUIMgr.sellectUI.setTrue()
        this.gameUIMgr.sellectUI.progressBar1.fillRange = 0
        this.gameUIMgr.sellectUI.progressBar2.fillRange = 0
        tween(this.gameUIMgr.sellectUI.progressBar1)
            .to(0.8, { fillRange: 1 })
            .start()
        this.scheduleOnce(() => {
            tween(this.gameUIMgr.sellectUI.progressBar2)
                .to(0.4, { fillRange: 1 })
                .start()
        }, 0.8)
        this.scheduleOnce(() => {
            AudioManager.getInstance().playEffectByPath("Click_OK")
            tween(this.gameUIMgr.sellectUI.gif)
                .to(0.4, { scale: cc.v3(1.3, 1.3, 1.3) }, { easing: "circOut" })
                .to(0.4, { scale: cc.v3(1, 1, 1) }, { easing: "circOutIn" })
                .start()
        }, 1.6)
        this.scheduleOnce(() => {
            let levelName = ConfigManager.getInstance().currentLevel.levelName
            let levelInfo = StorgeMgr.getInstance().getLevelInfo(levelName)
            if (!levelInfo.finished) {
                var data = {
                    spritePath: ConfigManager.getInstance().currentLevel.spritePath
                }
                DialogManager.getInstance().showDlg("SettlePageDialog", data)
            }
        }, 2.4)
        
    }

    release() {
        super.release()
    }

}
