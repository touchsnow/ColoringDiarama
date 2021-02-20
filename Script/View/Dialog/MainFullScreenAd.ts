import { _decorator, Component, Node } from 'cc';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('MainFullScreenAd')
export class MainFullScreenAd extends BasePuzzleDialog {

    @property(Node)
    closeNode: Node = null

    start() {
        super.start()
        this.closeNode.on(Node.EventType.TOUCH_END,this.onCloseNode,this)
    }

    onCloseNode(){
        this.onTouchClose(null,false)
    }

}
