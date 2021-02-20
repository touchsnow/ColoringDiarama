import { _decorator, Component, Node, Vec2, instantiate, loader } from 'cc';
import ASCAd from '../../../../Framework3D/Src/AD/ASCAd';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import { MainSceneBasePage } from '../../../../FrameworkModelPuzzle/MainSceneBasePage';
import { ConfigManager } from '../../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { SkewLayout } from '../../../Game/Uitls/SkewLayout';
import { LevelItem } from './Item/LevelItem';
import { SubLevelPageBase } from './SubLevelPage/SubLevelPageBase';
const { ccclass, property } = _decorator;

@ccclass('LevelPage')
export class LevelPage extends MainSceneBasePage {

    @property(Node)
    tomorrowGift: Node = null

    @property(Node)
    content: Node = null

    private currentPage: SubLevelPageBase = null

    start() {

        this.initItem()
        this.scheduleOnce(() => {
            ASCAd.getInstance().getIntersFlag() && ASCAd.getInstance().showInters();
        }, 0.5)

        

    }

    setDisAble() {
        this.node.active = false
        this.selfButton.getChildByName('Sellect').active = false
        this.selfButton.getChildByName('Icon').active = true
    }

    setEnAble() {
        this.node.active = true
        this.selfButton.getChildByName('Sellect').active = true
        this.selfButton.getChildByName('Icon').active = false
    }

    initItem() {
        let mainList = ConfigManager.getInstance().mianConfig.json["MainList"]
        let lastLevel = StorgeMgr.getInstance().lastLevel
        //  console.log(lastLevel)
        let level = ConfigManager.getInstance().getLevel(lastLevel)
        //  console.log(level)
        let item = instantiate(loader.getRes("UI/LevelItem")) as Node
        item.setParent(this.content)
        item.getComponent(LevelItem).init(level)
        item.getComponent(LevelItem).sellectFrame.active = true
        for (let itemName of mainList) {
            let gameInfo = StorgeMgr.getInstance().getLevelInfo(itemName)
            if (!gameInfo.played) {
                if (itemName == lastLevel) continue
                let level = ConfigManager.getInstance().getLevel(itemName)
                let item = instantiate(loader.getRes("UI/LevelItem")) as Node
                item.setParent(this.content)
                item.getComponent(LevelItem).init(level)
            }
        }
        this.content.getComponent(SkewLayout).init()
    }



}
