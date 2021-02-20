import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeMotion')
export class NodeMotion extends Component {

    //动作完成的回调
    callback: any = null
    //开始位置
    startPos: Vec3 = new Vec3()
    //结束位置
    endPos: Vec3 = new Vec3()
    //运动节点
    moveNode: Node = null
    //开始的随机方向X
    dirtX: number = 0
    //开始的随机方向Y
    ditrY: number = 0
    //开始的移动速度
    startMoveScale: number = 0
    //目标位置的移动速度
    targetMoveScale: number = 0
    //目标位置的方向
    targetDirt: Vec3 = new Vec3()
    //要移动到的点
    movePos: Vec3 = new Vec3()

    originalScale: Vec3 = new Vec3()

    distant: number = 0

    moveTime: number = 0


    start() {
        this.node.setWorldPosition(this.startPos)
        this.dirtX = Math.random() * 2 - 1
        this.ditrY = Math.random() * 2 - 1
        this.startMoveScale = 20
        this.originalScale = this.moveNode.getWorldScale()
        this.distant = Vec3.distance(this.moveNode.getPosition(), this.endPos)

    }

    update(dt) {
        this.startMoveScale -= dt * 10
        this.targetMoveScale += dt * 20
        this.targetDirt = this.endPos.clone().subtract(this.node.getPosition())
        this.movePos = this.node.position.add(new Vec3(this.dirtX, this.ditrY, 0).normalize().multiplyScalar(this.startMoveScale).add(this.targetDirt.normalize().multiplyScalar(this.targetMoveScale)))
        this.node.setPosition(this.movePos)
        let scale = Vec3.distance(this.node.getPosition(), this.endPos) / this.distant
        if (scale < 0.3) scale = 0.3
        this.node.setWorldScale(this.originalScale.clone().multiplyScalar(scale))
        if (Vec3.distance(this.endPos, this.node.position) <= 20) {
            if (this.callback) {
                this.callback()
            }
            this.node.destroy()
        }
        this.moveTime += dt
        if (this.moveTime > 3.5) {
            if (this.callback) {
                this.callback()
            }
            this.node.destroy()
        }
    }

    init(node: Node, startPos: Vec3, endPos: Vec3, callback) {
        this.moveNode = node
        this.startPos = startPos
        this.endPos = endPos
        this.callback = callback
    }

}
