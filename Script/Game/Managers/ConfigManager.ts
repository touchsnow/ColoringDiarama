import { _decorator, Component, Node } from 'cc';
import { LevelInfo } from '../../Data/LevelInfo';
const { ccclass, property } = _decorator;

@ccclass('ConfigManager')
export class ConfigManager {

    private static configManager: ConfigManager
    public static getInstance(): ConfigManager {
        if (this.configManager == null) {
            this.configManager = new ConfigManager()
        }
        return ConfigManager.configManager
    }

    private mainConfigPath: string = "Config/MainConfig"

    private levelConfigpath: string = "Config/LevelConfig"

    public mianConfig: any = null

    public levelConfig: any = null

    public currentLevel: LevelInfo = new LevelInfo()

    init() {
        cc.loader.loadRes(this.mainConfigPath, (err, jsonAsset) => {
            this.mianConfig = jsonAsset
        })
        cc.loader.loadRes(this.levelConfigpath, (err, jsonAsset) => {
            this.levelConfig = jsonAsset
        })
    }

    getLevel(levelName: string) {
        return this.levelConfig.json[levelName]
    }

    setCurrentLevel(levelName: string) {
        Object.assign(this.currentLevel, this.levelConfig.json[levelName]);
    }
}
