import { _decorator } from 'cc';
import BannerController from './BannerController';
const { ccclass, property } = _decorator;

@ccclass('BannerXM')
class BannerXM {

    private static instance: BannerXM

    /**
     * banner广告对象
     */
    public bannerAd = null;

    /**
     * banner刷新定时器
     */
    private updateBanner: any = null;

    /**
     * 已经调用过showBanner?
     */
    public bannerShow: boolean = false;

    /**
     * banner刷新延时展示定时器
     */
    private updateSytemBannerTmt: any = null;

    /**
     * BannerXM 单例
     */
    public static getInstance(): BannerXM {
        if (!BannerXM.instance) {
            BannerXM.instance = new BannerXM()
        }
        return BannerXM.instance
    }


    /**
     * 创建系统Banner
     */
    public createSystemBanner(BannerId) {

        console.log("ASCSDK," + "XM 系统banner广告初始化," + BannerId);
        this.bannerAd = qg.createBannerAd({
            adUnitId: BannerId,
            style: {}
        })

        this.bannerAd.onLoad(function () {
            BannerController.getInstance().isLoadSystemeBanner = true;
            console.log('ASCSDK,' + "XM 系统banner加载成功");
        })

        this.bannerAd.onError(data => {
            console.log("ASCSDK," + "XM 系统banner加载失败：," + JSON.stringify(data))
        }
        )
    }

    /**
     * 展示系统banner
     */
    public showSystemBanner() {
        if (this.bannerAd) {
            console.log("ASCSDK,"+ 'XM showSystemBanner========================')
            this.bannerAd.show()
                .then(() => {
                    this.bannerShow = true
                })
                .catch(err => { console.log(err) })
        } else {
            console.log("ASCSDK,"+ "不存在系统banner广告实例")
            this.createSystemBanner(BannerController.getInstance().ID_BannerId);
            this.updateSytemBannerTmt =
                setTimeout(() => {
                    this.bannerAd.show()
                        .then(() => {
                            this.bannerShow = true
                        })
                        .catch(err => { console.log(err) })
                }, 2 * 1000)
        }
    }

    /**
     * 刷新系统banner
     */
    public updateSytemBanner() {
        // 关闭上一个showBanner产生的定时器
        if (this.updateBanner) {
            clearInterval(this.updateBanner);
        }
        this.updateBanner =
            setInterval(() => {
                console.log("ASCSDK,"+ 'XM 刷新系统banner========================')
                this.bannerAd.offLoad();
                this.bannerAd.offError();
                this.bannerAd.destroy();
                this.createSystemBanner(BannerController.getInstance().ID_BannerId);
            }, BannerController.getInstance().NUM_BannerUpdateTime * 1000)
    }

    /**
     * 隐藏系统banner
     */
    public hideSystemBanner() {
        if (this.updateSytemBannerTmt) {
            clearTimeout(this.updateSytemBannerTmt);
        }
        if (this.bannerAd) {
            console.log("ASCSDK,"+ 'XM hideSystemBanner ========================')
            this.bannerAd.offError();
            this.bannerAd.offLoad();
            this.bannerAd.destroy();
            this.bannerShow = false;
        } else {
            console.log("ASCSDK," +"XM 不存在系统banner");
        }
    }

}
export default BannerXM
