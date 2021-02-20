import { _decorator, Component, Node, tween, SpriteComponent, director, loader, Asset } from 'cc';
import BaseLoadingScene, { DirAsset } from '../../../Framework3D/Src/Base/BaseLoadingScene';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { ConfigManager } from '../Managers/ConfigManager';
import { SignMgr } from '../Managers/SignMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends BaseLoadingScene {

    @property(SpriteComponent)
    spriteProgress: SpriteComponent = null

    start() {
        ConfigManager.getInstance().init()
        SignMgr.getInstance().init()
        super.start()
        if (!StorgeMgr.getInstance().firstOpenGame) {
            director.preloadScene("MainScene")
        } else {
            let resArray = ["Model/00202_CuteHamsterEatingCarrot"]
            loader.loadResArray(resArray, Asset, () => { })
            director.preloadScene("GameScene")
        }
    }

    onLoadResFinished() {
        if (!StorgeMgr.getInstance().firstOpenGame) {
            UIUtility.getInstance().loadScene("MainScene")
        } else {
            StorgeMgr.getInstance().firstOpenGame = false
            StorgeMgr.getInstance().update()
            ConfigManager.getInstance().setCurrentLevel("00202_CuteHamsterEatingCarrot")
            let resArray = ["Model/00202_CuteHamsterEatingCarrot"]
            loader.loadResArray(resArray, Asset, () => {
                UIUtility.getInstance().loadScene("GameScene")
            })
        }
    }

    setProgress(progress) {
        super.setProgress(progress)
        this.spriteProgress.fillRange = progress
    }




}
