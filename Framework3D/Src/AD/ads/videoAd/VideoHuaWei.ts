class VideoHuaWei {
    private static instance: VideoHuaWei

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
     * VideoHuaWei 单例
     */
    public static getInstance(): VideoHuaWei {
        if (!VideoHuaWei.instance) {
            VideoHuaWei.instance = new VideoHuaWei();
        }
        return VideoHuaWei.instance
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

        console.log("ASCSDK", "HuaWei 视频广告初始化", ID)

        let self = this;

        this.videoAd = hbs.createRewardedVideoAd({
            adUnitId: ID,
            success: (code) => {
                console.log("ad demo : loadAndShowVideoAd createRewardedVideoAd: success");
                // 加载一次
                this.videoAd.load();
            },
            fail: (data, code) => {
                console.log("ad demo : loadAndShowVideoAd createRewardedVideoAd fail: " + data + "," + code);
            },
            complete: () => {
                console.log("ad demo : loadAndShowVideoAd createRewardedVideoAd complete");
            }
        });
        //监听视频广告加载完成
        this.videoAd.onLoad(() => {
            console.log("ASCSDK", "HuaWei 视频广告加载完成")
            self.isLoadVideo = true;
        })

        //监听视频广告加载出错
        this.videoAd.onError(err => {
            console.log("ASCSDK", "HuaWei 视频广告加载失败：" + JSON.stringify(err))
            self.isLoadVideo = false;
            // if (this.videoAd) {
            //     setTimeout(() => {
            //         self.videoAd && self.videoAd.load()
            //     }, 30 * 1000)
            // }
        })

        //监听视频广告播放完成
        this.videoAd.onClose(res => {
            setTimeout(() => {
                if (res.isEnded) {
                    console.log("ASCSDK", "HuaWei 激励视频广告完成,发放奖励")
                    if (this.videoCallBack) {
                        this.videoCallBack(true);
                        this.videoAd.load();
                    }
                } else {
                    console.log("ASCSDK", "HuaWei 激励视频广告取消关闭,不发放奖励")
                    if (this.videoCallBack) {
                        this.videoCallBack(false);
                        this.videoAd.load();
                    }
                }
            }, 0.5 * 1000)
        })

    }


    /**
     * 展示video
     */
    public showVideo(callback) {
        let self = this;
        if (this.videoAd) {
            this.videoCallBack = callback
            console.log("ASCSDK", "HuaWei showVideo========================")
            this.videoAd.show()
                .then(() => {
                    console.log("ASCSDK", "HuaWei 激励视频广告显示成功");
                })
                .catch(err => {
                    console.log("ASCSDK", "HuaWei 激励视频广告播放出错", JSON.stringify(err));
                    // 可以手动加载一次
                    self.videoAd.load().then(() => {
                        console.log("ASCSDK", "HuaWei 激励视频广告手动加载成功");
                        // 加载成功后需要再显示广告
                        self.videoAd.show().catch(err => {
                            console.log("ASCSDK", "HuaWei 激励视频广告播放失败", JSON.stringify(err));
                            self.isLoadVideo = false;
                            callback(false);
                        });
                    });
                });
        } else {
            console.log("ASCSDK", "HuaWei 不存在视频广告实例===============");
        }
    }
}

export default VideoHuaWei  