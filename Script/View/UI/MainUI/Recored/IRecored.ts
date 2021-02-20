import { _decorator, Component, Node, LabelComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IRecored')
export class IRecored extends Component {

    @property(LabelComponent)
    label: LabelComponent = null

    start() {}

    updateDisplay(){}

}
