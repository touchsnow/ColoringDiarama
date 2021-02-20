import BannerController from "./BannerController";
import SdkTools from "../../tools/SdkTools";

class BannerVivo {

    private static instance: BannerVivo

    /**
     * banner广告对象
     */
    public bannerAd = null;

    /**
     * vivo的系统广告正在展示中
     */
    public systemBannerOnShow: boolean = false;

    /**
     * banner刷新延时展示定时器
     */
    private updateSytemBannerTmt: any = null;


    /**
     * BannerVivo 单例
     */
    public static getInstance(): BannerVivo {
        if (!BannerVivo.instance) {
            BannerVivo.instance = new BannerVivo()
        }
        return BannerVivo.instance
    }

    /**
     * 创建系统Banner
     */
    public createSystemBanner(BannerId) {
        if (!BannerId) {
            console.log("ASCSDK", "VIVO bannerId为空");
            return;
        }

        console.log('ASCSDK', 'VIVO Banner广告初始化', BannerId);

        this.bannerAd = qg.createBannerAd({
            posId: BannerId,
            style: {}
        });

        this.bannerAd.onLoad(function () {
            BannerController.getInstance().isLoadSystemeBanner = true;
            console.log('ASCSDK', "VIVO 系统banner加载成功");
        })

        let self = this;

        this.bannerAd.onError(function (err) {
            console.log("ASCSDK", "VIVO 系统banner加载失败：", JSON.stringify(err))
            if (err.errCode == 30007) {
                console.log("ASCSDK","VIVO 系统banner广告播放次数已达限制");
                BannerController.getInstance().isLoadSystemeBanner = false;
                self.hideSystemBanner();
                BannerController.getInstance().showBanner();
            }
        })

        // 监听系统banner隐藏
        this.bannerAd.onClose(function () {
            console.log("ASCSDK", "VIVO 系统banner关闭", BannerController.getInstance().NUM_BannerUpdateTime + "S之后再次刷新");
            BannerController.getInstance().bannerClose();
            BannerController.getInstance().updateBanner();
        })

    }

    /**
     * 展示系统banner
     */
    public showSystemBanner() {
        if (this.bannerAd) {
            console.log("ASCSDK", 'VIVO showSystemBanner ========================')
            this.systemBannerOnShow = true;
            this.bannerAd.show();
        } else {
            this.createSystemBanner(BannerController.getInstance().ID_BannerId);
            this.updateSytemBannerTmt =
                setTimeout(() => {
                    this.systemBannerOnShow = true;
                    this.bannerAd.show();
                }, 2 * 1000)
        }
    }

    /**
     * 刷新系统banner
     */
    public updateSytemBanner() {
        let self = this;
        if (this.bannerAd) {
            console.log("ASCSDK", 'VIVO 刷新系统banner ========================')
            this.bannerAd.offClose();
            this.bannerAd.offError();
            this.bannerAd.offLoad();
            this.bannerAd.destroy();
            this.createSystemBanner(BannerController.getInstance().ID_BannerId);
            this.updateSytemBannerTmt =
                setTimeout(() => {
                    self.systemBannerOnShow = true;
                    self.bannerAd.show();
                }, 2 * 1000)
        } else {
            console.log("ASCSDK", "VIVO 不存在系统banner");
        }
    }

    /**
     * 隐藏系统banner
     */
    public hideSystemBanner() {
        if (this.updateSytemBannerTmt) {
            clearTimeout(this.updateSytemBannerTmt);
        }
        if (this.bannerAd) {
            console.log("ASCSDK", 'VIVO hideSystemBanner ========================')
            this.bannerAd.offClose();
            this.bannerAd.offError();
            this.bannerAd.offLoad();
            this.bannerAd.destroy();
            this.systemBannerOnShow = false;
            // BannerController.getInstance().isLoadSystemeBanner = false;
        } else {
            console.log("ASCSDK", "VIVO 不存在系统banner");
        }
    }

}

export default BannerVivo 