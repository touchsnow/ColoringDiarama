import { _decorator, Component, Node, Vec3, Tween, tween, CameraComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpeningCamera')
export class OpeningCamera extends Component {

    @property(Node)
    followTarget: Node = null

    @property(CameraComponent)
    camera: CameraComponent = null


    @property(Node)
    effectCamera: Node = null

    private offset: Vec3 = new Vec3()

    public shakeSpeed: number = 5

    public shakeTween: Tween = null


    start() {
        this.offset = this.node.getWorldPosition().subtract(this.followTarget.getWorldPosition())
        this.cameraShake(1.5)
    }

    update(dt) {
        let targetPos = this.followTarget.getWorldPosition().add(this.offset)
        let startPos = this.node.getWorldPosition()
        this.node.setWorldPosition(startPos.lerp(targetPos, 0.3))
    }

    cameraShake(shakeSpeed: number) {
        this.shakeSpeed = shakeSpeed
        if (this.shakeTween) {
            this.shakeTween.stop()
        }
        this.shakeTween = tween(this.offset)
            .to(this.shakeSpeed, { x: this.offset.x + 0.4 })
            .to(this.shakeSpeed * 2, { y: this.offset.y + 0.8 })
            .to(this.shakeSpeed, { z: this.offset.z + 0.4 })
            .to(this.shakeSpeed * 2, { x: this.offset.x + 0.8 })
            .to(this.shakeSpeed, { y: this.offset.y - 0.4 })
            .to(this.shakeSpeed * 2, { z: this.offset.z + 0.8 })
            .to(this.shakeSpeed, { x: this.offset.x - 0.4 })
            .to(this.shakeSpeed, { y: this.offset.y + 0.4 })
            .to(this.shakeSpeed * 2, { z: this.offset.z - 0.8 })
            .to(this.shakeSpeed * 2, { x: this.offset.x - 0.8 })
            .to(this.shakeSpeed * 2, { y: this.offset.y - 0.8 })
            .to(this.shakeSpeed, { z: this.offset.z - 0.4 })
            .union()
            .repeatForever()
            .start()
    }

    onDestroy() {
        if (this.shakeTween) {
            this.shakeTween.stop()
        }
    }
}
