import { _decorator, Component, Node } from 'cc';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
const { ccclass, property } = _decorator;

@ccclass('SettingButton')
export class SettingButton extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        this.node.on(Node.EventType.TOUCH_END,this.onTouchEnd,this)
    }

    onTouchEnd(){
        DialogManager.getInstance().showDlg("SettingDialog")
    }

}
