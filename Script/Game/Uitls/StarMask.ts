import { _decorator, Component, Node, MaskComponent } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('StarMask')
@executeInEditMode
export class StarMask extends Component {

    start() {
        this.drawArc();
    }

    drawArc() {
        const mask = this.getComponent(MaskComponent);
        const g = mask.graphics;
        g.clear();
        g.lineWidth = 10;
        g.fillColor.fromHEX('#ff0000');
        g.moveTo(-30, -48);
        g.lineTo(-25, -14);
        g.lineTo(-48, 8);
        g.lineTo(-15, 16);
        g.lineTo(0, 45);
        g.lineTo(14, 15);
        g.lineTo(48, 10);
        g.lineTo(26, -13);
        g.lineTo(30, -47);
        g.lineTo(0, -32);
        g.close();
        g.stroke();
        g.fill();
    }
}
