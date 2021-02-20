import SdkTools from "../../tools/SdkTools"

class VideoOppo {
  private static instance: VideoOppo

  /**
   * 是否加载到视频
   */
  private isLoadVideo: boolean = false;

  /**
   * 视频广告对象
   */
  private videoAd: any = null;

  /**
   * 视频回调方法
   */
  private videoCallBack: any = null;

  /**
   * VideoOppo 单例
   */
  public static getInstance(): VideoOppo {
    if (!VideoOppo.instance) {
      VideoOppo.instance = new VideoOppo();
    }
    return VideoOppo.instance
  }


  /**
   * 创建视频广告
   */
  public createVideoAd(ID) {

    this.videoAd = qg.createRewardedVideoAd({
      posId: ID
    })

    //监听视频广告加载完成
    this.videoAd.onLoad(() => {
      console.log('ASCSDK', 'OPPO 视频广告加载完成')
      this.isLoadVideo = true
    })

    //监听视频广告加载出错
    this.videoAd.onError(err => {
      console.log('ASCSDK', 'OPPO 视频加载失败：' + JSON.stringify(err));
      if (this.videoAd) {
        setTimeout(() => {
          this.videoAd && this.videoAd.load()
        }, 30 * 1000)
      }
    })

    this.videoAd.onVideoStart(function () {
      console.log("ASCSDK", "OPPO 激励视频开始播放");
    })

    //监听视频广告播放完成
    this.videoAd.onClose(res => {
      if (res.isEnded) {
        console.log('ASCSDK', 'OPPO 激励视频广告完成，发放奖励')
        if (this.videoCallBack) {
          this.videoCallBack(true);
          this.videoAd.load();
        }
      } else {
        console.log('ASCSDK', 'OPPO 激励视频广告取消关闭，不发放奖励')
        if (this.videoCallBack) {
          this.videoCallBack(false);
          this.videoAd.load();
        }
      }
    })

    this.videoAd.load();
  }

  /**
   * 获取视频是否加载
   */
  public getVideoFlag(): boolean {
    return this.isLoadVideo;
  }

  /**
   * 展示video
   */
  public showVideo(callback) {
    this.videoCallBack = callback;
    if (this.videoAd) {
      console.log("ASCSDK", "OPPO 展示视频===========================")
      this.videoAd.show();
      this.isLoadVideo = false;
    }
  }
}

export default VideoOppo  