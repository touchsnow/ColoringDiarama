import { _decorator, Component, Node } from 'cc';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('UnlockVipTipDialog')
export class UnlockVipTipDialog extends BasePuzzleDialog {

    @property(Node)
    sureButton: Node = null

    @property(Node)
    closeButton: Node = null

    private callback = null

    start() {
        super.start()
        this.callback = this._data.callBack
        this.closeButton.on(Node.EventType.TOUCH_END, this.onTouchClose, this)
        this.sureButton.on(Node.EventType.TOUCH_END,this.onSureButton,this)
    }

    onSureButton() {
        this.onTouchClose(null,false)
        if (this.callback) this.callback()
    }

}
