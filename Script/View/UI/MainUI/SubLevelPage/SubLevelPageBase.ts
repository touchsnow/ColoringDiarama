import { _decorator, Component, Node, Vec2, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SubLevelPageBase')
export class SubLevelPageBase extends Component {

    protected v2_2: Vec2 = new Vec2()

    protected moveDis: number = null

    @property(Vec3)
    originalPos: Vec3 = new Vec3()

    @property(Node)
    selfButton:Node = null

    start() { }

    onTouchStart(e) {
        this.moveDis = 0
    }

    onTouchMove(e) {
        e.getDelta(this.v2_2)
        this.moveDis += this.v2_2.x
        this.node.parent.setPosition(
            this.node.parent.position.x + this.v2_2.x * 2.5,
            this.node.parent.position.y,
            this.node.parent.position.z
        )
    }

    onTouchEnd(e) { }

    recoverPos() {
        tween(this.node.parent)
            .to(0.3, { position: this.originalPos })
            .start()
    }

    init(){
        this.recoverPos()
    }

    release(){
        
    }

}
