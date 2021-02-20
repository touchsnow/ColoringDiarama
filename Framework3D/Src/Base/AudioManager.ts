import { _decorator, Node, AudioClip, AudioSourceComponent, find, sys } from 'cc';
import UIUtility from './UIUtility';

const { ccclass, property } = _decorator;

const MUSIC_VOLUME_KEY = 'music_volume';
const EFFECT_VOLUME_KEY = 'effect_volume';

@ccclass
export default class AudioManager {
    private static instance: AudioManager;
    private _openMusic: boolean = null;
    private _openEffect: boolean = null;
    private _musicVolume: number = -1;
    private _effectVolume: number = -1;
    private _musicId: number = -1;

    private _lastClip: AudioClip = null;

    private _audioRootPath: string = 'Sound';

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
            AudioManager.instance.init();
        }
        return AudioManager.instance;
    }

    public init(): void {
        // this.getMusicState();
        // this.getEffectState();
        this.getMusicVolume();
        this.getEffectVolume();
    }

    public getMusicId(): number {
        return this._musicId;
    }

    public getMusicState(): boolean {
        if (this._openMusic == null) {
            let openMusicStorage = sys.localStorage.getItem(MUSIC_VOLUME_KEY);
            if (openMusicStorage != null && openMusicStorage != '') {
                this._musicVolume = Number(openMusicStorage);
                this._openMusic = Number(openMusicStorage) > 0
            } else {
                this._musicVolume = 1;
                this._openMusic = true;
                sys.localStorage.setItem(MUSIC_VOLUME_KEY, 1);
            }
        }
        return this._openMusic;
    }

    public getEffectState(): boolean {
        if (this._openEffect == null) {
            let openEffectStorage = sys.localStorage.getItem(EFFECT_VOLUME_KEY);
            if (openEffectStorage != null && openEffectStorage != '') {
                this._effectVolume = Number(openEffectStorage);
                this._openEffect = this._musicVolume > 0;
            } else {
                this._effectVolume = 1;
                this._openEffect = true;
                sys.localStorage.setItem(EFFECT_VOLUME_KEY, 1);
            }
        }
        return this._openEffect;
    }

    setMusicState(isOpen: boolean): void {
        if (this._openMusic != isOpen) {
            this._openMusic = isOpen;
            this._musicVolume = isOpen ? 1 : 0;
            sys.localStorage.setItem(MUSIC_VOLUME_KEY, this._musicVolume);
        }
        let canvas: Node = find('Canvas') as Node;
        if (canvas) {
            canvas.emit('MusicStateChange', isOpen);
        } else {
            console.log(`[AudioManager:setMusicState] 找不到Canvas`);
        }
        if (isOpen) {
            this.resumeMusic();
        } else {
            this.pauseMusic();
        }
    }

    setEffectState(isOpen: boolean): void {
        if (this._openEffect != isOpen) {
            this._openEffect = isOpen;
            this._effectVolume = isOpen ? 1 : 0;
            sys.localStorage.setItem(EFFECT_VOLUME_KEY, this._effectVolume);
        }
        let canvas: Node = find('Canvas') as Node;
        if (canvas) {
            canvas.emit('EffectStateChange', isOpen);
        } else {
            console.log(`[AudioManager:setEffectState] 找不到Canvas`);
        }
    }

    public getMusicVolume(): number {
        if (this._musicVolume == -1) {
            let storage = sys.localStorage.getItem(MUSIC_VOLUME_KEY);
            if (storage != null && storage != '') {
                this._musicVolume = Number(storage);
                this._openMusic = this._musicVolume > 0;
            } else {
                this._musicVolume = 1;
                this._openMusic = true;
                sys.localStorage.setItem(MUSIC_VOLUME_KEY, 1);
            }
        }
        return this._musicVolume;
    }

    public getEffectVolume(): number {
        if (this._effectVolume == -1) {
            let storage = sys.localStorage.getItem(EFFECT_VOLUME_KEY);
            if (storage != null && storage != '') {
                this._effectVolume = Number(storage);
                this._openEffect = this._effectVolume > 0;
            } else {
                this._effectVolume = 1;
                this._openEffect = true;
                sys.localStorage.setItem(EFFECT_VOLUME_KEY, 1);
            }
        }
        return this._effectVolume;
    }

    resolveVolume(volume: number): number {
        if (volume <= 0) {
            volume = 0;
        }
        //音量最大为1，超过的话，部分平台会报错
        if (volume > 1) {
            volume = 1;
        }
        return volume;
    }

    setMusicVolume(volume: number): void {
        volume = this.resolveVolume(volume);
        this._musicVolume = volume;
        sys.localStorage.setItem(MUSIC_VOLUME_KEY, volume);
        //cc.audioEngine.setMusicVolume(volume);
        this.setMusicState(volume > 0);
    }

    setEffectVolume(volume: number): void {
        volume = this.resolveVolume(volume);
        this._effectVolume = volume;
        sys.localStorage.setItem(EFFECT_VOLUME_KEY, volume);
        // cc.audioEngine.setEffectsVolume(volume);
        this.setEffectState(volume > 0);
    }

    resolvePath(path: string) {
        return `${this._audioRootPath}/${path}`;
    }

    playEffectByPath(path: string, loop: boolean = false): void {
        UIUtility.getInstance().loadRes(this.resolvePath(path), AudioClip, null, (error: Error, asset: AudioClip) => {
            if (error) {
                console.log(error);
                return;
            }
            this.playEffect(asset, loop);
        });
    }

    playEffect(clip: AudioClip, loop: boolean = false): AudioClip {
        if (this._openEffect) {
            clip.playOneShot(this.getEffectVolume());
        }
        return clip;
    }

    stopEffect(clip: AudioClip): void {
        return clip.stop();
    }

    getLastMusicClip(): AudioClip {
        return this._lastClip;
    }

    playMusicByPath(path: string, loop: boolean = false): void {
        UIUtility.getInstance().loadRes(this.resolvePath(path), AudioClip, null, (error: Error, asset: AudioClip) => {
            if (error) {
                console.log(error);
                return;
            }
            this.playMusic(asset, loop);
        });
    }

    playMusic(clip: AudioClip, loop: boolean = true): AudioClip {
        if (this._openMusic) {
            if (!this._lastClip) {
                this._lastClip = clip;
                clip.setLoop(loop);
                clip.play();
            } else {
                let _lastClip = this.getLastMusicClip();
                if (_lastClip) {
                    if (_lastClip == clip) {
                        // cc.log('将播放背景音乐与已播放的背景音乐相同');
                        return clip;
                    } else {
                        // cc.log('将播放背景音乐与已播放的背景音乐不同');
                        this._lastClip.stop();
                        this._lastClip = clip;
                        clip.setLoop(loop);
                        clip.play();
                        return clip;
                    }
                } else {
                    // cc.log('未播放过背景音乐, _lastClip is null');
                }
            }
            return this._lastClip;
        }
        return null;
    }

    stopMusic(): void {
        if (!this._lastClip) {
            return;
        }
        this._lastClip.stop();
        this._lastClip = null;
    }

    pauseMusic(): void {
        if (!this._lastClip) {
            return;
        }
        this._lastClip.pause();
    }

    resumeMusic(): void {
        if (!this._lastClip) {
            return;
        }
        this._lastClip.play();
    }
}
