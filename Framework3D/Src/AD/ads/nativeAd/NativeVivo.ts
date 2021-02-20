import SdkTools from "../../tools/SdkTools";
import UIController from "../../ui/UIController";
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI";


/**
 * vivo原生类
 */
class NativeVivo {

  private static instance: NativeVivo

  /**
   * vivo原生广告对象
   */
  public nativeAd: any = null


  /**
   * vivo原生广告资源
   */
  public nativeInfo: any = null

  /**
   * 原生广告内容,供研发获取
   */
  public nativeContent: any = null;

  /**
   * 是否加载到原生1:1图片/ICON
   */
  public isLoadIconNative: boolean = false;

  /**
   * 是否加载到原生2:1大图
  */
  public isLoadImageNative: boolean = false;

  /**
  * NativeVivo 单例
  */
  public static getInstance(): NativeVivo {
    if (!NativeVivo.instance) {
      NativeVivo.instance = new NativeVivo()
    }
    return NativeVivo.instance
  }


  /**
   * 创建vivo原生广告
   */
  public createNativeAd(ID) {

    console.log("ASCSDK", "VIVO 开始加载原生广告", ID);

    this.nativeAd = qg.createNativeAd({
      posId: ID
    })

    this.nativeInfo = {
      adId: null,
      title: '特别惊喜',
      desc: '点我一下可不可以啊',
      clickBtnTxt: null,
      Native_icon: null,
      Native_BigImage: null
    };

    this.nativeContent =
    {
      adId: null,
      title: null,
      desc: null,
      Native_icon: null,
      Native_BigImage: null,
      NativeAdTip: "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIconRes/ICONAd.png",
      NativeClose: "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/nativeBannerClose.png",
    }

    this.nativeAd.onLoad(function (res) {
      Cocos3dUI.getInstance().loadVIVONativeAd(res);
    });

    //监听原生广告加载错误
    this.nativeAd.onError(err => {
      console.log("ASCSDK", "VIVO 原生广告加载失败：" + JSON.stringify(err))
    });

    // 加载原生广告
    this.nativeAd.load();
  }

  /**
   * 展示原生Banner
   */
  public showNativeBanner() {
    UIController.getInstance().showNativeBannerUI(this.nativeInfo);
  }
  /**
   * 刷新原生banner
   */
  public updateNativeBanner() {
    UIController.getInstance().hideNativeBannerUI();
    UIController.getInstance().showNativeBannerUI(this.nativeInfo);
  }
  /**
   * 隐藏原生Banner 
   */
  public hideNativeBaner() {
    UIController.getInstance().hideNativeBannerUI();
  }
  /**
   * 定时刷新原生广告
   */
  public nativeUpdate() {
    this.nativeAd && this.nativeAd.load();
  }

  /**
   * 是否加载到原生1:1图片
   */
  public getIconNativeFlag(): boolean {
    return this.isLoadIconNative;
  }

  /**
   * 是否加载到原生2:1大图
   */
  public getImageNativeFlag(): boolean {
    return this.isLoadImageNative;
  }


  /**
   * 展示原生插屏
   */
  public showNativeInters(NativeIntersReportFrequency) {
    //上报次数
    var self = this;
    if (NativeIntersReportFrequency <= 1) {
      self.reportNativeShow(self.nativeInfo.adId);
    }
    else {
      for (var i = 0; i < NativeIntersReportFrequency; i++) {
        setTimeout(() => {
          self.reportNativeShow(self.nativeInfo.adId);
        }, 5000 * i);
      }
    }
    UIController.getInstance().showNativeIntersUI(this.nativeInfo)
  }


  /**
   * 展示原生Icon
   */
  public showNativeIcon(width, height, x, y) {
    this.reportNativeShow(this.nativeInfo.adId);
    UIController.getInstance().showNativeIconUI(width, height, x, y, this.nativeInfo)
  }

  /**
   * 展示原生大图
   */
  public showNativeImage(width, height, x, y) {
    this.reportNativeShow(this.nativeInfo.adId);
    UIController.getInstance().showNativeImageUI(width, height, x, y, this.nativeInfo)
  }


  /**
   * 自由获取原生广告信息
   */
  public getNativeInfo() {
    return this.nativeContent;
  }
  /**
   * 上报原生广告展示
   */
  public reportNativeShow(ID) {
    console.log("ASCSDK", "VIVO 上报原生广告展示", "广告ID为:" + ID);
    this.nativeAd.reportAdShow({
      adId: ID
    })
  }
  /**
   * 上报原生广告点击
   */
  public reportNativeClick(ID) {
    console.log("ASCSDK", "VIVO 上报原生广告点击", "广告ID为:" + ID);
    this.nativeAd.reportAdClick({
      adId: ID
    })
  }
}

export default NativeVivo 