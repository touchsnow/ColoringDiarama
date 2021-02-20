import { _decorator, Node, Component, Enum, UIOpacityComponent, Tween, Vec3 } from 'cc';
import UIUtility from "./UIUtility";
import DialogManager from "./DialogManager";
import AudioManager from "./AudioManager";

const { ccclass, property } = _decorator;

enum InAnimationType {
    NONE,
    FADE_IN,
    SLIDE_IN,
    SHAKE_IN
}

enum OutAnimationType {
    NONE,
    FADE_OUT,
    SHAKE_OUT
}

const InAnimation = Enum(InAnimationType);
const OutAnimation = Enum(OutAnimationType);

@ccclass
export default class BaseDialog extends Component {
    @property({
        type: InAnimation
    })
    inAnimation = InAnimation.NONE;

    @property({
        type: OutAnimation
    })
    outAnimation = OutAnimation.NONE;

    @property
    public showAnimationTime: number = 0.3;

    protected _data: any = null;

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
            console.warn('还没有实现SLIDE IN动！！！');
            // tween = new Tween(this.node);
            // tween
            //     .to(this.showAnimationTime, { position: Vec3.ZERO })
            //     .call(() => {
            //         this.node.setPosition(Vec3.ZERO);
            //     })
        }
        tween.start();
    }

    //初始化数据
    initData(data) {
        this._data = data;
    }

    //点击关闭按钮事件
    onTouchClose(event: any, data: any, noAction: boolean = false) {
        if (event) {
            AudioManager.getInstance().playEffectByPath('sfx_clickButton');
        }
        let tween: Tween = null;
        if (noAction) {
        } else {
            if (this.outAnimation == OutAnimation.FADE_OUT) {
                let opacityComponent = this.node.getComponent(UIOpacityComponent);
                opacityComponent.opacity = 255;
                tween = new Tween(opacityComponent);
                tween
                    .to(this.showAnimationTime, { opacity: 0 })
                    .call(() => {
                        opacityComponent.opacity = 0;
                    });
            }
        }
        //防止多次点击，导致动作变形
        let success = DialogManager.getInstance().hideDlg(this.node.name, tween)
        if (!success) {
            return
        }
    }
}
