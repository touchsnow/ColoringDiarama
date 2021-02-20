import { _decorator, Component, Node, Vec2, PhysicsSystem, PhysicsRayResult, CameraComponent, loader, Prefab } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import { BasePuzzleGameScene } from '../../../FrameworkModelPuzzle/Scene/BasePuzzleGameScene';
import { AdManager } from '../AD/AdManager';
import { ConfigManager } from '../Managers/ConfigManager';
import { GameMgr } from '../Managers/GameMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends BasePuzzleGameScene {

    @property(GameMgr)
    gameMgr: GameMgr = null

    start() {
        super.start()
        loader.loadRes("DelayLoader/StarParticle", Prefab, () => { })
        loader.loadRes("DelayLoader/Bomb", Prefab, () => { })
        let levelName = ConfigManager.getInstance().currentLevel.levelName
        let levelInfo = StorgeMgr.getInstance().getLevelInfo(levelName)
        levelInfo.played = true
        StorgeMgr.getInstance().setLevelInfo(levelName, levelInfo)
        StorgeMgr.getInstance().lastLevel = levelName
        StorgeMgr.getInstance().update()
        //ASCAd.getInstance().hideBanner()
        AdManager.getInstance().hideBanner()
        AdManager.getInstance().showBanner()
        if (PlatformManager.getInstance().isVivo()) {
            ASCAd.getInstance().hideNativeIcon()
            if (ASCAd.getInstance().getNativeIconFlag()) {
                ASCAd.getInstance().showNativeIcon(128, 128, (cc.winSize.width - 128) / 2 - 35 * cc.winSize.width / 1080, (cc.winSize.height - 128) / 2 - 450 * cc.winSize.height / 1920)
            }
        }
    }

    onTouchStart(e) {
        this.gameMgr.screenTouchStart(e)
    }

    onTouchMove(e) {
        this.gameMgr.screenTouchMove(e)
    }

    onTouchEnd(e) {
        this.gameMgr.screenTouchEnd(e)
    }

    setCameraDistant(dis: number) {
        this.gameMgr.cameraMgr.setCameraDisByTouch(dis)
    }

}
