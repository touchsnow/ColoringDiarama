import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VideoXM')
class VideoXM {
    
    private static instance: VideoXM

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
     * VideoVivo 单例
     */
    public static getInstance(): VideoXM {
        if (!VideoXM.instance) {
            VideoXM.instance = new VideoXM();
        }
        return VideoXM.instance
    }

    /**
     * 创建视频广告
     */
    public createVideoAd(ID) {

        console.log("ASCSDK", "XM 视频广告初始化", ID)

        this.videoAd = qg.createRewardedVideoAd({
            adUnitId: ID
        })

        //监听视频广告加载完成
        this.videoAd.onLoad(() => {
            console.log('ASCSDK', 'XM 视频广告加载完成')
            this.isLoadVideo = true
        })

        //监听视频广告加载出错
        this.videoAd.onError(err => {
            console.log('ASCSDK', 'XM 视频加载失败 ：' + JSON.stringify(err))
            this.isLoadVideo = false;
            if (this.videoAd) {
                // setTimeout(() => {
                //     this.videoAd.offLoad();
                //     this.videoAd.offError();
                //     this.videoAd.offClose();
                //     this.createVideoAd(ID);
                //     this.videoAd.load();
                // }, 60 * 1000)
                setTimeout(() => {
                    this.videoAd.load();
                }, 10 * 1000)
            }
        })

        //监听视频广告播放完成
        this.videoAd.onClose(res => {
            if (res.isEnded) {
                console.log('ASCSDK', 'XM 激励视频广告完成，发放奖励')
                if (this.videoCallBack) {
                    this.videoCallBack(true);
                    this.videoCallBack = null;
                }
            } else {
                console.log('ASCSDK', 'XM 激励视频广告取消关闭，不发放奖励')
                if (this.videoCallBack) {
                    this.videoCallBack(false);
                    this.videoCallBack = null;
                }
            }
            this.isLoadVideo = false;
            // setTimeout(() => {
            //     this.videoAd.offLoad();
            //     this.videoAd.offError();
            //     this.videoAd.offClose();
            //     this.createVideoAd(ID);
            //     this.videoAd.load();
            // }, 60 * 1000)
            setTimeout(() => {
                this.videoAd.load();
            }, 10 * 1000)
        })

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
            console.log("ASCSDK", "XM showVideo ===========================")
            this.videoAd.show();
            this.isLoadVideo = false;
        }
    }
}
export default VideoXM
