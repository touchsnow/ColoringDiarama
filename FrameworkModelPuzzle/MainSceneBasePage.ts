import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainSceneBasePage')
export class MainSceneBasePage extends Component {


    @property({
        type: Node,
        displayName:"控制按钮"
    })
    selfButton:Node = null

    start () { }

    /**设置消失 */
    setDisAble(...args:any){ }

    /**设置显示 */
    setEnAble(...args:any){ }
}
