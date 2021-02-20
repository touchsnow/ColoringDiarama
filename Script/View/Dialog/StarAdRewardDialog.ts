import { _decorator, Component, Node } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('StarAdRewardDialog')
export class StarAdRewardDialog extends BasePuzzleDialog {
    @property(Node)
    acceptButton: Node = null

    @property(Node)
    cancleButton: Node = null

    private acceptCallback = null
    private cancleCallback = null

    start() {
        super.start()
        this.acceptCallback = this._data.acceptCallback
        this.cancleCallback = this._data.cancleCallback
        this.acceptButton.on(Node.EventType.TOUCH_END, this.onAcceptButton, this)
        this.cancleButton.on(Node.EventType.TOUCH_END, this.onCancleButton, this)
    }

    onAcceptButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                this.onTouchClose(null, false)
                if (this.acceptCallback) this.acceptCallback()
            }
            else {
                UIUtility.getInstance().showTopTips("视频未播放完成！")
            }
            AudioManager.getInstance().resumeMusic()
        }.bind(this)
        if (ASCAd.getInstance().getVideoFlag()) {
            ASCAd.getInstance().showVideo(callback)
            AudioManager.getInstance().pauseMusic()
        }
        else {
            UIUtility.getInstance().showTopTips("视频未加载完成！")
        }
    }

    onCancleButton() {
        this.onTouchClose(null, false)
        if (this.cancleCallback) this.cancleCallback()
    }
}
