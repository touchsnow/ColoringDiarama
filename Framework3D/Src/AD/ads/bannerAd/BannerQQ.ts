import BannerController from "./BannerController";
import SdkTools from "../../tools/SdkTools";

class BannerQQ {

    private static instance: BannerQQ

    /**
     * banner广告对象
     */
    public bannerAd = null;

    /**
     * QQ的系统广告正在展示中
     */
    public systemBannerOnShow: boolean = false;

    /**
     * 已经调用过showBanner?
     */
    public bannerShow: boolean = false;

    /**
     * banner刷新定时器
     */
    private updateBanner: any = null;


    /**
     * BannerQQ 单例
     */
    public static getInstance(): BannerQQ {
        if (!BannerQQ.instance) {
            BannerQQ.instance = new BannerQQ()
        }
        return BannerQQ.instance
    }

    /**
     * 创建系统Banner
     */
    public createSystemBanner(BannerId) {
        if (!BannerId) {
            console.log("ASCSDK", "QQ bannerId为空");
            return;
        }

        console.log('ASCSDK', 'QQ Banner广告初始化', BannerId);

        let self = this;

        var windowWidth = Number(qq.getSystemInfoSync().windowWidth);
        var windowHeight = Number(qq.getSystemInfoSync().windowHeight);

        this.bannerAd = qq.createBannerAd({
            adUnitId: BannerId,
            style: {
                left: 0,
                top: 0,
                width: (windowHeight > windowWidth) ? windowWidth : 400,//iOS似乎无法通过onResize重设banner宽高
                height: 120
            },
            testDemoType: "65"
        })

        this.bannerAd.onResize(function (size) {
            if (windowHeight > windowWidth || cc.winSize.height > cc.winSize.width) {
                self.bannerAd.style.width = windowWidth;
                self.bannerAd.style.height = windowWidth;
            }
            else {
                self.bannerAd.style.width = windowWidth / 2;
                self.bannerAd.style.height = windowWidth / 2;
            }
            self.bannerAd.style.top = windowHeight - size.height;
            self.bannerAd.style.left = (windowWidth - self.bannerAd.style.width) / 2;
        })

        this.bannerAd.onLoad(function () {
            console.log("ASCSDK", "QQ banner广告加载成功");
            BannerController.getInstance().isLoadSystemeBanner = true;
            if (self.bannerShow) {
                self.showSystemBanner();
                if (windowHeight > windowWidth) {
                    self.bannerAd.style.width = windowWidth;
                    self.bannerAd.style.height = windowWidth;
                }
                else {
                    self.bannerAd.style.width = windowWidth / 2;
                    self.bannerAd.style.width = windowWidth / 2;
                }
                self.bannerAd.style.top = windowHeight - self.bannerAd.style.realHeight;
                self.bannerAd.style.left = (windowWidth - self.bannerAd.style.width) / 2;
            }
        })

        this.bannerAd.onError(function (err) {
            console.log("ASCSDK", "QQ banner加载失败" + JSON.stringify(err))
        })

    }

    /**
     * 展示系统banner
     */
    public showSystemBanner() {
        if (this.bannerAd) {
            console.log("ASCSDK", 'QQ show systemBanner ========================')
            this.bannerShow = true;
            this.bannerAd.show()
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
                console.log("ASCSDK", 'QQ updateSystemBanner ========================')
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
        if (this.bannerAd) {
            console.log("ASCSDK", 'QQ hideSystemBanner ========================')
            this.bannerAd.hide();
            this.bannerShow = false;
            this.systemBannerOnShow = false;
        } else {
            console.log("ASCSDK", "QQ 不存在系统banner ========================')");
        }

        // if (this.updateBanner) {
        //     clearInterval(this.updateBanner);
        // }
    }

}

export default BannerQQ 