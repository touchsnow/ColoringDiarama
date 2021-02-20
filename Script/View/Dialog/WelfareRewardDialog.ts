import { _decorator, Component, Node, LabelComponent } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('WelfareRewardDialog')
export class WelfareRewardDialog extends BasePuzzleDialog {
    @property(Node)
    closeButton: Node = null

    start() {
        super.start()
        AudioManager.getInstance().playEffectByPath("Click03")
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
    }

    onCloseButton() {
        this.onTouchClose(null, false)
    }
}
