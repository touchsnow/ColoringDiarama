import { _decorator, Component, Node } from 'cc';
import BaseStorge from '../../../Framework3D/Src/Base/BaseStorge';
import { Constants } from '../../Data/Constants';
import { LevelStorgeInfo } from '../../Data/LevelStorgeInfo';
const { ccclass, property } = _decorator;

@ccclass('StorgeMgr')
export class StorgeMgr extends BaseStorge {

    /**单例模式 */
    private static storgeMgr: StorgeMgr
    public static getInstance(): StorgeMgr {
        if (this.storgeMgr == null) {
            this.storgeMgr = new StorgeMgr().init()
        }
        return StorgeMgr.storgeMgr
    }

    private gameVer: number = 0
    public energy: number = 200
    public gem: number = 0
    public skillStarProgress: number = 0
    public bombCount: number = 2
    public promotyCount: number = 2
    public lastLevel: string = "00202_CuteHamsterEatingCarrot"
    public playerLevel: number = 1.0
    public guidance: boolean = false
    public isVip: boolean = false
    public finishAdCount:number = 0
    public hadSeeAd:number = 0
    public openingState:boolean = false
    public firstOpenGame:boolean = true

    public init(): any {
        //@ts-ignore
        let storgeItem = this.get(this.__proto__.constructor.name);
        if (storgeItem) {
            //@ts-ignore
            Object.assign(this, storgeItem);
            if (this.gameVer !== Constants.GameVer) {
                //@ts-ignore
                this.remove(this.__proto__.constructor.name)
                this.initData()
                //@ts-ignore
                this.set(this.__proto__.constructor.name, this);
            }
        } else {
            //@ts-ignore
            this.set(this.__proto__.constructor.name, this);
        }
        return this;
    }

    initData() {
        this.gameVer = Constants.GameVer
        this.energy = 200
        this.gem = 0
        this.skillStarProgress = 0
        this.bombCount = 2
        this.promotyCount = 2
        this.lastLevel = "00202_CuteHamsterEatingCarrot"
        this.playerLevel = 1.0
        this.guidance = false
        this.isVip = false
        this.finishAdCount = 0
        this.hadSeeAd = 0
        this.openingState = false
        this.firstOpenGame = true
    }

    /**获取关卡信息 */
    getLevelInfo(levelName: string) {
        let key = this.gameVer.toString() + levelName
        let data = this.get(key, null)
        let obj = new LevelStorgeInfo()
        if (data) {
            Object.assign(obj, data)
        }
        return obj
    }

    /**设置获取关卡信息 */
    setLevelInfo(levelName: string, levelStorgeInfo: LevelStorgeInfo) {
        let key = this.gameVer.toString() + levelName
        this.set(key, levelStorgeInfo)
    }

    /**
     * 设置已经解锁Item
     * @param itemName item名字
     */
    setItem(itemName) {
        let key = this.gameVer.toString() + itemName
        this.set(key, true)
    }

    /**
     * 获取item是否解锁
     * @param itemName Item名字
     */
    getItem(itemName) {
        let key = this.gameVer.toString() + itemName
        return this.get(key, null)
    }

    /**设置涂过的Idice */
    setMeshData(key, value) {
        this.set(key, value)
    }

    /**获取涂过的Idice */
    getMeshData(key) {
        return this.get(key, [])
    }

    set(key: string, value: any): void {
        super.set(key, value)
    }

    get(key: string, defaultValue: any): any {
        return super.get(key, defaultValue)
    }
}
