import SdkTools from "../../tools/SdkTools";
class IntersOppo {
  private static instance: IntersOppo

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
   * IntersOppo 单例
   */
  public static getInstance(): IntersOppo {
    if (!IntersOppo.instance) {
      IntersOppo.instance = new IntersOppo()
    }
    return IntersOppo.instance
  }

  /**
   * 创建oppo系统插屏
   */
  public createSystemInters(INTER_ID) {

    console.log('ASCSDK', 'OPPO 插屏广告初始化', INTER_ID);
    var self = this;

    //1051前后的版本插屏广告API不一致
    if (qg.getSystemInfoSync().platformVersionCode >= 1061) {
      this.systemIntersAd = qg.createInterstitialAd({
        adUnitId: INTER_ID
      })
    }
    else {
      this.systemIntersAd = qg.createInsertAd({
        posId: INTER_ID
      })
    }

    //监听插屏加载完成
    this.systemIntersAd.onLoad(() => {
      console.log('ASCSDK', 'OPPO 插屏广告加载完成')
      this.isLoadSystemInter = true;
    })

    //监听插屏广告加载错误
    this.systemIntersAd.onError(err => {
      console.log('ASCSDK', 'OPPO 插屏加载失败：' + JSON.stringify(err))
    })

    //如果oppo小游戏版本高于或等于1051,则在回调中再次showBanner和NativeIcon
    if (qg.getSystemInfoSync().platformVersionCode >= 1051) {
      this.systemIntersAd.onClose(() => {
        self.SW_OnIntersShow = false;
      });
    }

    //加载一次
    this.systemIntersAd.load()
  }


  /**
   * 获取插屏是否可以展示
   */
  public getSystemIntersFlag() {
    return this.isLoadSystemInter;
  }
  /**
   * 展示系统插屏
  */
  public showSystemInters() {

  }
}

export default IntersOppo 