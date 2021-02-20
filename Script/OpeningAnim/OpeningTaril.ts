import { _decorator, Component, Node, CCInteger } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('OpeningTaril')
export class OpeningTaril extends Component {

    @property(CCInteger)
    speed: number = 0

    start() {
        // Your initialization goes here.
    }

    update(deltaTime: number) {
        this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y, this.node.eulerAngles.z + deltaTime * this.speed)
    }
}
