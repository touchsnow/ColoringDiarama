import {SpriteFrame, textureUtil } from "cc";
import UIController from "../../ui/UIController";

/**
 * HuaWei原生类
 */
class NativeHuaWei {

  private static instance: NativeHuaWei

  /**
   * HuaWei原生广告对象
   */
  public nativeAd: any = null;

  /**
   * HuaWei原生广告资源
   */
  public nativeInfo: any = null;

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
  * NativeHuaWei 单例
  */
  public static getInstance(): NativeHuaWei {
    if (!NativeHuaWei.instance) {
      NativeHuaWei.instance = new NativeHuaWei()
    }
    return NativeHuaWei.instance
  }


  /**
   * 创建HuaWei原生广告
   */
  public createNativeAd(ID) {

    console.log("ASCSDK", "HuaWei 加载原生广告", ID);

    this.nativeAd = hbs.createNativeAd({
      adUnitId: ID,
      success: (code) => {
        console.log("loadNativeAd loadNativeAd : success");
      },
      fail: (data, code) => {
        console.log("loadNativeAd loadNativeAd fail: " + data + "," + code);
      },
      complete: () => {
        console.log("loadNativeAd loadNativeAd : complete");
      }
    });
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

    var self = this;

    this.nativeAd.onLoad(function (res) {

      console.log("ASCSDK", "HuaWei 原生广告加载成功", JSON.stringify(res.adList))

      let index = 0;
      if (typeof res.adList != undefined && res.adList.length != 0) {
        index = res.adList.length - 1;
      } else {
        console.log("ASCSDK", "HuaWei 原生广告列表为空 return");
        return;
      }

      console.log("ASCSDK", "第" + index + "个原生广告:" + JSON.stringify(res.adList[index]));

      if (res.adList[index].icon && res.adList[index].icon != "" && res.adList[index].imgUrlList.length != 0) {
        console.log("ASCSDK", "HuaWei 同时存在原生ICON和大图");
      } else {
        console.log("ASCSDK", "HuaWei 只存在原生ICON或大图");
      }

      self.nativeInfo.adId = String(res.adList[index].adId);
      self.nativeInfo.title = String(res.adList[index].title);
      self.nativeInfo.desc = res.adList[index].desc ? String(res.adList[index].desc) : "点我一下可不可以啊";
      self.nativeInfo.clickBtnTxt = String(res.adList[index].clickBtnTxt);

      self.nativeContent.adId = String(res.adList[index].adId);
      self.nativeContent.title = String(res.adList[index].title);
      self.nativeContent.desc = res.adList[index].desc ? String(res.adList[index].desc) : "点我一下可不可以啊";

      if (res.adList[index].icon && res.adList[index].icon != "") {
        textureUtil.loadImage(String(res.adList[index].icon), (err, imagetexture) => {
          if (err) {
            self.nativeInfo.Native_BigImage = null;
            self.isLoadImageNative = false;
            console.log("ASCSDK", "HuaWei 原生大图加载错误:" + err);
            return
          }
          console.log("ASCSDK", "HuaWei 原生ICON加载成功");
          self.nativeInfo.Native_icon = imagetexture;
          self.isLoadIconNative = true;
        });
        self.nativeContent.Native_icon = String(res.adList[index].icon);
      } else {
        self.nativeInfo.Native_icon = null;
        self.isLoadIconNative = false;
      }

      if (res.adList[index].imgUrlList.length != 0) {
        textureUtil.loadImage(String(res.adList[index].imgUrlList[0]), (err, texture) => {
          if (err) {
            self.nativeInfo.Native_BigImage = null;
            self.isLoadImageNative = false;
            console.log("ASCSDK", "HuaWei 原生大图加载错误:" + err);
            return
          }
          console.log("ASCSDK", "HuaWei 原生大图加载成功");
          var spriteFrame = new SpriteFrame()
          spriteFrame.texture = texture._texture
          self.nativeInfo.Native_BigImage = spriteFrame;
          self.isLoadImageNative = true;
        });
        self.nativeContent.Native_BigImage = String(res.adList[index].imgUrlList[0]);
      } else {
        self.nativeInfo.Native_BigImage = null;
        self.isLoadImageNative = false;
      }

    });


    //监听原生广告加载错误
    this.nativeAd.onError(err => {
      console.log("ASCSDK", "HuaWei 原生广告加载失败：" + JSON.stringify(err))
    });

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
    console.log("ASCSDK", "HuaWei 原生广告上报展示", "广告ID为:" + ID);
    this.nativeAd.reportAdShow({
      adId: ID
    })
  }
  /**
   * 上报原生广告点击
   */
  public reportNativeClick(ID) {
    console.log("ASCSDK", "HuaWei 原生广告上报点击", "广告ID为:" + ID);
    this.nativeAd.reportAdClick({
      adId: ID
    })
  }
}

export default NativeHuaWei 