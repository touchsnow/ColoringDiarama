import { _decorator, Component, Node, SpriteComponent, UIOpacityComponent, tween, loader, LabelComponent, Prefab } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { ConfigManager } from '../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('BackGroundUI')
export class BackGroundUI extends Component {

    @property(SpriteComponent)
    normalBg: SpriteComponent = null

    @property(SpriteComponent)
    specialBg: SpriteComponent = null

    @property(SpriteComponent)
    starSkillBg:SpriteComponent = null

    @property(Node)
    particle: Node = null

    @property(Node)
    starParticel:Node = null

    @property(LabelComponent)
    countDownLabel:LabelComponent = null

    @property(Node)
    bombCount:Node = null
    
    @property(LabelComponent)
    bombCountLabel:LabelComponent = null

    start() {
        let level = ConfigManager.getInstance().currentLevel
        this.specialBg.spriteFrame = loader.getRes(level.specialBg)
    }

    playSwitchBgAnim(callBack = null) {
        let normalComt = this.normalBg.getComponent(UIOpacityComponent)
        tween(normalComt)
            .to(1.5, { opacity: 0 }, { easing: "circOut" })
            .call(() => {
                if (normalComt.node) normalComt.node.active = false
            }).start()
        let specialComt = this.specialBg.getComponent(UIOpacityComponent)
        tween(specialComt)
            .delay(1)
            .call(() => {
                specialComt.opacity = 0
                specialComt.node.active = true
                this.particle.active = true
                AudioManager.getInstance().playEffectByPath("ChangeBg")
            })
            .to(3.5, { opacity: 255 })
            .call(() => {
                //this.particle.active = false
                if (callBack) callBack()
            })
            .start()
    }
}
