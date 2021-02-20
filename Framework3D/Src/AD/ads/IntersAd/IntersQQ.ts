
import SdkTools from "../../tools/SdkTools";

class IntersQQ {
  private static instance: IntersQQ

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
   * IntersQQ 单例
   */
  public static getInstance(): IntersQQ {
    if (!IntersQQ.instance) {
      IntersQQ.instance = new IntersQQ()
    }
    return IntersQQ.instance
  }

  /**
   * 获取插屏是否可以展示
   */
  public getSystemIntersFlag() {
    return this.isLoadSystemInter;
  }


  /**
   * 创建QQ系统插屏
   */
  public createSystemInters(INTER_ID) {

    if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.12.0")) {
      console.log("ASCSDK", "QQ 平台版本过低,创建插屏失败 return");
      return;
    }

    console.log('ASCSDK', 'QQ 插屏广告初始化', INTER_ID)

    let self = this;
    this.systemIntersAd = qq.createInterstitialAd({
      adUnitId: INTER_ID
    });

    //监听插屏广告加载完成
    this.systemIntersAd.onLoad(() => {
      console.log('ASCSDK', 'QQ 插屏广告加载完成')
      self.isLoadSystemInter = true
    })

    //监听插屏广告加载出错
    this.systemIntersAd.onError(err => {
      console.log('ASCSDK', 'QQ 插屏广告加载失败：' + JSON.stringify(err))
      self.isLoadSystemInter = false;
      if (self.systemIntersAd) {
        setTimeout(() => {
          self.systemIntersAd && self.systemIntersAd.load()
        }, 30 * 1000)
      }
    })
    // 加载一次
    this.systemIntersAd.load();
  }


  /**
   * 展示系统插屏
   */
  public showSystemInters() {
    if (this.systemIntersAd && this.isLoadSystemInter) {
      console.log("ASCSDK", "QQ 展示系统插屏==================");
      this.systemIntersAd.show();
    } else {
      console.log("ASCSDK", "QQ 系统插屏广告未加载");
      return;
    }
  }
}

export default IntersQQ 