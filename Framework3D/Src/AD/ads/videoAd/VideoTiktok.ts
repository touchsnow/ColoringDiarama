import SdkTools from "../../tools/SdkTools"


class VideoTiktok {
    private static instance: VideoTiktok

    /**
     * 是否加载到视频
     */
    private isLoadVideo = false;

    /**
     * 视频广告对象
     */
    private videoAd = null;

    /**
     * 视频回调方法
     */
    private videoCallBack = null;

    /**
     * 视频广告正在展示中
     */
    public videoOnShow = false;

    /**
     * VideoTiktok 单例
     */
    public static getInstance(): VideoTiktok {
        if (!VideoTiktok.instance) {
            VideoTiktok.instance = new VideoTiktok();
        }
        return VideoTiktok.instance
    }


    /**
     * 获取视频是否加载
     */
    public getVideoFlag(): boolean {
        //字节跳动方面要求展示的时候再loadVideo
        // return true;
        return this.isLoadVideo;
    }


    /**
     * 创建视频广告
     */
    public createVideoAd(ID) {

        console.log('ASCSDK', 'Tiktok 视频广告初始化', ID)

        this.videoAd = tt.createRewardedVideoAd({
            adUnitId: ID
        })

        //监听视频广告加载完成
        this.videoAd.onLoad(() => {
            console.log('ASCSDK', 'Tiktok 视频广告加载完成')
            this.isLoadVideo = true;
        })

        //监听视频广告加载出错
        this.videoAd.onError(err => {
            console.log('ASCSDK', 'Tiktok 视频广告加载失败 ：' + JSON.stringify(err))
            this.isLoadVideo = false;
            if (this.videoAd) {
                setTimeout(() => {
                    this.videoAd && this.videoAd.load()
                }, 30 * 1000)
            }
        })

        //监听视频广告播放完成
        this.videoAd.onClose(res => {
            setTimeout(() => {
                if (res.isEnded) {
                    console.log('ASCSDK', 'Tiktok 激励视频广告完成，发放奖励')
                    if (this.videoCallBack) {
                        this.videoCallBack(true);
                        this.isLoadVideo = false;
                        this.videoAd.load();
                    }
                } else {
                    console.log('ASCSDK', 'Tiktok 激励视频广告取消关闭，不发放奖励')
                    if (this.videoCallBack) {
                        this.videoCallBack(false)
                        this.isLoadVideo = false;
                        this.videoAd.load();
                    }
                }
                this.videoOnShow = false;
            }, 0.5 * 1000)
        })

    }


    /**
     * 展示video
     */
    public showVideo(callback) {
        if (this.videoOnShow) {
            console.log("ASCSDK", "视频正在播放中,请勿多次点击！");
            return;
        }
        this.videoOnShow = true;

        let self = this;
        this.videoCallBack = callback
        if (this.videoAd) {
            self.videoAd.show()
                .then(() => {
                    console.log("ASCSDK", "Tiktok 激励视频广告显示成功");
                })
                .catch(err => {
                    console.log("ASCSDK", "Tiktok 激励视频广告组件出现问题", JSON.stringify(err));
                    // 可以手动加载一次
                    self.videoAd.load().then(() => {
                        console.log("ASCSDK", "Tiktok 激励视频广告手动加载成功");
                        // 加载成功后需要再显示广告
                        self.videoAd.show().catch(err => {
                            console.log("ASCSDK", "Tiktok 激励视频广告播放失败", JSON.stringify(err));
                            self.videoOnShow = false;
                            callback(false);
                        });
                    });
                });
        }
        else {
            self.videoOnShow = false;
            callback(false);
        }
    }
}

export default VideoTiktok  