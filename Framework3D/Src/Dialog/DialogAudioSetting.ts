import BaseDialog from "../Base/BaseDialog";
import AudioManager from "../Base/AudioManager";
import { ToggleComponent, SliderComponent, ProgressBarComponent, LabelComponent, Event } from "cc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogSetting extends BaseDialog {
    @property({ type: ToggleComponent })
    musicToggle: ToggleComponent = null;
    @property({ type: ToggleComponent })
    effectToggle: ToggleComponent = null;
    @property({ type: SliderComponent })
    musicSlider: SliderComponent = null;
    @property({ type: SliderComponent })
    effectSlider: SliderComponent = null;
    @property({ type: ProgressBarComponent })
    musicProgressBar: ProgressBarComponent = null;
    @property({ type: ProgressBarComponent })
    effectProgressBar: ProgressBarComponent = null;
    @property({ type: LabelComponent })
    musicLabel: LabelComponent = null;
    @property({ type: LabelComponent })
    effectLabel: LabelComponent = null;

    start() {
        super.start();
        this.loadAudioState();
    }

    loadAudioState() {
        if (this.musicSlider) {
            let musicVolume = AudioManager.getInstance().getMusicVolume();
            this.musicSlider.progress = musicVolume;
            this.setMusicVolume(musicVolume);

            this.musicSlider.node.on(cc.Node.EventType.TOUCH_END, this.onMusicSliderTouchEnd, this)
            this.musicSlider.handle.node.on(cc.Node.EventType.TOUCH_END, this.onMusicSliderTouchEnd, this)
            this.musicSlider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMusicSliderTouchEnd, this)
            this.musicSlider.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMusicSliderTouchEnd, this)
        }
        if (this.effectSlider) {
            let effectVolume = AudioManager.getInstance().getEffectVolume();
            this.effectSlider.progress = effectVolume;
            this.setEffectVolume(effectVolume);
            
            this.effectSlider.node.on(cc.Node.EventType.TOUCH_END, this.onEffectSliderTouchEnd, this)
            this.effectSlider.handle.node.on(cc.Node.EventType.TOUCH_END, this.onEffectSliderTouchEnd, this)
            this.effectSlider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onEffectSliderTouchEnd, this)
            this.effectSlider.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onEffectSliderTouchEnd, this)
        }
        this.setMusicState(AudioManager.getInstance().getMusicState());
        this.setEffectState(AudioManager.getInstance().getEffectState());
    }

    onMusicSliderTouchEnd(event:Event) {
        AudioManager.getInstance().setMusicVolume(this.musicSlider.progress);
    }

    onEffectSliderTouchEnd(event:Event) {
        AudioManager.getInstance().setEffectVolume(this.effectSlider.progress);
    }

    resolveVolume(volume: number): number {
        if (volume <= 0) {
            volume = 0;
        }
        if (volume > 1) {
            volume = 1;
        }
        return volume;
    }

    setMusicState(isOpen: boolean) {
        if (this.musicToggle) {
            if (isOpen) {
                this.musicToggle.check();
            } else {
                this.musicToggle.uncheck();
            }
        }
    }

    setEffectState(isOpen: boolean) {
        if (this.effectToggle) {
            if (isOpen) {
                this.effectToggle.check();
            } else {
                this.effectToggle.uncheck();
            }
        }
    }

    setMusicVolume(volume: number) {
        volume = this.resolveVolume(volume);
        if (this.musicProgressBar) {
            this.musicProgressBar.progress = volume;
        }
        if (this.musicLabel) {
            this.musicLabel.string = (volume * 100).toFixed(1) + '%';
        }
    }

    setEffectVolume(volume: number) {
        volume = this.resolveVolume(volume);
        if (this.effectProgressBar) {
            this.effectProgressBar.progress = volume;
        }
        if (this.effectLabel) {
            this.effectLabel.string = (volume * 100).toFixed(1) + '%';
        }
    }

    toggleMusic(toggle: ToggleComponent) {
        cc.log('音乐 ', toggle.isChecked ? '开' : '关');
        AudioManager.getInstance().setMusicState(toggle.isChecked);
    }

    toggleEffect(toggle: ToggleComponent) {
        cc.log('音效 ', toggle.isChecked ? '开' : '关');
        AudioManager.getInstance().setEffectState(toggle.isChecked);
    }

    onMusicSliderChange(slider: SliderComponent) {
        this.setMusicVolume(slider.progress);
    }

    onEffectSliderChange(slider: SliderComponent) {
        this.setEffectVolume(slider.progress);
    }
}
