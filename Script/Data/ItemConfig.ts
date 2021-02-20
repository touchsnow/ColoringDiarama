import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('ConfigInfo')
export class ConfigInfo {
    itemLevel = {
        1: { cost: 2, itemColor: cc.color(180, 180, 180, 255) },
        2: { cost: 5, itemColor: cc.color(120, 120, 120, 255) },
        3: { cost: 10, itemColor: cc.color(0, 143, 255, 255) },
        4: { cost: 15, itemColor: cc.color(218, 218, 0, 255) },
        5: { cost: 20, itemColor: cc.color(255, 137, 8, 255) },
    }
    specialItemLevel = {
        1: { cost: 2, itemColor: cc.color(167, 0, 291, 255) },
        2: { cost: 5, itemColor: cc.color(167, 0, 291, 255) },
        3: { cost: 10, itemColor: cc.color(167, 0, 291, 255) },
        4: { cost: 15, itemColor: cc.color(167, 0, 291, 255) },
        5: { cost: 20, itemColor: cc.color(167, 0, 291, 255) },
    }
    levelLimit = {
        1: { max: 30, min: 0 },
        2: { max: 100, min: 30 },
        3: { max: 500, min: 100 },
        4: { max: 1000, min: 500 },
        5: { max: 1000000, min: 1000 }
    }
}

@ccclass('ItemConfig')
export class ItemConfig {

    public static itemConfig = new ConfigInfo()
    public static getItemConfig(trangleConut: number) {
        let levelLimit = ItemConfig.itemConfig.levelLimit
        let levelConfig = ItemConfig.itemConfig.itemLevel
        if (trangleConut >= levelLimit[1].min && trangleConut < levelLimit[1].max) {
            return levelConfig[1]
        }
        if (trangleConut >= levelLimit[2].min && trangleConut < levelLimit[2].max) {
            return levelConfig[2]
        }
        if (trangleConut >= levelLimit[3].min && trangleConut < levelLimit[3].max) {
            return levelConfig[3]
        }
        if (trangleConut >= levelLimit[4].min && trangleConut < levelLimit[4].max) {
            return levelConfig[4]
        }
        if (trangleConut >= levelLimit[5].min && trangleConut < levelLimit[5].max) {
            return levelConfig[5]
        }
    }

    public static getSpecialItemConfig(trangleConut: number) {
        let levelLimit = ItemConfig.itemConfig.levelLimit
        let levelConfig = ItemConfig.itemConfig.specialItemLevel
        if (trangleConut >= levelLimit[1].min && trangleConut < levelLimit[1].max) {
            return levelConfig[1]
        }
        if (trangleConut >= levelLimit[2].min && trangleConut < levelLimit[2].max) {
            return levelConfig[2]
        }
        if (trangleConut >= levelLimit[3].min && trangleConut < levelLimit[3].max) {
            return levelConfig[3]
        }
        if (trangleConut >= levelLimit[4].min && trangleConut < levelLimit[4].max) {
            return levelConfig[4]
        }
        if (trangleConut >= levelLimit[5].min && trangleConut < levelLimit[5].max) {
            return levelConfig[5]
        }
    }
}
