import { _decorator, Component, Node } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('FixationEulerRotate')
@executeInEditMode
export class FixationEulerRotate extends Component {
    time = 0
    update(deltaTime: number) {
        this.time += deltaTime
        this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y, -30 * Math.floor(this.time / 0.2))
    }
}
