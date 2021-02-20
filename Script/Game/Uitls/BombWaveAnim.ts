import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BombWaveAnim')
export class BombWaveAnim extends Component {

    start() {
        let scale = this.node.getScale()
        this.node.setScale(scale.clone().multiplyScalar(0.2))
        tween(this.node)
            .to(0.3, { scale: scale },{easing:"circOut"})
            .delay(2.1)
            .call(() => {
                this.node.active = false
            })
            .start()
    }

    update(dt) {
        let euler = this.node.eulerAngles
        this.node.setRotationFromEuler(euler.x, euler.y + dt * 100, euler.z)
    }

}
