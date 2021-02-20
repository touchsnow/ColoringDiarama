import { _decorator, Component, Node } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('VipDialog')
export class VipDialog extends BasePuzzleDialog {
    @property(Node)
    closeButton: Node = null

    start() {
        super.start()
        AudioManager.getInstance().playEffectByPath("Click06")
        this.closeButton.on(Node.EventType.TOUCH_END, this.onTouchClose, this)
    }
}
