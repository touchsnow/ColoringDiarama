import { _decorator, Component, Node } from 'cc';
import { MainSceneBasePage } from '../../../../FrameworkModelPuzzle/MainSceneBasePage';
import { IAchieveItem } from './AchieveItem/IAchieveItem';
const { ccclass, property } = _decorator;

@ccclass('AchievePage')
export class AchievePage extends MainSceneBasePage {

    @property([IAchieveItem])
    itemList: IAchieveItem[] = []

    start() {
        this.node.active = false
    }

    setDisAble() {
        this.node.active = false
        this.selfButton.getChildByName('Sellect').active = false
        this.selfButton.getChildByName('Icon').active = true
    }
    setEnAble() {
        for (let item of this.itemList) {
            item.updateDisplay()
        }
        this.node.active = true
        this.selfButton.getChildByName('Sellect').active = true
        this.selfButton.getChildByName('Icon').active = false
    }

}
