import { _decorator, Component, Node, LabelComponent } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('EnergyInsufficientDialog')
export class EnergyInsufficientDialog extends BasePuzzleDialog {

    @property(LabelComponent)
    neededCount: LabelComponent = null

    @property(Node)
    unLockButton: Node = null

    @property(Node)
    acceptButton: Node = null

    @property(Node)
    backButton: Node = null

    private unlockCallback = null
    private acceptCallback = null

    start() {
        super.start()
        this.unlockCallback = this._data.unlockCallback
        this.acceptCallback = this._data.acceptCallback
        this.neededCount.string = this._data.neededCount
        this.unLockButton.on(Node.EventType.TOUCH_END, this.onUnlockButton, this)
        this.acceptButton.on(Node.EventType.TOUCH_END, this.onaAcceptButton, this)
        this.backButton.on(Node.EventType.TOUCH_END, this.onBackButton, this)
    }

    onUnlockButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                this.onTouchClose(null, null)
                if (this.unlockCallback) this.unlockCallback()
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

    onaAcceptButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                this.onTouchClose(null, null)
                StorgeMgr.getInstance().energy += 100
                StorgeMgr.getInstance().update()
                if (this.acceptCallback) this.acceptCallback()
                let data = {
                    label: "100"
                }
                DialogManager.getInstance().showDlg("EnergyDialog", data)
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

    onBackButton() {
        this.onTouchClose(null, null)
    }

}
