import { _decorator, Component, Node, LabelComponent } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('EnergyDialog')
export class EnergyDialog extends BasePuzzleDialog {

    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    label: LabelComponent = null

    start() {
        super.start()
        this.label.string = this._data.label
        AudioManager.getInstance().playEffectByPath("Click04")
        this.closeButton.on(Node.EventType.TOUCH_END, this.onTouchClose, this)
    }



}
