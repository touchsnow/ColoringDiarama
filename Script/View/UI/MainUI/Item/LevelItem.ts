import { _decorator, Component, Node, LabelComponent, tween, UIOpacityComponent, Vec2, SpriteComponent, loader, Tween, ContainerStrategy, find, Asset } from 'cc';
import AudioManager from '../../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../../../Framework3D/Src/Base/UIUtility';
import { LevelInfo } from '../../../../Data/LevelInfo';
import { ConfigManager } from '../../../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

enum TouchState {
    NONE,
    MOVE
}

@ccclass('LevelItem')
export class LevelItem extends Component {

    private touchState: TouchState = TouchState.NONE

    @property(Node)
    levelSpriteBlank: Node = null

    @property(Node)
    levelSprite: Node = null

    @property(Node)
    sellectFrame: Node = null

    @property(LabelComponent)
    levelLabel: LabelComponent = null

    @property(Node)
    stars: Node = null

    @property(Node)
    finishSprite: Node = null

    @property(Node)
    lockSprite: Node = null

    @property(SpriteComponent)
    unFinishFrame: SpriteComponent = null

    public level: LevelInfo = null

    private tweenList: Tween[] = []

    start() {
        // this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    init(level: LevelInfo) {
        this.level = level
        //  console.log(this.level)
        this.levelSprite.getComponent(SpriteComponent).spriteFrame = loader.getRes(level.spritePath)
        this.levelSpriteBlank.getComponent(SpriteComponent).spriteFrame = loader.getRes(level.spritePath)
        this.stars.children[level.star - 1].active = true
        this.levelLabel.string = level.cnName
        let storgeInfo = StorgeMgr.getInstance().getLevelInfo(level.levelName)
        if (storgeInfo.finished) {
            this.levelSpriteBlank.active = false
            this.unFinishFrame.node.active = false
            this.finishSprite.active = true
        }
        else if (storgeInfo.played) {
            this.levelSpriteBlank.active = false
        }
        else {
            if (StorgeMgr.getInstance().playerLevel < this.level.star) {
                this.lockSprite.active = true
            }
            this.levelSprite.active = false
        }
    }

    playTouchAnim() {
        // this.levelSprite.getComponent(UIOpacityComponent).opacity = 0
        // this.levelSpriteBlank.getComponent(UIOpacityComponent).opacity = 255
        // tween(this.levelSprite.getComponent(UIOpacityComponent)).repeatForever(
        //     tween(this.levelSprite.getComponent(UIOpacityComponent))
        //         .to(2, { opacity: 255 })
        //         .to(2, { opacity: 0 })
        //         .start()
        // ).start()
        // tween(this.levelSpriteBlank.getComponent(UIOpacityComponent)).repeatForever(
        //     tween(this.levelSpriteBlank.getComponent(UIOpacityComponent))
        //         .to(1, { opacity: 0 })
        //         .to(1, { opacity: 255 })
        //         .start()
        // ).start()
    }

    // onTouchStart() {
    //     this.touchState = TouchState.NONE
    // }

    // onTouchMove(e) {
    //     let v2_2: Vec2 = new Vec2()
    //     e.getDelta(v2_2)
    //     if (Math.abs(v2_2.x) > 4 || Math.abs(v2_2.y) > 4) {
    //         this.touchState = TouchState.MOVE
    //     }
    // }

    onTouchEnd(e) {
        AudioManager.getInstance().playEffectByPath("Click01")
        this.sellectFrame.active = true
        let gameInfo = StorgeMgr.getInstance().getLevelInfo(this.level.levelName)
        if (gameInfo.played) {
            ConfigManager.getInstance().setCurrentLevel(this.level.levelName)
            find("Canvas/Loading").active = true
            let resArray = [this.level.modelPath]
            let effectPath = ConfigManager.getInstance().currentLevel.effectPath
            if (effectPath !== "") {
                resArray.push(effectPath)
            }
            loader.loadResArray(resArray, Asset, () => {
                UIUtility.getInstance().loadScene("GameScene")
            })
        } else {
            let data = {
                levelInfo: this.level
            }
            DialogManager.getInstance().showDlg("LevelUnlcokTipDialog", data)
        }
    }

    onDestroy() {
        for (let i of this.tweenList) {
            i.stop()
        }
    }
}
