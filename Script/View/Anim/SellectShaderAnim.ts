import { _decorator, Component, Node, ModelComponent, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SellectShaderAnim')
export class SellectShaderAnim extends Component {

    private originalMat = null

    public sellectMat = null

    public model: ModelComponent = null

    public lineScale: number = 0

    private time: number = 0

    start() {
        this.originalMat = this.model.getMaterial(0)
        this.model.setMaterial(this.sellectMat, 0)
        this.model.material.setProperty("outlineParams",cc.v4(this.lineScale,0,0,0))
    }

    update(dt) {
        this.time += dt * 4
        this.model.material.setProperty("Timer", this.time)
        if (this.time >= 3) {
            this.destroy()
        }
    }

    init(model: ModelComponent, sellectMat: Material, lineScale) {
        this.model = model
        this.sellectMat = sellectMat
        this.lineScale = lineScale
    }

    destroy(){
        this.model.setMaterial(this.originalMat, 0)
        super.destroy()
    }

}
