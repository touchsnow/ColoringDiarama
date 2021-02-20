import { _decorator, Component, Node } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BasePuzzleDialog } from '../../../FrameworkModelPuzzle/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('SettingDialog')
export class SettingDialog extends BasePuzzleDialog {


    @property(Node)
    musicFrame: Node = null

    @property(Node)
    effecFrame: Node = null

    @property(Node)
    musicCheck: Node = null

    @property(Node)
    effectCheck: Node = null

    @property(Node)
    closeButton: Node = null

    start() {
        super.start()
        this.musicFrame.on(Node.EventType.TOUCH_END, this.onMusicFrame, this)
        this.effecFrame.on(Node.EventType.TOUCH_END, this.onEffectFrame, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        this.musicCheck.active = AudioManager.getInstance().getMusicState()
        this.effectCheck.active = AudioManager.getInstance().getEffectState()
    }

    initData(data) {
        super.initData(data)
    }

    onMusicFrame() {
        AudioManager.getInstance().setMusicState(!this.musicCheck.active)
        this.musicCheck.active = !this.musicCheck.active
    }

    onEffectFrame() {
        AudioManager.getInstance().setEffectState(!this.effectCheck.active)
        this.effectCheck.active = !this.effectCheck.active
    }

    onCloseButton() {
        this.onTouchClose(null, false)
    }

}
