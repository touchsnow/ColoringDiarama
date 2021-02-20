import { _decorator, Component, Node, Vec3, tween, LabelComponent, Color, instantiate, loader } from 'cc';
import { LevelInfo } from '../../../../Data/LevelInfo';
import { SkewLayout } from '../../../../Game/Uitls/SkewLayout';
import { LevelItem } from '../Item/LevelItem';
import { LevelPage } from '../LevelPage';
import { SubLevelPageBase } from './SubLevelPageBase';
const { ccclass, property } = _decorator;

enum TouchState {
    NONE,
    VERTICALMOVE,
    HORIZONTALMOVE,
}

@ccclass('MainPage')
export class MainPage extends SubLevelPageBase {

    @property(LevelPage)
    levelPage: LevelPage = null

    @property(Node)
    contont: Node = null

    private touchState: TouchState = TouchState.NONE

    start() { }

    onTouchStart(e) {
        super.onTouchStart(e)
        this.touchState = TouchState.NONE
    }

    onTouchMove(e) {
        e.getDelta(this.v2_2)
        if (this.touchState == TouchState.NONE) {
            if (Math.abs(this.v2_2.y) > 4) {
                this.touchState = TouchState.VERTICALMOVE
            }
            else if (Math.abs(this.v2_2.x) > 4) {
                this.touchState = TouchState.HORIZONTALMOVE
            }
        }

        if (this.touchState == TouchState.VERTICALMOVE) {
            if (cc.view.getVisibleSize().height < this.contont.getComponent(SkewLayout).contentSize) {
                this.contont.setPosition(
                    this.contont.position.x,
                    this.contont.position.y + this.v2_2.y * 2.5,
                    this.contont.position.z
                )
            }
        }
        if (this.touchState == TouchState.HORIZONTALMOVE) {
            //super.onTouchMove(e)
        }
    }

    onTouchEnd(e) {
        if (this.moveDis > 100) {
            this.levelPage.switchPage(this.levelPage.myWorkPage)
        }
        else if (this.moveDis < -100) {
            this.levelPage.switchPage(this.levelPage.picturePage)
        }
        else {
            this.recoverPos()
        }
        this.checkRecover()
        this.touchState = TouchState.NONE
    }

    checkRecover() {
        if (cc.view.getVisibleSize().height > this.contont.getComponent(SkewLayout).contentSize) {
            return
        }

        let skewCpmt = this.contont.getComponent(SkewLayout)
        if (this.contont.position.y > skewCpmt.maxPosY) {
            tween(this.contont)
                .to(0.5, { position: cc.v3(this.contont.position.x, skewCpmt.maxPosY, this.contont.position.z) })
                .start()
        }
        if (this.contont.position.y < skewCpmt.minPosY) {
            tween(this.contont)
                .to(0.5, { position: cc.v3(this.contont.position.x, skewCpmt.minPosY, this.contont.position.z) })
                .start()
        }
    }

    init() {
        super.init()
        this.selfButton.getChildByName("SellectBar").active = true
        this.selfButton.getChildByName("Label").getComponent(LabelComponent).color = new Color(10, 161, 178, 255)
    }

    release() {
        super.release()
        this.selfButton.getChildByName("SellectBar").active = false
        this.selfButton.getChildByName("Label").getComponent(LabelComponent).color = new Color(0, 0, 0, 255)
    }

    generalItem(level: LevelInfo) {
        let item = instantiate(loader.getRes("UI/LevelItem")) as Node
        item.setParent(this.contont)
        item.getComponent(LevelItem).init(level)
    }
}
