import { _decorator, Component, Node, LabelComponent } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('PromotyDialog')
export class PromotyDialog extends BasePuzzleDialog {
    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    label: LabelComponent = null

    start() {
        super.start()
        AudioManager.getInstance().playEffectByPath("Click03")
        this.label.string = this._data.label
        this.closeButton.on(Node.EventType.TOUCH_END, this.onTouchClose, this)
    }
}
