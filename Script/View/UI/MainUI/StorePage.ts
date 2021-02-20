import { _decorator, Component, Node, LabelComponent, labelAssembler, UIOpacityComponent } from 'cc';
import PlatformManager from '../../../../Framework3D/Src/Base/PlatformManager';
import { MainSceneBasePage } from '../../../../FrameworkModelPuzzle/MainSceneBasePage';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { CustomBannerAd } from '../../Other/CustomBannerAd';
const { ccclass, property } = _decorator;

@ccclass('StorePage')
export class StorePage extends MainSceneBasePage {

    @property(LabelComponent)
    bombLabel: LabelComponent = null

    @property(LabelComponent)
    gemLabel: LabelComponent = null

    @property(LabelComponent)
    energyLabel: LabelComponent = null

    @property(LabelComponent)
    starLabel: LabelComponent = null

    @property(Node)
    customAd: Node = null

    start() {
        this.updateDisPlay()
        this.scheduleOnce(() => {
            this.node.active = false
            this.node.getComponent(UIOpacityComponent).opacity = 255
        }, 0)

        if (PlatformManager.getInstance().isVivo()) {
            this.customAd.active = true
        }else{
            this.customAd.active = false
        }
    }

    setDisAble() {
        this.node.active = false
        this.selfButton.getChildByName('Sellect').active = false
        this.selfButton.getChildByName('Icon').active = true
    }

    setEnAble() {
        this.updateDisPlay()
        this.hideTip()
        this.node.active = true
        this.selfButton.getChildByName('Sellect').active = true
        this.selfButton.getChildByName('Icon').active = false
    }

    updateDisPlay() {
        this.bombLabel.string = StorgeMgr.getInstance().bombCount.toString()
        this.gemLabel.string = StorgeMgr.getInstance().gem.toString()
        this.energyLabel.string = StorgeMgr.getInstance().energy.toString()
        this.starLabel.string = (StorgeMgr.getInstance().skillStarProgress / 3).toFixed(0) + "%"
    }

    showTip() {
        this.selfButton.getChildByName("Tip").active = true
    }

    hideTip() {
        this.selfButton.getChildByName("Tip").active = false

    }

}
