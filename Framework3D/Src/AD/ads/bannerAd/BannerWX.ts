import BannerController from "./BannerController";

class BannerWX {

    private static instance: BannerWX

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
     * BannerWX 单例
     */
    public static getInstance(): BannerWX {
        if (!BannerWX.instance) {
            BannerWX.instance = new BannerWX()
        }
        return BannerWX.instance
    }

    /**
     * 创建系统Banner
     */
    public createSystemBanner(ID) {

        console.log("ASCSDK", "WX 系统banner广告初始化",ID);

        var windowWidth = Number(wx.getSystemInfoSync().windowWidth);
        var windowHeight = Number(wx.getSystemInfoSync().windowHeight);

        this.bannerAd = wx.createBannerAd({
            adUnitId: ID,
            style: {
                left: 10,
                top: 76,
                width: (windowHeight > windowWidth) ? windowWidth : 400,
                height: 120
            },
        });

        let self = this;

        // 监听系统banner尺寸变化
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
        });

        // 监听系统banner加载
        this.bannerAd.onLoad(function () {
            console.log("ASCSDK", "WX banner加载成功");
            BannerController.getInstance().isLoadSystemeBanner = true;
            if (self.bannerShow) {
                self.showSystemBanner();
            }
        })

        // 监听系统banner错误
        this.bannerAd.onError(function (err) {
            console.log("ASCSDK", "WX banner加载失败" + JSON.stringify(err));
            setTimeout(() => {
                self.createSystemBanner(BannerController.getInstance().ID_BannerId);
            }, 10 * 1000);
        })

    }

    /**
     * 展示系统banner
     */
    public showSystemBanner() {
        if (this.bannerAd) {
            console.log("ASCSDK", 'WX showSystemBanner========================');
            this.bannerAd.show();
            this.bannerShow = true;
        } else {
            console.log("ASCSDK", "不存在系统banner广告实例");
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
                console.log("ASCSDK", 'WX 刷新系统banner========================')
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
            console.log("ASCSDK", 'WX hideSystemBanner========================');
            this.bannerAd.hide();
            this.bannerShow = false;
        } else {
            console.log("ASCSDK", "不存在banner");
        }
    }

}
export default BannerWX