import { _decorator, Component, Node, Tween, tween } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SkillBomb')
export class SkillBomb extends Component {

    @property(Node)
    boomParticle: Node = null

    @property(Node)
    bomb: Node = null


    // @property(Node)
    // bombWave:Node = null

    // @property(Node)
    // bombSpark:Node = null
    tween: Tween = null

    private callBack = null

    init(callBakc) {
        this.callBack = callBakc

    }

    start() {
        this.tween = tween(this.node).repeatForever(tween(this.node)
            .call(() => {
                if (this.node) {
                    AudioManager.getInstance().playEffectByPath("BombCount")
                }
            })
            .delay(0.8)
            .start())
            .start()

        this.scheduleOnce(() => {
            this.tween.stop()
            AudioManager.getInstance().playEffectByPath("Bomb")
            this.boomParticle.active = true
            this.boomParticle.setWorldRotationFromEuler(177,26,0)
            this.bomb.active = false
            if (this.callBack) this.callBack()
            this.scheduleOnce(() => {
                this.node.destroy()
            }, 1)
        }, 4)
    }
}
