import { _decorator, Component, Node, Vec3, Color, ParticleSystemComponent, Vec4 } from 'cc';
import { PaintEffectPool } from '../ObjectPool/PaintEffectPool';
const { ccclass, property } = _decorator;

@ccclass('EffectMgr')
export class EffectMgr extends Component {

    @property(PaintEffectPool)
    paintEffectPool: PaintEffectPool = null

    @property(Node)
    promotyEffect: Node = null

    init() {
        this.paintEffectPool.init()
    }

    playPaintEffect(worldPos: Vec3, scale: number, parent: Node, color: Vec4) {
        let paintEffectNode = this.paintEffectPool.get() as Node
        paintEffectNode.setParent(parent)
        paintEffectNode.setWorldPosition(worldPos)
        scale *= 5
        paintEffectNode.setWorldScale(scale, scale, scale)
        let paintEffect1 = paintEffectNode.children[0].getComponent(ParticleSystemComponent)
        paintEffect1.startColor.color = new Color(color.x * 255, color.y * 255, color.z * 255, color.w * 255)
        paintEffectNode.children.forEach(element => {
            element.getComponent(ParticleSystemComponent).play()
        })
        this.scheduleOnce(() => {
            this.paintEffectPool.putIn(paintEffectNode)
        }, 3)
    }

    playPromotyEffect(wpos: Vec3, parent: Node, sacle: number) {
        this.promotyEffect.active = true
        // this.promotyEffect.getComponent(ParticleSystemComponent).stop()
        // this.promotyEffect.getComponent(ParticleSystemComponent).play()
        this.promotyEffect.setParent(parent)
        this.promotyEffect.setWorldPosition(wpos)
        this.promotyEffect.setWorldScale(sacle, sacle, sacle)
    }

    stopPromotEffect(){
        //this.promotyEffect.getComponent(ParticleSystemComponent).stop()
        this.promotyEffect.active = false
        this.promotyEffect.setParent(this.node)
    }
}
