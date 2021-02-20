import SdkTools from "../../tools/SdkTools"


class VideoQQ {
    private static instance: VideoQQ

    /**
     * 是否加载到视频
     */
    private isLoadVideo = false;

    /**
     * 视频广告对象
     */
    private videoAd = null;

    /**
     * 视频回调
     */
    private videoCallBack = null;

    /**
     * VideoQQ 单例
     */
    public static getInstance(): VideoQQ {
        if (!VideoQQ.instance) {
            VideoQQ.instance = new VideoQQ();
        }
        return VideoQQ.instance
    }


    /**
     * 获取视频是否加载
     */
    public getVideoFlag(): boolean {
        if (!this.isLoadVideo && this.videoAd) {
            this.videoAd.load()
        }
        return this.isLoadVideo;
    }


    /**
     * 创建视频广告
     */
    public createVideoAd(ID) {

        console.log('ASCSDK', 'QQ 视频广告初始化', ID)

        let self = this;

        this.videoAd = qq.createRewardedVideoAd({
            adUnitId: ID
        })

        //监听视屏广告加载完成
        this.videoAd.onLoad(() => {
            console.log('ASCSDK', 'QQ 视频广告加载完成')
            self.isLoadVideo = true;
        })

        //监听视屏广告加载出错
        this.videoAd.onError(err => {
            console.log('ASCSDK', 'QQ 视屏加载失败 ：' + JSON.stringify(err))
            self.isLoadVideo = false;
            if (this.videoAd) {
                setTimeout(() => {
                    self.videoAd && self.videoAd.load()
                }, 30 * 1000)
            }
        })

        //监听视屏广告播放完成
        this.videoAd.onClose(res => {
            setTimeout(() => {
                if (res.isEnded) {
                    console.log('ASCSDK', 'QQ 激励视频广告完成，发放奖励')
                    if (this.videoCallBack) {
                        this.videoCallBack(true);
                        this.videoAd.load();
                    }
                } else {
                    console.log('ASCSDK', 'QQ 激励视频广告取消关闭，不发放奖励')
                    if (this.videoCallBack) {
                        this.videoCallBack(false);
                        this.videoAd.load();
                    }
                }
            }, 0.5 * 1000)
        })

        // 加载一次
        this.videoAd.load();
    }


    /**
     * 展示video
     */
    public showVideo(callback) {
        if (this.videoAd) {
            this.videoCallBack = callback
            console.log('ASCSDK', 'QQ showVideo ========================')
            this.videoAd.show();
            this.isLoadVideo = false;
        } else {
            console.log("ASCSDK", "QQ 不存在视频广告===============");
        }
    }
}

export default VideoQQ  