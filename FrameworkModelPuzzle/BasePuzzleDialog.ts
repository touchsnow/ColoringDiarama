import { _decorator, Component, Node, Enum, Tween, UIOpacityComponent } from 'cc';
import ASCAd from '../Framework3D/Src/AD/ASCAd';
import BaseDialog from '../Framework3D/Src/Base/BaseDialog';
import UIUtility from '../Framework3D/Src/Base/UIUtility';
import { AdManager } from '../Script/Game/AD/AdManager';
const { ccclass, property } = _decorator;

enum InAnimationType {
    NONE,
    FADE_IN,
    SLIDE_IN,
    SHAKE_IN,
}

enum OutAnimationType {
    NONE,
    FADE_OUT,
    SLIDE_OUT,
    SHAKE_OUT,
}

const InAnimation = Enum(InAnimationType);
const OutAnimation = Enum(OutAnimationType);
@ccclass('BasePuzzleDialog')
export class BasePuzzleDialog extends BaseDialog {

    start() {
        let touchs = [
            { name: 'ButtonClose', callfunc: 'onTouchClose', customEventData: null },
            { name: 'ButtonBack', callfunc: 'onTouchClose', customEventData: null }
        ];
        for (let i = 0; i < touchs.length; i++) {
            const element = touchs[i]
            //@ts-ignore
            UIUtility.getInstance().registerClick(this.node, this.__proto__.__classname__, element.name, element.callfunc, element.customEventData)
        }
        if (this.inAnimation == InAnimation.NONE) {
            return;
        }
        let tween: Tween = null;
        if (this.inAnimation == InAnimation.FADE_IN) {
            let opacityComponent = this.node.getComponent(UIOpacityComponent);
            if (opacityComponent == null) {
                opacityComponent = this.node.addComponent(UIOpacityComponent);
            }
            opacityComponent.opacity = 0;
            tween = new Tween(opacityComponent);
            tween
                .to(this.showAnimationTime, { opacity: 255 })
                .call(() => {
                    opacityComponent.opacity = 255;
                })
        } else if (this.inAnimation == InAnimation.SLIDE_IN) {
            cc.warn('还没有实现SLIDE IN动！！！');
        } else if (this.inAnimation == InAnimation.SHAKE_IN) {
            tween = new Tween(this.node);
            tween
                .to(this.showAnimationTime / 2, { scale: cc.v3(1.1, 1.1, 1.1) }, { easing: "circOut" })
                .to(this.showAnimationTime / 2, { scale: cc.v3(1, 1, 1) }, { easing: "circOut" })
        }
        tween.start();
    }

    onTouchClose(event: any, data: any, noAction: boolean = false) {
        super.onTouchClose(event, data, noAction)
        AdManager.getInstance().showBanner()
    }

}
