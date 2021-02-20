import { _decorator, Component, Node, LabelComponent } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('GemEnergyDialog')
export class GemEnergyDialog extends BasePuzzleDialog {

    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    gemLabel: LabelComponent = null

    @property(LabelComponent)
    energyLabel: LabelComponent = null

    start() {
        super.start()
        this.gemLabel.string = this._data.gemLabel
        this.energyLabel.string = this._data.energyLabel
        AudioManager.getInstance().playEffectByPath("Click05")
        this.closeButton.on(Node.EventType.TOUCH_END, this.onTouchClose, this)
    }

}
