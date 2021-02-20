import { _decorator, Component, Node, LabelComponent, Color } from 'cc';
import { LevelPage } from '../LevelPage';
import { SubLevelPageBase } from './SubLevelPageBase';
const { ccclass, property } = _decorator;

@ccclass('PicturePage')
export class PicturePage extends SubLevelPageBase {

    @property(LevelPage)
    levelPage: LevelPage = null
    start() { }

    onTouchStart(e) {
        super.onTouchStart(e)
    }

    onTouchMove(e) {
        super.onTouchMove(e)
    }

    onTouchEnd(e) {
        super.onTouchEnd(e)
        if (this.moveDis > 100) {
            this.levelPage.switchPage(this.levelPage.mianPage)
        }
        else if (this.moveDis < -100) {
            this.recoverPos()
            //this.levelPage.switchPage(this.levelPage.picturePage)
        }
        else {
            this.recoverPos()
        }
    }
    init(){
        super.init()
        this.selfButton.getChildByName("SellectBar").active = true
        this.selfButton.getChildByName("Label").getComponent(LabelComponent).color = new Color(10,161,178,255)
    }

    release(){
        super.release()
        this.selfButton.getChildByName("SellectBar").active = false
        this.selfButton.getChildByName("Label").getComponent(LabelComponent).color = new Color(0,0,0,255)
    }

}
