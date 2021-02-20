import { _decorator, Component, Node, Material, ModelComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ExpandPaintRange')
export class ExpandPaintRange extends Component {

    private mat: Material = null
    private timer: number = 40

    start() {
        this.mat = this.node.getComponent(ModelComponent).material
    }

    update(dt) {
        this.timer -= dt * 100
        if (this.timer <= -10) this.timer = -10
        this.mat.setProperty("paintRange", this.timer / 10)
    }

}
