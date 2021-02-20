import SdkTools, { Game_Platform } from "../tools/SdkTools"
import ASCAd from "../ASCAd"
import BannerController from "../ads/bannerAd/BannerController"
import IntersController from "../ads/IntersAd/IntersController"
import VideoController from "../ads/videoAd/VideoController"
import NativeController from "../ads/nativeAd/NativeController"
import OtherFunctions from "../tools/OtherFunctions"
import NavigateController from "../navigate/NavigateController"
import Config from "../sdkConfig"
import BoxController from "../ads/boxAd/BoxController"
import BlockController from "../ads/blockAd/BlockController"
import PlatformManager from "../../Base/PlatformManager"

const config = Config.getInstance();

/**
 * 服务器URL
 */
const host = "https://cloud.xminigame.com/api"
// const host = "http://centos.6263game.com:10010" //测试

class Network {
  private static instance: Network

  /**
   * 服务器返回的token
   */
  private token: string = "";

  /**
   * 初始化成功
   */
  private isInitCompelete = 0;

  /**
   * 是否初始化过，此参数用于防止SDK多次初始化的问题
   */
  private hasBeenInit = false;

  /**
   * 是否下发广告
   */
  private pushAd: boolean = false;

  /**
   * 统计互推数据的开关默认开启
   */
  private statisSwitch: boolean = true;

  /**
   * Network 单例
   */
  public static getInstance(): Network {
    if (!Network.instance) {
      Network.instance = new Network()
    }
    return Network.instance
  }

  /**
   * 渠道的登录接口
   */
  public login(callback) {
    switch (SdkTools.getPlatform()) {
      case Game_Platform.GP_Oppo:
        {
          let self = this;
          qg.login({
            success: function (res) {
              var data = JSON.stringify(res.data);
              console.log("ASCSDK", "OPPO 登录成功：" + data);
              self.getH5SDKUserInfo(res.data.token, SdkTools.getData("ServerUserId", ""), callback);
            },
            fail: function (res) {
              console.log("ASCSDK", "OPPO 登录失败,", JSON.stringify(res));
              console.log("ASCSDK", "OPPO 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          });
        }
        break;
      case Game_Platform.GP_Vivo:
        {
          console.log("ASCSDK", "VIVO 启用游客登录");
          this.userRegister(SdkTools.getData("ServerUserId", ""), callback);
        }
        break;
      case Game_Platform.GP_Tiktok:
        {
          let self = this;
          tt.login({
            force: false,
            success(res) {
              if (res.isLogin) {
                console.log("ASCSDK", "Tiktok 已登录：" + JSON.stringify(res));
                self.getH5SDKUserInfo(res.code, SdkTools.getData("ServerUserId", ""), callback);
              } else {
                console.log("ASCSDK", "Tiktok 未登录,", JSON.stringify(res));
                console.log("ASCSDK", "Tiktok 启用游客登录");
                self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
              }
            },
            fail(res) {
              console.log("ASCSDK", "Tiktok 登录失败,", JSON.stringify(res));
              console.log("ASCSDK", "Tiktok 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            },
          });
        }
        break;
      case Game_Platform.GP_QQ:
        {
          let self = this;
          qq.login({
            success(res) {
              console.log("ASCSDK", "QQ 登录成功：" + JSON.stringify(res));
              self.getH5SDKUserInfo(res.code, SdkTools.getData("ServerUserId", ""), callback);
            },
            fail(res) {
              console.log("ASCSDK", "QQ 登录失败,", JSON.stringify(res));
              console.log("ASCSDK", "QQ 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          })
        }
        break;
      case Game_Platform.GP_WX:
        {
          let self = this;
          wx.login({
            success(res) {
              if (res.code) {
                console.log("ASCSDK", "WX 登录成功：" + JSON.stringify(res));
                self.getH5SDKUserInfo(res.code, SdkTools.getData("ServerUserId", ""), callback);
              } else {
                console.log("ASCSDK", "WX 登录失败：" + JSON.stringify(res));
                console.log("ASCSDK", "WX 启用游客登录");
                self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
              }
            },
            fail(res) {
              console.log("ASCSDK", "WX 登录失败：", JSON.stringify(res));
              console.log("ASCSDK", "WX 启用游客登录");
              self.userRegister(SdkTools.getData("ServerUserId", ""), callback);
            }
          })
        }
        break;
      default:
        break;
    }
  }


  /**
  * 针对没有获取渠道token的游客用户
  */
  userRegister(userId, callback) {
    console.log("ASCSDK", "获取游客token");
    var Data =
    {
      "channelId": config.channelId,
      "signParam": {
      },
      "userId": userId
    }

    var self = this;
    var url = `${host}/xmini-game-user/mobile/login/getVisitorToken`;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var data = xhr.responseText;
        if (data) {
          console.log("ASCSDK", "服务器返回data:", data);
        }
        var json = JSON.parse(data);

        if (typeof json == "undefined" || !json || !json.data) {
          console.log("ASCSDK", 'error : is not a json');
          callback(false);
          return;
        }

        var token = json.data.token;
        var userId = json.data.userId;

        if (token && typeof token != "undefined" && userId && typeof userId != "undefined") {
          console.log("ASCSDK", "注册成功", token, userId);
          self.token = token;
          SdkTools.saveData("ServerUserId", userId)
          callback(true);
        }
        else {
          console.log("ASCSDK", "注册失败", token, userId);
          callback(false);
        }
      }
    };
    xhr.addEventListener('error', e => {
      console.log("ASCSDK", 'error', JSON.stringify(e));
    });

    console.log("ASCSDK", "发送给服务器的Data：", JSON.stringify(Data));
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(Data));
  }


  /**
  * 针对已经获取到获取渠道token的用户
  */
  getH5SDKUserInfo(token, userId, callback) {
    console.log("ASCSDK", "渠道返回的token：", token);
    var Data;
    switch (SdkTools.getPlatform()) {
      case Game_Platform.GP_Oppo:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "token": token,
              "sdkVersion": "1.0.0"
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_Vivo:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "token": token,
              // "sdkVersion": "1.0.0" vivo不需要sdkVersion
            },
            "userId": userId
          }
        }
        break;
      case Game_Platform.GP_Tiktok:
      case Game_Platform.GP_QQ:
      case Game_Platform.GP_WX:
        {
          Data =
          {
            "channelId": config.channelId,
            "signParam": {
              "code": token,
              "nickName": "",
              "avatar": ""
            },
            "userId": userId
          }
        }
        break;
      default:
        {
          callback(false);
        }
        break;
    }

    console.log("ASCSDK", "封装的Data：", JSON.stringify(Data));

    var self = this;
    var url = `${host}/xmini-game-user/mobile/login/getMobileToken`;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var data = xhr.responseText;
        if (data) {
          console.log("ASCSDK", "服务器返回的data：", data);
        }
        var json = JSON.parse(data);

        if (typeof json == "undefined" || !json || !json.data) {
          console.log("ASCSDK", 'error : is not a json');
          callback(false);
          return;
        }

        var token = json.data.token;
        var userId = json.data.userId;
        if (token && typeof token != "undefined" && userId && typeof userId != "undefined") {
          self.token = token;
          cc.sys.localStorage.setItem("ServerUserId", userId)
          callback(true);
        }
        else {
          console.log("ASCSDK", "注册失败");
          callback(false);
        }
      }
    };
    xhr.addEventListener('error', e => {
      console.log("ASCSDK", 'error', JSON.stringify(e));
    });

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", token);
    xhr.send(JSON.stringify(Data));
  }


  /**
   * 获得后台在线参数
   */
  public getSDKOnlineConfig(callback?) {
    if (this.hasBeenInit) {
      console.log("ASCSDK", "重复初始化 return");
      return;
    }
    this.hasBeenInit = true;

    //下发广告
    // var url = `${host}/xmini-game-advert/mobile/advert/downAdConfigure?channelId=${config.channelId}`
    var url = config.configUrl;
    console.log("地址是：" + url)
    var self = this;
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      console.log("xhr.readyState:" + xhr.readyState)
      console.log("xhr.status:" + xhr.status)
      console.log("xhr.responseText:" + xhr.responseText)
      if (xhr.readyState == 4 && xhr.status == 200) {
        var data = xhr.responseText;
        if (!data) {
          console.log("ASCSDK," + "初始化失败");
          return;
        }
        if (self.pushAd) return;
        self.pushAd = true;

        console.log("ASCSDK," + "下发广告data：" + data);

        var json = JSON.parse(data);
        if (typeof json == "undefined" || !json || !json.data) {
          console.log("ASCSDK," + 'error : is not a json');
          return;
        }
        if (json.data.mainSwitch) {
          ASCAd.getInstance().SW_MainSwitch = json.data.mainSwitch;           //广告总开关
        }


        // 渠道管理-广告总开关
        if (!ASCAd.getInstance().SW_MainSwitch) {
          console.log("ASCSDK," + "广告开关没有开启");
          return;
        }


        // 广告开关
        var adSwitch = json.data.advertSwitch;
        if (typeof adSwitch.bannerSwitch != "undefined") {
          BannerController.getInstance().SW_SystemBannerSwitch = adSwitch.bannerSwitch;             // 系统Banner开关
        }
        if (typeof adSwitch.intersSwitch != "undefined") {
          IntersController.getInstance().SW_SystemIntersSwitch = adSwitch.intersSwitch;             // 系统插屏开关
        }
        if (typeof adSwitch.videoSwitch != "undefined") {
          VideoController.getInstance().SW_VideoSwitch = adSwitch.videoSwitch;                     //视频开关
        }
        if (typeof adSwitch.nativeBigIntersSwitch != "undefined") {
          NativeController.getInstance().SW_NativeMainSwitch = adSwitch.nativeBigIntersSwitch;     //原生总开关
        }
        if (typeof adSwitch.nativeBannerSwitch != "undefined") {
          BannerController.getInstance().SW_NativeBannerSwitch = adSwitch.nativeBannerSwitch;      //原生Banner开关
        }
        if (typeof adSwitch.nativeIntersSwitch != "undefined") {
          IntersController.getInstance().SW_NativeIntersSwitch = adSwitch.nativeIntersSwitch;      //原生插屏开关
        }
        if (typeof adSwitch.boxSwitch != "undefined") {
          BoxController.getInstance().SW_BoxSwitch = adSwitch.boxSwitch;      //QQ盒子广告开关
          NavigateController.getInstance().SW_BoxSwitch = adSwitch.boxSwitch;      //互推盒子广告开关
        }


        // 广告ID
        var adIdentity = json.data.advertIdentity;
        if (adIdentity.enableSwitch && typeof adIdentity != "undefined") {
          adIdentity.adBannerId && (BannerController.getInstance().ID_BannerId = adIdentity.adBannerId); //banner广告ID
          adIdentity.adIntersId && (IntersController.getInstance().ID_SystemIntersId = adIdentity.adIntersId); //系统插屏广告ID
          adIdentity.adNativeId && (NativeController.getInstance().ID_NativeID = adIdentity.adNativeId); //原生广告ID
          adIdentity.adVideoId && (VideoController.getInstance().ID_VideoID = adIdentity.adVideoId); //视频广告ID
          adIdentity.adBoxId && (BoxController.getInstance().ID_BoxID = adIdentity.adBoxId); //盒子广告ID
          adIdentity.adBrickId && (BlockController.getInstance().ID_BlockID = adIdentity.adBrickId); //积木广告ID
        } else {
          console.log("ASCSDK," + "广告ID未启用==================");
        }


        // 插屏二合一
        if (json.data.combineInters != null) {
          var adCombineControl = json.data.combineInters;
          if (typeof adCombineControl != "undefined" && adCombineControl.enableSwitch != null && adCombineControl.enableSwitch) {
            IntersController.getInstance().NUM_NativeIntersPercent = adCombineControl.nativeIntersRatio; //原生插屏出现的概率
          }
        }


        // 动态控制
        if (json.data.dynamicNativeInters != null) {
          var adDynamicNativeInters = json.data.dynamicNativeInters;
          if (typeof adDynamicNativeInters.intersSwitch != "undefined" && adDynamicNativeInters.intersSwitch != null && adDynamicNativeInters.intersSwitch) {
            NativeController.getInstance().NUM_NativeIntersReportFrequency = adDynamicNativeInters.reportFrequency;       //原生插屏上报次数
          }
        }


        // 广告基础控制-banner控制
        if (json.data.baseControl != null) {
          var adBannerControl = json.data.baseControl;
          if (typeof adBannerControl.bannerSwitch != "undefined" && adBannerControl.bannerSwitch != null && adBannerControl) {
            if (typeof adBannerControl.refreshTime != "undefined" && adBannerControl.refreshTime != null && adBannerControl.refreshTime != 0) {
              BannerController.getInstance().NUM_BannerUpdateTime = adBannerControl.refreshTime;                //Banner刷新时间
            }
            if (typeof adBannerControl.priority != "undefined" && adBannerControl.priority != null && adBannerControl.priority) {
              if (adBannerControl.priority == "nativeBanner") {
                BannerController.getInstance().SW_SystemBannerFirst = false;                                 //系统banner优先？  
              }
            }
            if (typeof adBannerControl.maxClose != "undefined" && adBannerControl.maxClose != null && adBannerControl.maxClose != 0) {
              BannerController.getInstance().NUM_BannerMostShowTimes = adBannerControl.maxClose;            // banner最大展示次数
            }
          }
        }


        // 广告基础控制-插屏控制
        if (json.data.baseControl != null) {
          var adIntersControl = json.data.baseControl;
          if (typeof adIntersControl != "undefined" && adIntersControl != null && adIntersControl) {
            IntersController.getInstance().SW_IntersBaseControlSwitch = adIntersControl.intersSwitch;     //插屏基本控制的开关(插屏开关)
            if (typeof adIntersControl.startNum != "undefined" && adIntersControl.startNum != null && adIntersControl.startNum != 0) {
              IntersController.getInstance().NUM_IntersStartNum = adIntersControl.startNum;        //插屏开始次数
            }
            if (typeof adIntersControl.intervalNum != "undefined" && adIntersControl.intervalNum != null && adIntersControl.intervalNum != 0) {
              IntersController.getInstance().NUM_IntersIntervalNum = adIntersControl.intervalNum;        //插屏间隔次数
            }
            if (typeof adIntersControl.intervalTime != "undefined" && adIntersControl.intervalTime != null && adIntersControl.intervalTime != 0) {
              IntersController.getInstance().NUM_IntersIntervalTime = adIntersControl.intervalTime;      //插屏间隔最小时间 
            }
            if (typeof adIntersControl.delayEject != "undefined" && adIntersControl.delayEject != null && adIntersControl.delayEject != 0) {
              IntersController.getInstance().NUM_IntersDelayTime = adIntersControl.delayEject;           //插屏延迟时间(ms)
            }
            if (typeof adIntersControl.delayProbability != "undefined" && adIntersControl.delayProbability != null && adIntersControl.delayProbability != 0) {
              IntersController.getInstance().NUM_IntersDelayPercent = adIntersControl.delayProbability;  //插屏延迟概率
            }
          }
        }


        // 桌面开关
        if (json.data.desktopSwitch != null) {
          var adOtherSwitch = json.data.desktopSwitch;
          if (typeof adOtherSwitch.desktopIconSwitch != "undefined" && adOtherSwitch.desktopIconSwitch != null && adOtherSwitch) {
            OtherFunctions.getInstance().SW_DesktopSwitch = adOtherSwitch.desktopIconSwitch;               // 添加桌面图标开关
          }
          if (typeof adOtherSwitch.activateDesktopIconSwitch != "undefined" && adOtherSwitch.activateDesktopIconSwitch != null && adOtherSwitch) {
            OtherFunctions.getInstance().SW_IntersToDesktop = adOtherSwitch.activateDesktopIconSwitch;          // 插屏间隔弹桌面图标开关
          }
          if (typeof adOtherSwitch.autoAddDesktopNumber != "undefined" && adOtherSwitch.autoAddDesktopNumber != null && adOtherSwitch.desktopIconSwitch && adOtherSwitch.activateDesktopIconSwitch && adOtherSwitch.autoAddDesktopNumber != 0) {
            OtherFunctions.getInstance().NUM_DeskAutoMostTimes = adOtherSwitch.autoAddDesktopNumber;        // 自动弹添加桌面次数
          }
          if (typeof adOtherSwitch.intersAddDesktopNumber != "undefined" && adOtherSwitch.intersAddDesktopNumber != null && adOtherSwitch.activateDesktopIconSwitch && adOtherSwitch.intersAddDesktopNumber != 0) {
            OtherFunctions.getInstance().NUM_IntersAddDesktopNumber = adOtherSwitch.intersAddDesktopNumber;         // 第几次插屏变添加桌面
          }
        }


        // 创建广告
        adIdentity.adBannerId && BannerController.getInstance().createSystemBanner();
        adIdentity.adIntersId && IntersController.getInstance().createSystemInters();
        adIdentity.adNativeId && NativeController.getInstance().createNativeAd();
        adIdentity.adVideoId && VideoController.getInstance().createVideoAd();
        adIdentity.adBoxId && BoxController.getInstance().createAppBox();
        adIdentity.adBrickId && BlockController.getInstance().createBlock();


        IntersController.getInstance().runIntersInterval();
        SdkTools.getInstance().initSystemInfo(callback);

        //oppo延时展示原生和banner
        let bannerNativeDelay = json.data.bannerNativeDelay;
        if (PlatformManager.getInstance().isOppo() && bannerNativeDelay && bannerNativeDelay > 0) {
          console.log('延时${bannerNativeDelay}s展示banner和原生！！！');
          setTimeout(() => {
            console.log('开始显示banner和原生！！！');
            BannerController.getInstance().SW_StartShow = true;
            NativeController.getInstance().SW_StartShow = true;
            BannerController.getInstance().showBanner();
            if (NativeController.getInstance().oldNativeIconSize) {
              NativeController.getInstance().showNativeIconAsOld();
            }
          }, bannerNativeDelay * 1000);
        } else {
          BannerController.getInstance().SW_StartShow = true;
          NativeController.getInstance().SW_StartShow = true;
        }
      }
    }

    xhr.onerror = function (e) {
      console.log("ASCSDK," + "err:" + JSON.stringify(e));
    }
    xhr.open("GET", url, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", this.token);
    xhr.send();
  }


  /**
   * 互推统计
   */
  public statistics(infom) {
    if (!this.statisSwitch) {
      return;
    }
    // var url = `${host}/fastgameserver/advert/adpush/collectAdPush?gameId=${this.GAMEID}&channelId=${channelId}&pushGamePackage=${infom.pushGamePackage}`;
    var url = `${host}/xmini-game-user/mobile/pushdata/collectAdPush?channelId=${config.channelId}&pushGamePackage=${infom.pushGamePackage}`;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var data = xhr.responseText;
        if (data) {
          console.log("ASCSDK", "互推统计数据:" + data);
        }
      }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", this.token);
    xhr.send();
  }

}
export default Network