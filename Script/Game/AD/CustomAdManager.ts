import { _decorator, Component, Node, find, loader, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomAdManager')
export class CustomAdManager {
    private static customAdManager: CustomAdManager
    public static getInstance(): CustomAdManager {
        if (this.customAdManager == null) {
            this.customAdManager = new CustomAdManager()
        }
        return CustomAdManager.customAdManager
    }


    public showBanner() {
        console.log('Custom', 'showBanner');
        let banner = find("Canvas").getChildByName("CustomBannerAd")
        if (banner) {
            banner.active = true
        } else {
            banner = instantiate(loader.getRes("UI/CustomBannerAd")) as Node
            banner.setParent(find("Canvas"))
        }
    }

    public hideBanner() {
        console.log('Custom', 'hideBanner');
        let banner = find("Canvas").getChildByName("CustomBannerAd")
        if (banner) {
            banner.active = false
        }
    }
}
