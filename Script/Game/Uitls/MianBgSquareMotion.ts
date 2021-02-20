import { _decorator, Component, Node, profiler, CCInteger, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MianBgSquareMotion')
export class MianBgSquareMotion extends Component {

    @property(CCInteger)
    speed: number = 1

    private originalPos: Vec3 = new Vec3()

    private moveVec = new Vec3(0, 1, 0)

    start() {
        this.moveVec.multiplyScalar(this.speed)
        this.originalPos = this.node.position.clone()
    }

    update(deltaTime: number) {
        this.node.setPosition(this.node.position.add(this.moveVec))
        if (this.node.position.y >= 1190) {
            this.node.setPosition(this.originalPos.x, -1190, this.originalPos.z)
        }
    }
}
