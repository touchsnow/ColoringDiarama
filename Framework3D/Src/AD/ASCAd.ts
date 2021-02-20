import Network from "./network/Network"
import SdkTools, { Game_Platform } from "./tools/SdkTools";
import bannerController from "./ads/bannerAd/BannerController";
import intersController from "./ads/IntersAd/IntersController";
import videoController from "./ads/videoAd/VideoController";
import NavigateController from "./navigate/NavigateController"
import NativeController from "./ads/nativeAd/NativeController";
import OtherFunctions from "./tools/OtherFunctions";
import RecordAndShare from "./recordShare/RecordAndShare"
import BoxController from "./ads/boxAd/BoxController"
import BlockController from "./ads/blockAd/BlockController"
import UIController from "./ui/UIController";


class ASCAd {
  private static instance: ASCAd

  /**
   * 防止多次初始化操作
   */
  private hasBeenInit: boolean = false;

  /**
   * 广告总开关
   */
  public SW_MainSwitch = false;

  /**
   * ASCAd 单例
   */
  public static getInstance(): ASCAd {
    if (!ASCAd.instance) {
      ASCAd.instance = new ASCAd()
    }
    return ASCAd.instance
  }


  /**
   * 初始化广告
   */
  initAd(callback?) {
    console.log("ASCSDK,"+ "initAd,"+ "SDKVersion：version_320_5");
    //用于防止多次初始化
    if (this.hasBeenInit) {
      console.log("ASCSDK", "重复初始化initAd return================");
      return
    }
    this.hasBeenInit = true;

    //测试模式
    if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
      callback && callback(true);
      return;
    }

    // // 先登陆成功再请求广告配置
    // Network.getInstance().login(function (success) {
    //   if (success) {
    //     callback ? Network.getInstance().getSDKOnlineConfig(callback) : Network.getInstance().getSDKOnlineConfig();
    //   }
    // })
    Network.getInstance().getSDKOnlineConfig(callback);
  }


  /** 
   * ALL
   * 展示横幅
   */
  public showBanner() {
    console.log('ASCSDK,'+ 'showBanner');
    bannerController.getInstance().showBanner();
  }
  /** 
   * ALL
   * 隐藏横幅
   */
  public hideBanner() {
    console.log('ASCSDK,'+ 'hideBanner');
    bannerController.getInstance().hideBanner();
  }


  /** 
   * ALL  except-OPPO
   * 获取插屏是否可以展示标志
   */
  public getIntersFlag() {
    console.log('ASCSDK,'+ 'getIntersFlag:' + intersController.getInstance().getIntersFlag())
    return intersController.getInstance().getIntersFlag();
  }
  /** 
   * ALL  except-OPPO
   * 展示插屏
   */
  public showInters() {
    console.log('ASCSDK,'+ 'showInters');
    intersController.getInstance().showInters();
  }


  /** 
   * ALL
   * 获取视频是否可以展示标志
   */
  public getVideoFlag() {
    console.log('ASCSDK,'+ 'getVideoFlag:' + videoController.getInstance().getVideoFlag());
    return videoController.getInstance().getVideoFlag();
  }
  /** 
   * ALL
   * 展示视频
   * @param callback 视频播放回调
   */
  public showVideo(callback) {
    console.log('ASCSDK', 'showVideo');
    videoController.getInstance().showVideo(callback);
  }


  /** 
   * OPPO & VIVO & WX
   * 获取原生ICON是否可以展示标志
   */
  public getNativeIconFlag() {
    console.log('ASCSDK', 'getNativeIconFlag:' + NativeController.getInstance().getIconNativeFlag());
    return NativeController.getInstance().getIconNativeFlag();
  }
  /**
   * OPPO & VIVO & WX
   * 展示原生ICON
   * @param width ICON的宽(微信无法设置,可填任意值)
   * @param height ICON的高(微信无法设置,可填任意值)
   * @param x ICON的横坐标
   * @param y ICON的横坐标
   */
  public showNativeIcon(width: number, height: number, x: number, y: number) {
    console.log('ASCSDK', 'showNativeICON');
    NativeController.getInstance().showNativeIcon(width, height, x, y);
  }
  /** 
   * OPPO & VIVO & WX
   * 隐藏原生ICON
   */
  public hideNativeIcon() {
    console.log('ASCSDK', 'hideNativeIcon');
    NativeController.getInstance().hideNativeIcon();
  }

  /**
   * OPPO & VIVO
   * 获取原生大图是否可以展示标志
   */
  public getImageNativeFlag() {
    console.log('ASCSDK', 'getImageNativeFlag:' + NativeController.getInstance().getImageNativeFlag());
    return NativeController.getInstance().getImageNativeFlag();
  }
  /**
   * OPPO & VIVO
   * 展示原生大图
   * @param width 原生大图的宽 ps:建议宽：高 = 2:1 否则图片可能模糊
   * @param height 原生大图的高
   * @param x 原生大图的横坐标
   * @param y 原生大图的横坐标
   */
  public showNativeImage(width: number, height: number, x: number, y: number) {
    console.log('ASCSDK', 'showNativeImage');
    NativeController.getInstance().showNativeImage(width, height, x, y);
  }
  /** 
   * OPPO & VIVO
   * 隐藏原生大图
   */
  public hideNativeImage() {
    console.log('ASCSDK', 'hideNativeImage');
    NativeController.getInstance().hideNativeImage();
  }

  /**
   * OPPO & VIVO
   * 自由获取原生广告信息
   */
  public getNativeInfo() {
    console.log('ASCSDK', 'getNativeInfo');
    console.log(JSON.stringify(NativeController.getInstance().getNativeInfo()));
    return NativeController.getInstance().getNativeInfo();
  }
  /**
   * OPPO & VIVO
   * 上报原生广告展示
   * @param id 获取的原生广告的id
   */
  public reportNative(id) {
    console.log('ASCSDK', 'reportNativeShow');
    NativeController.getInstance().reportNativeShow(id);
  }
  /**
   * OPPO & VIVO
   * 上报原生广告点击
   * @param id 获取的原生广告的id
   */
  public nativeClick(id) {
    console.log('ASCSDK', 'reportNativeClick');
    NativeController.getInstance().reportNativeClick(id);
  }

  /**
   * OPPO & Android & IOS 
   * 获取互推ICON是否可以展示标签
   */
  public getNavigateIconFlag() {
    console.log('ASCSDK', 'getNavigateIconFlag:' + NavigateController.getInstance().getNavigateIconFlag());
    return NavigateController.getInstance().getNavigateIconFlag();
  }
  /**
   * OPPO & Android & IOS
   * 展示互推ICON
   * @param width ICON的宽
   * @param height ICON的高
   * @param x ICON的横坐标
   * @param y ICON的纵坐标
   */
  public showNavigateIcon(width: number, height: number, x: number, y: number) {
    console.log('ASCSDK', 'showNavigateIcon');
    NavigateController.getInstance().showNavigateIcon(width, height, x, y);
  }
  /** 
   * OPPO & Android & IOS
   * 隐藏互推ICON
   */
  public hideNavigateIcon() {
    console.log('ASCSDK', 'hideNavigateIcon');
    NavigateController.getInstance().hideNavigateIcon();
  }

  /**
   * OPPO & Android & IOS
   * 获取互推列表是否可以展示标志
   */
  public getNavigateGroupFlag() {
    console.log('ASCSDK', 'getNavigateGroupFlag:' + NavigateController.getInstance().getNavigateGroupFlag());
    return NavigateController.getInstance().getNavigateGroupFlag();
  }
  /**
   * OPPO & Android & IOS
   * 展示互推列表
   * @param type vertical-竖版 horizontal-横版
   * @param side left-左侧 right-右侧
   */
  public showNavigateGroup(type: string, side: string) {
    console.log('ASCSDK', 'showNavigateGroup');
    NavigateController.getInstance().showNavigateGroup(type, side);
  }
  /**
   * OPPO & Android & IOS
   * 隐藏互推列表
   */
  public hideNavigateGroup() {
    console.log('ASCSDK', 'hideNavigateGroup');
    NavigateController.getInstance().hideNavigateGroup();
  }

  /**
   * OPPO & Android & IOS
   * 获取结算互推是否展示标签
   */
  public getNavigateSettleFlag() {
    console.log('ASCSDK', 'getNavigateSettleFlag:' + NavigateController.getInstance().getNavigateSettleFlag());
    return NavigateController.getInstance().getNavigateSettleFlag();
  }
  /**
   * OPPO & Android & IOS
   * 展示结算互推
   * @param type 1-大窗口类型,2-两边类型,3-横条类型
   * @param x 结算互推的横坐标
   * @param y 结算互推的纵坐标
   */
  showNavigateSettle(type: number, x: number, y: number) {
    console.log('ASCSDK', 'showNavigateSettle');
    NavigateController.getInstance().showNavigateSettle(type, x, y);
  }
  /**
   * OPPO & Android & IOS
   * 隐藏结算互推
   */
  public hideNavigateSettle() {
    console.log('ASCSDK', 'hideNavigateSettle');
    NavigateController.getInstance().hideNavigateSettle();
  }

  /**
   * OPPO
   * 获取互推盒子横幅广告能否展示标志
   */
  public getNavigateBoxBannerFlag() {
    console.log('ASCSDK', 'getNavigateBoxBannerFlag:' + NavigateController.getInstance().getNavigateBoxBannerFlag());
    return NavigateController.getInstance().getNavigateBoxBannerFlag();
  }
  /**
   * OPPO
   * 展示互推盒子横幅广告
   */
  public showNavigateBoxBanner() {
    console.log('ASCSDK', 'showNavigateBoxBanner');
    NavigateController.getInstance().showNavigateBoxBanner();
  }
  /**
   * OPPO
   * 隐藏互推盒子横幅广告
   */
  public hideNavigateBoxBanner() {
    console.log('ASCSDK', 'hideNavigateBoxBanner');
    NavigateController.getInstance().hideNavigateBoxBanner();
  }

  /**
   * OPPO
   * 获取互推盒子九宫格广告能否展示标志
   */
  public getNavigateBoxPortalFlag() {
    console.log('ASCSDK', 'getNavigateBoxPortalFlag:' + NavigateController.getInstance().getNavigateBoxPortalFlag());
    return NavigateController.getInstance().getNavigateBoxPortalFlag();
  }
  /**
   * OPPO
   * 展示互推盒子九宫格广告
   */
  public showNavigateBoxPortal() {
    console.log('ASCSDK', 'showNavigateBoxPortal');
    NavigateController.getInstance().showNavigateBoxPortal();
  }

  /**
   * OPPO & VIVO => cocos,cocos3d
   * 设置渲染层级最高的组
   * 以下方法仅针对cocos、cocos3d引擎UI使用多个摄像机的情况，如果没有用到多个摄像机请忽略
   * 为了保证sdk的原生广告和互推等UI始终显示在最上层，请将组设置成最上层。
   * @param group 
   */
  public setGroup(group: string) {
    console.log('ASCSDK', 'setGroup');
    UIController.getInstance().setGroup(group);
  }


  /**
   * OPPO & VIVO & QQ
   * 获取能否添加桌面图标标志
   * @param callback 
   */
  public getDeskTopFlag(callback) {
    console.log('ASCSDK', 'getDeskTopFlag');
    return OtherFunctions.getInstance().getDeskTopFlag(callback);
  }
  /**
   * OPPO & VIVO & QQ
   * 添加桌面图标
   * @param callback 
   */
  public addDeskTop(callback) {
    console.log('ASCSDK', 'addDeskTop');
    OtherFunctions.getInstance().addDeskTop(callback);
  }


  /**
   * OPPO & VIVO & QQ
   * 展示系统提示
   * @param msg 提示信息
   */
  public showToast(msg: string) {
    console.log('ASCSDK', 'showToast');
    OtherFunctions.getInstance().showToast(msg);
  }


  /**
   * ALL
   * 手机震动
   * @param type short-短震动 long-长震动
   */
  public phoneVibrate(type: string) {
    console.log('ASCSDK', 'phoneVibrate', type);
    OtherFunctions.getInstance().phoneVibrate(type);
  }


  /**
   * OPPO
   * 数据上报
   */
  public reportMonitor() {
    console.log('ASCSDK', 'reportMonitor');
    OtherFunctions.getInstance().reportMonitor()
  }


  /**
   * TIKTOK
   * 分享图文
   */
  public share(templateId) {
    console.log('ASCSDK', 'share', templateId);
    RecordAndShare.getInstance().share(templateId);
  }

  /**
   * TIKTOK
   * 开始录屏
   * @param duration 录屏的时长,单位s,必须大于3s,最大值300s(5分钟)
   */
  public startGameVideo(duration) {
    console.log('ASCSDK', 'startGameVideo', duration);
    RecordAndShare.getInstance().startGameVideo(duration);
  }

  /**
   * TIKTOK
   * 暂停录屏
   */
  public pauseGameVideo() {
    console.log('ASCSDK', 'pauseGameVideo');
    RecordAndShare.getInstance().pauseGameVideo();
  }

  /**
   * TIKTOK
   * 继续录屏(暂停录屏之后)
   */
  public resumeGameVideo() {
    console.log('ASCSDK', 'resumeGameVideo');
    RecordAndShare.getInstance().resumeGameVideo();
  }

  /**
   * TIKTOK
   * 停止录屏
   * @param callback 停止录屏后的回调,返回视频地址
   */
  public stopGameVideo(callback) {
    console.log('ASCSDK', 'stopGameVideo');
    RecordAndShare.getInstance().stopGameVideo(callback);
  }

  /**
   * TIKTOK
   * 分享视频
   * @param title 这是抖音分享视频的标题
   * @param desc 这是头条分享视频的描述
   * @param topics 这是抖音分享视频的话题
   * @param videoPath 视频地址
   * @param callback 分享视频的回调
   */
  public shareVideo(title, desc, topics, videoPath, callback) {
    console.log('ASCSDK', 'shareVideo');
    RecordAndShare.getInstance().shareVideo(title, desc, topics, videoPath, callback);
  }

  /**
   * TIKTOK
   * 录制精彩瞬间
   * 数组的值表示记录这一时刻的前后时间段内的视频,单位是 s
   * @param before 这一时刻的前before秒
   * @param after 这一时刻的后after秒
   */
  public recordClip(before, after) {
    console.log('ASCSDK', 'recordClip');
    RecordAndShare.getInstance().recordClip(before, after);
  }

  /**
   * TIKTOK
   * 剪辑精彩瞬间
   * @param videoPath 视频存放地址
   * @param callback 剪辑回调
   */
  public clipVideo(videoPath, callback) {
    console.log('ASCSDK', 'clipVideo');
    RecordAndShare.getInstance().clipVideo(videoPath, callback);
  }

  /**
   * TIKTOK
   * 展示更多游戏按钮
   * @param ImageAddress 图片地址
   * @param width 按钮(图片)的宽
   * @param height 按钮(图片)的高
   * @param x 按钮(图片)的左上角横坐标
   * @param y 按钮(图片)的左上角纵坐标
   */
  public showMoreGames(ImageAddress: string, width: number, height: number, x: number, y: number) {
    console.log('ASCSDK', 'showMoreGames');
    RecordAndShare.getInstance().showMoreGames(ImageAddress, width, height, x, y);
  }
  /**
   * TIKTOK
   * 隐藏更多游戏按钮
   */
  public hideMoreGames() {
    console.log('ASCSDK', 'hideMoreGames');
    RecordAndShare.getInstance().hideMoreGames();
  }

  /**
   * TIKTOK
   * 收藏
   * @param type "tip"-顶部气泡 "bar"-底部弹窗
   * @param content 弹窗文案,最多显示 12 个字符,建议默认使用 一键添加到我的小程序
   * @param position 弹窗类型为 bar 时的位置参数 "bottom"-贴近底部 "overtab"-悬于页面 tab 区域上方
   */
  public showFavoriteGuide(type: string, content: string, position: string) {
    console.log('ASCSDK', 'showFavoriteGuide');
    RecordAndShare.getInstance().showFavoriteGuide(type, content, position);
  }


  /** 
   * QQ
   * 获取盒子是否可以展示标志
   */
  public getBoxFlag() {
    console.log('ASCSDK', 'getBoxFlag:' + BoxController.getInstance().getBoxFlag());
    return BoxController.getInstance().getBoxFlag();
  }
  /**
   * QQ
   * 展示盒子广告
   */
  public showAppBox() {
    console.log('ASCSDK', 'showAppBox');
    BoxController.getInstance().showAppBox();
  }


  /** 
   * QQ & WX
   * 获取积木是否可以展示标志
   */
  public getBlockFlag() {
    console.log('ASCSDK', 'getBlockFlag:' + BlockController.getInstance().getBlockFlag());
    return BlockController.getInstance().getBlockFlag();
  }
  /**
   * QQ & WX
   * 展示积木广告
   * @param type QQ: "landscape"-横向展示 "vertical"-竖向展示   WX：广告组件的主题颜色,"white"-白色 "black"-黑色
   * @param x 积木广告左上角横坐标
   * @param y 积木广告左上角纵坐标
   * @param blockSize QQ：积木广告数量：1~5 实际数量以拉取的为准   WX：积木广告数量:5或者8  5个为单行列表,8个为双行列表
   */
  public showBlock(type: string, x: number, y: number, blockSize: number) {
    console.log('ASCSDK', 'showBlock');
    BlockController.getInstance().showBlock(type, x, y, blockSize);
  }
  /** 
   * QQ & WX
   * 关闭积木广告
   */
  public hideBlock() {
    console.log('ASCSDK', 'hideBlock');
    BlockController.getInstance().hideBlock();
  }


  /** 
   * Android & IOS
   * 是否加载到插屏视频广告
   */
  public getVideoIntersFlag() {
    console.log('ASCSDK', 'getVideoIntersFlag:' + videoController.getInstance().getVideoIntersFlag());
    return videoController.getInstance().getVideoIntersFlag();
  }
  /**
   * Android & IOS
   * 展示插屏视频广告
   */
  public showVideoInters(callback) {
    console.log('ASCSDK', 'showVideoInters');
    videoController.getInstance().showVideoInters(callback);
  }


  /**
   * Android & IOS
   * 退出游戏
   */
  public exitTheGame() {
    console.log('ASCSDK', 'exitTheGame');
    OtherFunctions.getInstance().exitTheGame();
  }


  /**
   * Android & IOS
   * 事件上报
   * @param params 友盟事件ID
   * @param data 事件参数
   */
  public reportAnalytics(params, data) {
    console.log('ASCSDK', 'reportAnalytics');
    OtherFunctions.getInstance().reportAnalytics(params, data);
  }


  /**
   * Android & IOS
   * Android无回调
   * 实名认证(防沉迷)
   */
  public showAuthentication(callback) {
    console.log('ASCSDK', 'showAuthentication');
    OtherFunctions.getInstance().showAuthentication(callback);
  }
  /**
   * Android & IOS
   * Android无回调
   * 游客体验
   */
  public TouristModel(callback) {
    console.log('ASCSDK', 'TouristModel');
    OtherFunctions.getInstance().TouristModel(callback);
  }


  /**
   * Android
   * 展示原生广告
   * width ：宽
   * height ：高
   * viewX：界面的左上角距离整个界面左边的占比  
   * viewY：界面的左上角距离整个界面上边的占比
   */
  public showNativeAd(width, height, viewX, viewY) {
    console.log('ASCSDK', 'showNativeAd');
    NativeController.getInstance().showNativeAd(width, height, viewX, viewY);
  }


  /**
   * Android
   * oppo超休闲（首页更多游戏）
   */
  public showOPPOMoreGame() {
    console.log('ASCSDK', 'showOPPOMoreGame');
    OtherFunctions.getInstance().showOPPOMoreGame();
  }


  /**
   * IOS
   * 是否有网络
   */
  public IsOnLine() {
    console.log('ASCSDK', 'IsOnLine:' + OtherFunctions.getInstance().IsOnLine());
    return OtherFunctions.getInstance().IsOnLine();
  }


  /**
   * IOS
   * 展示评论
   */
  public showReviewAlert() {
    console.log('ASCSDK', 'showReviewAlert');
    OtherFunctions.getInstance().showReviewAlert();
  }

}
export default ASCAd