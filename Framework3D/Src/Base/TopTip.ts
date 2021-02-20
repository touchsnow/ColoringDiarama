import { _decorator, LabelComponent, tween, Color, Component, UIOpacityComponent, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export default class TopTip extends Component {
    @property({
        type: LabelComponent,
    })
    topTipsLabel: LabelComponent = null;

    private _data: string = null;

    private tween: Tween = null

    start() {
        let tips = this._data;
        if (typeof (tips) == 'string' && tips != '') {
            this.node.active = true;
            this.topTipsLabel.string = tips;
            this.tween = tween(this.node.getComponent(UIOpacityComponent))
                .to(0.1, { opacity: 255 })
                .delay(1.2)
                .to(0.1, { opacity: 0 })
                .call(() => {
                    this.node.removeFromParent()
                }).start();
        } else {
            this.node.removeFromParent();
        }
    }

    setData(tips: string, color: Color = Color.WHITE) {
        this._data = tips;
        this.topTipsLabel.color = color;
    }

    onDestroy() {
        this.tween.stop()
    }
}
