import BannerController from "./BannerController";
import SdkTools from "../../tools/SdkTools";

class BannerTiktok {

    private static instance: BannerTiktok

    /**
     * banner广告对象
     */
    public bannerAd: any = null;

    /**
     * Tiktok的系统广告正在展示中
     */
    public systemBannerOnShow: boolean = false;

    /**
     * banner不是第一次展示
     */
    private bannerShow: boolean = false

    /**
     * banner刷新定时器
     */
    private updateBanner: any = null;

    /**
     * BannerTiktok 单例
     */
    public static getInstance(): BannerTiktok {
        if (!BannerTiktok.instance) {
            BannerTiktok.instance = new BannerTiktok()
        }
        return BannerTiktok.instance
    }

    /**
     * 创建系统Banner
     */
    public createSystemBanner(BannerId) {
        if (!BannerId) {
            console.log("ASCSDK", "Tiktok bannerId为空");
            return;
        }

        console.log('ASCSDK', 'Tiktok Banner广告初始化', BannerId);

        let windowWidth = tt.getSystemInfoSync().windowWidth;
        let windowHeight = tt.getSystemInfoSync().windowHeight;

        let self = this;

        this.bannerAd = tt.createBannerAd({
            adUnitId: BannerId,
            style: {
                left: -1000,
                top: -1000,
            },
        })

        this.bannerAd.onResize(function (size) {
            console.log("ASCSDK", "Tiktok banner广告重设位置")
            self.bannerAd.style.top = windowHeight - size.height;
            self.bannerAd.style.left = (windowWidth - size.width) / 2;
        })

        this.bannerAd.onLoad(function () {
            console.log("ASCSDK", "Tiktok banner广告加载成功")
            BannerController.getInstance().isLoadSystemeBanner = true;
            if (self.bannerShow) {
                self.showSystemBanner();
            }
        })
    }

    /**
     * 展示系统banner
     */
    public showSystemBanner() {

        console.log("ASCSDK", 'Tiktok show systemBanner ========================')

        this.bannerShow = true;


        if (BannerController.getInstance().isLoadSystemeBanner) {
            this.bannerAd.show();
        } else {
            console.log("ASCSDK", "Tiktok banner广告未加载完成");
        }

        // 刷新系统banner
        // this.updateSytemBanner();

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
                console.log("ASCSDK", 'Tiktok 刷新系统banner========================')
                this.bannerAd.destroy();
                this.createSystemBanner(BannerController.getInstance().ID_BannerId);
            }, BannerController.getInstance().NUM_BannerUpdateTime * 1000)
    }

    /**
     * 隐藏系统banner
     */
    public hideSystemBanner() {
        console.log("ASCSDK", 'Tiktok hideSystemBanner ========================')

        if (this.bannerAd) {
            this.bannerAd.hide()
        }
        this.bannerShow = false;

        if (this.updateBanner) {
            clearInterval(this.updateBanner);
        }

    }

}

export default BannerTiktok 