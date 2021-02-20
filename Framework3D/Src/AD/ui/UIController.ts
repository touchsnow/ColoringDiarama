import Cocos3dUI from "./cocos3dUI/Cocos3dUI"
import SdkTools from "../tools/SdkTools"

class UIController {
  private static instance: UIController

  /**
   * 原生插屏广告UI贴图目录
   */
  public NIUIInfo: any = null;

  /**
   * 原生插屏广告UI贴图目录
   */
  public NativeBannerUIInfo: any = null;

  /**
   * 原生ICON广告角标UI资源
   */
  public ICONInfo: any = null;

  /**
   * 互推UI资源
   */
  public navigateUITextures = null;

  /**
   * 互推图的资源list
   */
  public NavigateIconTextureList: any = [];

  /**
   * 互推列表UI资源
   */
  public navigateGroupUITextures = null;

  /**
   * 原生插屏加载报错次数
   */
  public nativeIntersErrorTimes = 0;

  /**
   * 原生banner加载报错次数
   */
  public nativeBannerErrorTimes = 0;

  /**
   * 原生ICON广告角标UI资源加载报错次数
   */
  public nativeIconErrorTimes = 0;

  /**
   * 是否加载完成原生插屏UI
   */
  public isLoadNIUI = false;

  /**
   * 是否加载完成原生BannerUI
   */
  public isLoadNativeBannerUI = false;

  /**
   * 是否加载完成原生ICON广告角标UI
   */
  public isLoadIconTip = false;

  /**
   * 是否加载完成互推ICON UI
   */
  public isLoadNavigateIcon = false;

  /**
   * 是否加载完成互推列表
   */
  public isLoadNavigateGroup = false;

  /**
   * 是否加载完成互推列表资源图
   */
  public isLoadNavigateList = false;

  /**
   * 互推列表资源图
   */
  public navigateSettleUITextures = null;

  /**
   * 是否正在播放互推列表动画
   */
  public groupMoving = false;

  /**
   * 是否加载完成结算互推资源图
   */
  public isLoadNavigateSettle = false;


  /**
   * UIController 单例
   */
  public static getInstance(): UIController {
    if (!UIController.instance) {
      UIController.instance = new UIController()
    }
    return UIController.instance
  }


  /**
   * 加载原生插屏UI资源
   */
  public loadNativeInstersRes() {
    Cocos3dUI.getInstance().loadNativeInstersRes();
  }
  /**
   * 展示原生插屏UI资源
   * @param uiInfo ui资源
   */
  public showNativeIntersUI(nativeInfo) {
    Cocos3dUI.getInstance().showNativeIntersUI(nativeInfo, this.NIUIInfo);
  }


  /**
   * 加载原生Banner
   */
  public loadNativeBannerRes() {
    Cocos3dUI.getInstance().loadNativeBannerRes();
  }
  /**
   * 展示原生Banner
   * @param nativeInfo 原生信息
   * @param uiInfo     ui资源
   */
  public showNativeBannerUI(nativeInfo) {
    Cocos3dUI.getInstance().showNativeBannerUI(nativeInfo, this.NativeBannerUIInfo);
  }
  /**
   * 隐藏原生Banner
   */
  public hideNativeBannerUI() {
    Cocos3dUI.getInstance().hideNativeBannerUI();
  }


  /**
   * 加载原生ICON广告角标UI资源
   */
  public loadNativeIconRes() {
    Cocos3dUI.getInstance().loadNativeIconRes();
  }


  /**
   * 展示原生ICON
   */
  public showNativeIconUI(width, height, x, y, nativeInfo) {
    Cocos3dUI.getInstance().showNativeIconUI(width, height, x, y, nativeInfo, this.ICONInfo);
  }
  /**
   * 隐藏原生ICON
   */
  public hideNativeIconUI() {
    Cocos3dUI.getInstance().hideNativeIconUI();
  }


  /**
   * 展示原生大图
   */
  public showNativeImageUI(width, height, x, y, nativeInfo) {
    Cocos3dUI.getInstance().showNativeImageUI(width, height, x, y, nativeInfo, this.ICONInfo);
  }
  /**
   * 隐藏原生大图
   */
  public hideNativeImageUI() {
    Cocos3dUI.getInstance().hideNativeImageUI();
  }


  /**
   * 加载互推ICON资源
   */
  public loadNavigateIconRes() {
    Cocos3dUI.getInstance().loadNavigateIconRes();
  }
  /**
   * 展示互推ICON
   */
  public showNavigateIcon(width, height, x, y) {
    Cocos3dUI.getInstance().showNavigateIcon(width, height, x, y);
  }
  /**
   * 隐藏互推ICON
   */
  public hideNavigateIcon() {
    Cocos3dUI.getInstance().hideNavigateIcon();
  }


  /**
   * 加载互推列表资源
   */
  public loadNavigateGroup() {
    Cocos3dUI.getInstance().loadNavigateGroup();
  }
  /**
   * 展示互推列表
   */
  public showNavigateGroup(type: string, side: string) {
    Cocos3dUI.getInstance().showNavigateGroup(type, side);
  }
  /**
   * 隐藏互推列表
   */
  public hideNavigateGroup() {
    Cocos3dUI.getInstance().hideNavigateGroup();
  }


  /**
   * 加载结算互推资源
   */
  public loadNavigateSettleRes() {
    Cocos3dUI.getInstance().loadNavigateSettleRes();
  }
  /**
   * 展示结算互推
   */
  public showNavigateSettle(type: number, x: number, y: number) {
    Cocos3dUI.getInstance().showNavigateSettle(type, x, y);
  }
  /**
   * 隐藏结算互推
   */
  public hideNavigateSettle() {
    Cocos3dUI.getInstance().hideNavigateSettle();
  }

  /**
   * 加载互推资源列表
   */
  public loadNavigateList() {
    Cocos3dUI.getInstance().loadNavigateList();
  }

  /**
   * 设置分组
   */
  public setGroup(group: string) {
    Cocos3dUI.getInstance().setGroup(group);
  }
}

export default UIController 