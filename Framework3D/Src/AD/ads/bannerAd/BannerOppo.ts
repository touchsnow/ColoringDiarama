import BannerController from "./BannerController";
import SdkTools from "../../tools/SdkTools";
import NavigateController from "../../navigate/NavigateController";

class BannerOppo {

  private static instance: BannerOppo

  /**
   * banner广告对象
   */
  public bannerAd = null;

  /**
   * oppo的系统广告正在展示中
   */
  public systemBannerOnShow: boolean = false;


  /**
   * BannerOppo 单例
   */
  public static getInstance(): BannerOppo {
    if (!BannerOppo.instance) {
      BannerOppo.instance = new BannerOppo()
    }
    return BannerOppo.instance
  }

  /**
   * 创建系统Banner
   */
  public createSystemBanner(BannerId) {
    if (!BannerId) {
      console.log("ASCSDK", "OPPO bannerId为空");
      return;
    }

    console.log('ASCSDK', 'OPPO Banner广告初始化', BannerId);

    var self = this;

    this.bannerAd = qg.createBannerAd({
      adUnitId: BannerId,
      style: {}
    })
    BannerController.getInstance().isLoadSystemeBanner = true;

    this.bannerAd.onLoad(function () {
      self.systemBannerOnShow = true;
      console.log("ASCSDK", "OPPO 系统banner展示中===================");
    })


    this.bannerAd.onError(function (err) {
      console.log("ASCSDK", "OPPO 系统banner加载失败：", JSON.stringify(err));
      if (err.msg == "adItemList is null.") {
        BannerController.getInstance().isLoadSystemeBanner = false;
        self.hideSystemBanner();
        BannerController.getInstance().showBanner();
      }
    })

    // 监听系统banner隐藏
    this.bannerAd.onHide(function () {
      console.log("ASCSDK", "OPPO 系统banner关闭", BannerController.getInstance().NUM_BannerUpdateTime + "S之后再次刷新")
      self.systemBannerOnShow = false;
      BannerController.getInstance().updateBanner();
    })

  }

  /**
   * 展示系统banner
   */
  public showSystemBanner() {
    if (NavigateController.getInstance().isNavigateSettleShow) {
      console.log("ASCSDK", "OPPO 正在展示结算互推 return");
      return;
    }
    console.log("ASCSDK", 'OPPO showSystemBanner ========================')
    this.bannerAd.show();
  }

  /**
   * 刷新系统banner
   */
  public updateSytemBanner() {
    if (NavigateController.getInstance().isNavigateSettleShow) {
      console.log("ASCSDK", "OPPO 正在展示结算互推 return");
      return;
    }
    console.log("ASCSDK", 'OPPO updateSystemBanner ========================')
    this.bannerAd.show();
  }

  /**
   * 隐藏系统banner
   */
  public hideSystemBanner() {
    if (this.bannerAd) {
      console.log("ASCSDK", 'OPPO hideSystemBanner ========================')
      this.bannerAd.offHide();
      this.bannerAd.hide();
      this.systemBannerOnShow = false;
    }else{
      console.log("ASCSDK","OPPO 不存在系统banner");
    }
  }

}

export default BannerOppo 