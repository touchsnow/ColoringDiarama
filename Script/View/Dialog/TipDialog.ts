import { _decorator, Component, Node, LabelComponent } from 'cc';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('TipDialog')
export class TipDialog extends BasePuzzleDialog {
    @property(Node)
    sureButton: Node = null

    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    tipLabel: LabelComponent = null

    private callback = null

    start() {
        super.start()
        this.callback = this._data.callBack
        this.tipLabel.string = this._data.tipLabel
        //console.log(this._data)
        //console.log(this.callback)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onTouchClose, this)
        this.sureButton.on(Node.EventType.TOUCH_END, this.onSureButton, this)
    }

    onSureButton() {
        this.onTouchClose(null, false)
        if (this.callback) this.callback()
    }
}
