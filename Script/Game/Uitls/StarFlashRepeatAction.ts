import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StarFlashRepeatAction')
export class StarFlashRepeatAction extends Component {

    start() {
        tween(this.node).repeatForever(
            tween(this.node)
                .call(() => {
                    this.node.setPosition(cc.v3(-60, 60, 0))
                })
                .to(0.3, { position: cc.v3(60, -60, 0) },{easing:"circOut"})
                .delay(0.8)
                .start()
        ).start()
    }

}
