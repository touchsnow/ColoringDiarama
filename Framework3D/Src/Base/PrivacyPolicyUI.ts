import { Component, Node, _decorator } from "cc";

/**华为隐私协议界面 */
const { ccclass, property } = _decorator;

@ccclass
export default class PrivacyPolicyUI extends Component {
    _callBack: any = null;//回调
    onLoad() { }

    @property(Node)
    cancleButton: Node = null

    @property(Node)
    comfirmButton: Node = null

    start() {

    }
    initUI(callBack) {
        this._callBack = callBack;
        // let bg = this.node.getChildByName("Bg");
        // let btnLayout = bg.getChildByName("BtnLayout");
        // let cannelBtn = btnLayout.getChildByName("CannelBtn");
        // let sureBtn = btnLayout.getChildByName("SureBtn");
        this.cancleButton.on(Node.EventType.TOUCH_END, this.onCancleButton, this);
        this.comfirmButton.on(Node.EventType.TOUCH_END, this.onConfirmButton, this);
    }
    // onTouchBtn(event){
    //     if(event.target.name == "CannelBtn"){
    //         if(this._callBack){
    //             this._callBack(false);
    //         }
    //         /**
    //          * 退出当前快游戏
    //          */
    //         hbs.exitApplication({
    //             success : function () {
    //                     console.log("exitApplication success" );
    //             },
    //             fail:function(){
    //                     console.log("exitApplication fail");
    //             },
    //             complete:function() {
    //                     console.log("exitApplication complete");
    //             }
    //         });
    //     }else if(event.target.name == "SureBtn"){
    //         if(this._callBack){
    //             this._callBack(true);
    //         }
    //     }
    //     this.node.destroy();
    // }
    // update (dt) {}

    onCancleButton() {
        if (this._callBack) {
            this._callBack(false);
        }
        /**
         * 退出当前快游戏
         */
        hbs.exitApplication({
            success: function () {
                console.log("exitApplication success");
            },
            fail: function () {
                console.log("exitApplication fail");
            },
            complete: function () {
                console.log("exitApplication complete");
            }
        });
    }

    onConfirmButton() {
        if (this._callBack) {
            this._callBack(true);
        }
        this.node.active = false
    }
}
