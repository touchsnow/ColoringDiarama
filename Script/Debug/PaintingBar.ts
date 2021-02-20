import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PaintingBar')
export class PaintingBar extends Component {

    @property(Node)
    targetNode:Node = null


    start () {
        this.node.on(Node.EventType.TOUCH_END,this.onTouchEnd,this)
    }

    onTouchEnd(){   
        this.targetNode.active = !this.targetNode.active
    }

}
