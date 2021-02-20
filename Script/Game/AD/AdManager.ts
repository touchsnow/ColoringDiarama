import { _decorator, Component, Node } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import { CustomAdManager } from './CustomAdManager';
const { ccclass, property } = _decorator;

@ccclass('AdManger')
export class AdManager {

    private static adManager: AdManager
    public static getInstance(): AdManager {
        if (this.adManager == null) {
            this.adManager = new AdManager()
        }
        return AdManager.adManager
    }

    /** 
     * ALL
     * 展示横幅
     */
    public showBanner() {
        console.log('AD', 'showBanner');
        if (PlatformManager.getInstance().isVivo()) {
            ASCAd.getInstance().showBanner()
        } else if (PlatformManager.getInstance().isOppo()) {
            //ASCAd.getInstance().hideBanner()
            //CustomAdManager.getInstance().showBanner()
        } else if (PlatformManager.getInstance().isHuaWei()) {
            CustomAdManager.getInstance().showBanner()
        }
    }

    /** 
     * ALL
     * 隐藏横幅
     */
    public hideBanner() {
        console.log('AD', 'hideBanner');
        if (PlatformManager.getInstance().isVivo()) {
            ASCAd.getInstance().hideBanner()
        } else if (PlatformManager.getInstance().isOppo()) {
            //CustomAdManager.getInstance().hideBanner()
        } else if (PlatformManager.getInstance().isHuaWei()) {
            CustomAdManager.getInstance().hideBanner()
        }
    }

}
