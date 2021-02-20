import { _decorator, Component, Node, LabelComponent, SpriteComponent, Tween, tween, loader, SpriteFrame } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import { TimerManager } from '../../Game/Managers/TimerManager';
const { ccclass, property } = _decorator;

@ccclass('ButtomCustomBanner')
export class ButtomCustomBanner extends Component {
    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    titleLabel: LabelComponent = null

    @property(LabelComponent)
    contentlabel: LabelComponent = null

    @property(SpriteComponent)
    icon: SpriteComponent = null

    @property(SpriteComponent)
    bg: SpriteComponent = null

    private adId = null

    //private tween: Tween = null

    private currentRefreshTime: number = 0

    start() {
        for (let element of this.node.children) {
            element.active = false
        }
        // this.tween = tween(this.node)
        //     .call(() => {
        //         if (TimerManager.getInstance.getCurrentGameTime() > 58) {
        //             console.log(TimerManager.getInstance.getCurrentGameTime())
        //             this.refresh()
        //         }
        //     })
        //     .delay(60)
        //     .union()
        //     .repeatForever()
        //     .start()
        if (TimerManager.getInstance.getCurrentGameTime() > 58) {
            this.refresh()
        }
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
    }

    update(dt: number) {
        this.currentRefreshTime += dt
        if (this.currentRefreshTime > 60) {
            this.currentRefreshTime = 0
            this.refresh()
        }
    }

    onCloseButton() {
        let random = Math.random()
        console.log(random)
        if (random < 0.1) {
            if (this.adId) {
                console.log(this.adId)
                ASCAd.getInstance().nativeClick(this.adId);
            }
        } else {
            this.node.active = false
        }
        //this.tween.stop()
    }

    onTouch() {
        console.log("ontouch")
        if (this.adId) {
            console.log(this.adId)
            ASCAd.getInstance().nativeClick(this.adId);
        }
    }

    refresh() {
        console.log("刷新Banner")
        for (let element of this.node.children) {
            element.active = false
        }
        let adInfo = ASCAd.getInstance().getNativeInfo()
        let adid = adInfo.adId
        let adTitle = adInfo.title
        let adDesc = adInfo.desc
        let adNativeIcon = adInfo.Native_icon
        let nativeBigImage = adInfo.Native_BigImage
        this.adId = adid
        if (nativeBigImage == null && adNativeIcon == null) {
            return
        }
        if (nativeBigImage !== null || adNativeIcon !== null) {
            if (nativeBigImage !== null) {
                loader.load({ url: nativeBigImage, tpye: "jpg" }, (err, texture) => {
                    if (err) {
                        this.node.active = false
                        return
                    } else {
                        for (let element of this.node.children) {
                            element.active = true
                        }
                        let sprite = new SpriteFrame()
                        sprite.texture = texture._texture
                        ASCAd.getInstance().reportNative(adid)
                        this.bg.spriteFrame = sprite
                        this.titleLabel.string = adTitle
                        this.contentlabel.string = adDesc
                        this.bg.node.off(Node.EventType.TOUCH_END, this.onTouch, this)
                        this.bg.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
                    }
                })
            }
            if (adNativeIcon !== null) {
                loader.load({ url: adNativeIcon, tpye: "jpg" }, (err, texture) => {
                    if (err) {
                        return
                    } else {
                        let sprite = new SpriteFrame()
                        sprite.texture = texture._texture
                        this.icon.spriteFrame = sprite
                    }
                })
            }
        }
    }
}
