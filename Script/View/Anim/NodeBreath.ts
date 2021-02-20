import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeBreath')
export class NodeBreath extends Component {

    start() {
        tween(this.node)
            .to(0.35, { scale: cc.v3(1.1, 1.1, 1.1) })
            .to(0.35, { scale: cc.v3(1, 1, 1) })
            .union()
            .repeatForever()
            .start()
    }
}
