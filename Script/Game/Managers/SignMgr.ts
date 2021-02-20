import { _decorator, Component, Node } from 'cc';
import BaseStorge from '../../../Framework3D/Src/Base/BaseStorge';
import { Constants } from '../../Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('SignMgr')
export class SignMgr extends BaseStorge {

    private static signMgr: SignMgr
    public static getInstance(): SignMgr {
        if (this.signMgr == null) {
            this.signMgr = new SignMgr()
        }
        return SignMgr.signMgr
    }

    private gameVer: number = 0
    private accrueSign: number = 0
    private firstData:string = ""

    init() {

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

        let todayDay = new Date();
        let todayDayString = todayDay.toLocaleDateString();
        let signResult = this.get(todayDayString, false)
        //console.log(this.accrueSign)
        if (!signResult) {
            this.accrueSign += 1
            this.set(todayDayString, true)
        }
        this.update()
        //console.log(this.accrueSign)
    }

    initData() {
        this.gameVer = Constants.GameVer
        this.accrueSign = 1
        this.firstData = new Date().toLocaleDateString()
    }

    getAccrueSign() {
        return this.accrueSign
    }

    getFirstSignDate(){
        return this.firstData
    }

}
