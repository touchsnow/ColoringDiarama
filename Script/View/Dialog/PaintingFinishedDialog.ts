import { _decorator, Component, Node, ParticleSystemComponent } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
import { GameMgr } from '../../Game/Managers/GameMgr';
import { PaintSceneState } from '../../Game/SceneState/PaintSceneState';
import { SellectSceneState } from '../../Game/SceneState/SellectSceneState';
const { ccclass, property } = _decorator;

@ccclass('PaintingFinishedDialog')
export class PaintingFinishedDialog extends BasePuzzleDialog {


    @property(Node)
    comfigButton: Node = null

    @property(ParticleSystemComponent)
    finishParticle: ParticleSystemComponent = null

    private callBack = null

    start() {
        super.start()
        AudioManager.getInstance().playEffectByPath("Congratulation") 
        this.comfigButton.on(Node.EventType.TOUCH_END, this.onComfigButton,this)
        this.finishParticle.play()
    }

    onComfigButton() {
        this.finishParticle.stop()
        this.onTouchClose(null,false)
        var callBack = function () {
            GameMgr.getInstance().switchSceneState(new SellectSceneState())
        }.bind(this)
        let sceneState = GameMgr.getInstance().sceneState as PaintSceneState
        sceneState.playBackToSellectStateAnim(callBack)
    }

}
