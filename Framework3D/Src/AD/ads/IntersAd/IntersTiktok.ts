
import SdkTools from "../../tools/SdkTools";
import IntersController from "./IntersController";

class IntersTiktok {
  private static instance: IntersTiktok

  /**
   * 插屏是否在展示中
  */
  public SW_OnIntersShow = false;

  /**
   * 插屏广告对象
  */
  public systemIntersAd = null;


  /**
   * 是否加载到了插屏广告
  */
  private isLoadSystemInter = false;


  /**
  * IntersTiktok 单例
  */
  public static getInstance(): IntersTiktok {
    if (!IntersTiktok.instance) {
      IntersTiktok.instance = new IntersTiktok()
    }
    return IntersTiktok.instance
  }

  /**
   * 获取插屏是否可以展示
   */
  public getSystemIntersFlag() {
    return this.isLoadSystemInter;
  }


  /**
   * 创建Tiktok系统插屏
   */
  public createSystemInters(INTER_ID) {

    console.log('ASCSDK', 'Tiktok 插屏广告初始化', INTER_ID)
    
    let appName = tt.getSystemInfoSync().appName;
    if (appName == "Toutiao" || (appName == "Douyin" && !SdkTools.getInstance().isversionNewThanEngineVersion("1.71"))) {
      this.systemIntersAd = tt.createInterstitialAd({
        adUnitId: INTER_ID
      });
    } else {
      console.log("ASCSDK", "非抖音/今日头条平台 或抖音平台版本过低 return");
      return;
    }
    
    let self = this;

    //监听插屏加载完成
    this.systemIntersAd.onLoad(() => {
      console.log('ASCSDK', 'Tiktok 插屏广告加载完成')
      this.isLoadSystemInter = true;
    })

    //监听插屏广告加载错误
    this.systemIntersAd.onError(err => {
      console.log('ASCSDK', 'Tiktok 插屏加载失败 ：' + JSON.stringify(err));
      if (this.systemIntersAd) {
        setTimeout(() => {
          self.systemIntersAd && self.systemIntersAd.load()
        }, 30 * 1000)
      }
    })

    //监听插屏广告关闭
    this.systemIntersAd.onClose(() => {
      console.log('ASCSDK', 'Tiktok 关闭插屏,重新创建插屏广告');
      self.systemIntersAd.destroy();
      self.createSystemInters(IntersController.getInstance().ID_SystemIntersId);
      self.isLoadSystemInter = false;
      self.systemIntersAd.load();
    });


    //加载一次
    this.systemIntersAd.load()
  }


  /**
   * 展示系统插屏
  */
  public showSystemInters() {
    if (this.systemIntersAd) {
      console.log("ASCSDK", "Tiktok 展示系统插屏==================");
      this.systemIntersAd.show();
    } else {
      console.log("ASCSDK", "Tiktok 系统插屏广告未初始化");
      return;
    }
  }
}

export default IntersTiktok 