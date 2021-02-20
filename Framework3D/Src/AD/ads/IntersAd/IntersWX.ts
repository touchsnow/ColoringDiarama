import SdkTools from "../../tools/SdkTools";

class IntersWX {
  private static instance: IntersWX

  /**
   * 插屏广告对象
   */
  public systemIntersAd = null;

  /**
   * 是否加载到了插屏广告
   */
  private isLoadSystemInter = false;


  /**
   * IntersWX 单例
   */
  public static getInstance(): IntersWX {
    if (!IntersWX.instance) {
      IntersWX.instance = new IntersWX()
    }
    return IntersWX.instance
  }

  /**
   * 获取插屏是否可以展示
   */
  public getSystemIntersFlag() {
    return this.isLoadSystemInter;
  }


  /**
   * 创建WX系统插屏
   */
  public createSystemInters(ID) {

    console.log('ASCSDK', 'WX 插屏广告初始化', ID)

    let self = this;
    this.systemIntersAd = wx.createInterstitialAd({
      adUnitId: ID
    });

    //监听插屏广告加载完成
    this.systemIntersAd.onLoad(() => {
      console.log('ASCSDK', 'WX 插屏广告加载完成')
      self.isLoadSystemInter = true
    })

    //监听插屏广告加载出错
    this.systemIntersAd.onError(err => {
      console.log('ASCSDK', 'WX 插屏广告加载失败：' + JSON.stringify(err))
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
      console.log("ASCSDK", "WX showSystemInters==================");
      this.systemIntersAd.show();
    } else {
      console.log("ASCSDK", "WX 系统插屏广告未加载");
      return;
    }
  }
}

export default IntersWX