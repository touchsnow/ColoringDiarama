import { _decorator, Component, Node, instantiate, loader } from 'cc';
import { MainSceneBasePage } from '../../../../FrameworkModelPuzzle/MainSceneBasePage';
import { ConfigManager } from '../../../Game/Managers/ConfigManager';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { SkewLayout } from '../../../Game/Uitls/SkewLayout';
import { LevelItem } from './Item/LevelItem';
const { ccclass, property } = _decorator;

@ccclass('CollectPage')
export class CollectPage extends MainSceneBasePage {

    @property(Node)
    content: Node = null

    start() {
        this.initItem()
        this.node.active = false
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
        for (let itemName of mainList) {
            let gameInfo = StorgeMgr.getInstance().getLevelInfo(itemName)
            if (gameInfo.played) {
                let level = ConfigManager.getInstance().getLevel(itemName)
                let item = instantiate(loader.getRes("UI/LevelItem")) as Node
                item.setParent(this.content)
                item.getComponent(LevelItem).init(level)
            }
        }
        this.content.getComponent(SkewLayout).init()
    }
}
