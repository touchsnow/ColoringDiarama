import SdkTools, { Game_Platform } from "../tools/SdkTools"
import Cocos3dUI from "../ui/cocos3dUI/Cocos3dUI"

import { loader, SpriteComponent, Node, SpriteFrame, director, UITransformComponent } from "cc"

class RecordAndShare {
    private static instance: RecordAndShare

    /**
     * 录屏地址
     */
    private videoPath: any = null;

    /**
     * 录屏对象
     */
    private gameRecorder: any = null;

    /**
     * 更多游戏按钮
     */
    private moreGameButton: any = null;

    /**
     * 是否正在展示更多游戏按钮
     */
    private isShowMoreGames: boolean = false;

    /**
     * 更多游戏测试ICON按钮
     */
    private nativeIcon: any = null;

    /**
     * RecordAndShare单例
     */
    public static getInstance(): RecordAndShare {
        if (!RecordAndShare.instance) {
            RecordAndShare.instance = new RecordAndShare()
        }
        return RecordAndShare.instance
    }

    /**
     * 分享图文
     */
    public share(templateId) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    tt.shareAppMessage({
                        templateId: templateId, // 替换成通过审核的分享ID
                        query: "",
                        success() {
                            console.log("ASCSDK", "Tiktok share 分享成功");
                        },
                        fail(e) {
                            console.log("ASCSDK", "Tiktok share 分享失败");
                        }
                    });
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 开始录屏
     */
    public startGameVideo(duration) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    this.videoPath = null;

                    if (!duration) {
                        duration = 10;
                    }
                    this.gameRecorder = tt.getGameRecorderManager();

                    this.gameRecorder.onStart(res => {
                        console.log("ASCSDK", "Tiktok 录屏开始");
                        // do somethine;
                    });

                    this.gameRecorder.onStop(res => {
                        console.log("ASCSDK", 'Tiktok 录屏结束', res.videoPath);
                        if (res.videoPath != null && typeof res.videoPath != "undefined") this.videoPath = res.videoPath;
                    });

                    this.gameRecorder.onError(errMsg => {
                        console.log("ASCSDK", "Tiktok 录屏错误:" + JSON.stringify(errMsg));
                    });

                    this.gameRecorder.start({
                        duration: duration
                    });
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 暂停录屏
     */
    public pauseGameVideo() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    console.log("ASCSDK", "Tiktok 暂停录屏=======================")
                    this.gameRecorder && this.gameRecorder.pause();
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 继续录屏
     */
    public resumeGameVideo() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    console.log("ASCSDK", "Tiktok 继续录屏=======================")
                    this.gameRecorder && this.gameRecorder.resume();
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 停止录屏
     */
    public stopGameVideo(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    console.log("ASCSDK", "Tiktok 停止录屏=======================")
                    this.gameRecorder && this.gameRecorder.stop();
                    setTimeout(() => {
                        if (this.videoPath) callback(this.videoPath);
                    }, 1000);
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 分享视频
     */
    public shareVideo(title, desc, topics, videoPath, callback) {
        console.log("ASCSDK", "Tiktok 分享录屏", videoPath);
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    if (!videoPath) {
                        console.log("ASCSDK", "视频地址为空 return");
                        return;
                    }
                    tt.shareAppMessage({
                        channel: "video",
                        title: title,
                        desc: desc,
                        extra: {
                            videoPath: videoPath, // 可替换成录屏得到的视频地址
                            videoTopics: [topics], //该字段已经被hashtag_list代替，为保证兼容性，建议两个都填写。
                            hashtag_list: [topics],
                        },
                        success() {
                            console.log("ASCSDK", "Tiktok 分享视频成功");
                            callback(true);
                        },
                        fail(e) {
                            console.log("ASCSDK", "Tiktok 分享视频失败:" + JSON.stringify(e));
                            callback(false);
                        },
                    });
                    break;
                }
            case Game_Platform.GP_Test:
                {
                    console.log("ASCSDK", "Test 分享视频成功");
                    callback(true);
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 标记精彩瞬间
     */
    public recordClip(before, after) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    this.gameRecorder && this.gameRecorder.recordClip({
                        timeRange: [before, after],
                        success(r) {
                            console.log("ASCSDK", "Tiktok 裁剪唯一索引", r.index); // 裁剪唯一索引
                        }
                    });
                    break
                }
            default:
                break;
        }
    }

    /**
     * 剪辑精彩瞬间
     */
    public clipVideo(videoPath, callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    this.gameRecorder && this.gameRecorder.clipVideo({
                        path: videoPath,
                        success(res) {
                            // 由开始5秒 +最后10秒 拼接合成的视频
                            console.log("ASCSDK", "Tiktok 录屏地址", res.videoPath);
                            callback(true, res.videoPath);
                        },
                        fail(e) {
                            console.error('剪辑失败', e);
                            callback(false, videoPath);
                        }
                    });
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 展示更多游戏
     */
    public showMoreGames(ImageAddress, width, height, x, y) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                {
                    if (tt.getSystemInfoSync().platform != "android") {
                        console.log("ASCSDK", "非安卓手机,不能展示更多游戏按钮 return");
                        return;
                    }

                    if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.23.0")) {
                        console.log("ASCSDK", "平台版本过低,不能展示更多游戏按钮,当前版本:" + tt.getSystemInfoSync().SDKVersion);
                        return;
                    }

                    if (this.isShowMoreGames) {
                        console.log("ASCSDK", "正在展示更多游戏按钮 return");
                        return;
                    }
                    this.isShowMoreGames = true;

                    console.log("ASCSDK", "showMoreGames=====================");

                    let windowWidth = Number(tt.getSystemInfoSync().windowWidth);
                    let windowHeight = Number(tt.getSystemInfoSync().windowHeight);

                    // dp转换为px,转换为以左下角为0,0
                    width = width * (windowWidth / cc.winSize.width)
                    height = height * (windowHeight / cc.winSize.height)
                    x = x * (windowWidth / cc.winSize.width)
                    y = (cc.winSize.height - y) * (windowHeight / cc.winSize.height)

                    this.moreGameButton = tt.createMoreGamesButton({
                        type: "image",
                        image: ImageAddress,
                        style: {
                            left: x,
                            top: y,
                            width: width,
                            height: height,
                            lineHeight: 40,
                            backgroundColor: "#ff0000",
                            textColor: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            borderRadius: 4,
                            borderWidth: 0,
                            borderColor: "#ff0000",
                        },
                        appLaunchOptions: [
                            {
                                appId: 'ttXXXXXX',
                                query: "foo=bar&baz=qux",
                                extraData: {},
                            }
                        ],
                        onNavigateToMiniGameBox(res) {
                            console.log("跳转到小游戏盒子", res);
                        },
                    });

                    this.moreGameButton.onTap(() => {
                        console.log("ASCSDK", "点击更多游戏");
                    });
                }
                break;
            case Game_Platform.GP_Test:
                {
                    var scene = director.getScene();
                    if (this.nativeIcon) {
                        console.log("ASCSDK", "已存在测试更多游戏自定义按钮 return");
                        return;
                    }
                    console.log("ASCSDK", "Test showMoreGames=====================");
                    loader.load(ImageAddress, (err, texture) => {
                        this.nativeIcon = new Node("nativeIcon");
                        this.nativeIcon.addComponent(SpriteComponent);
                        this.nativeIcon.addComponent(UITransformComponent);
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = texture._texture;
                        this.nativeIcon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        setTimeout(() => {
                            this.nativeIcon.width = width;
                            this.nativeIcon.height = height;
                            this.nativeIcon.setPosition(x - cc.winSize.width / 2 + this.nativeIcon.width / 2, y - cc.winSize.height / 2 - this.nativeIcon.height / 2, 0);
                        }, 1)
                        this.nativeIcon.setSiblingIndex(29999);
                        scene.addChild(this.nativeIcon);
                        Cocos3dUI.getInstance().getsdkCanvas().addChild(this.nativeIcon);
                        if (Cocos3dUI.getInstance().cocosGroup != '') {
                            this.nativeIcon.group = Cocos3dUI.getInstance().cocosGroup;
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
    /**
     * 隐藏更多游戏
     */
    public hideMoreGames() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Test:
                if (this.nativeIcon) {
                    console.log("ASCSDK", "Test hideMoreGames=====================");
                    this.nativeIcon.removeFromParent();
                    this.nativeIcon = null;
                } else {
                    console.log("ASCSDK", "Test 不存在更多游戏 return");
                    return;
                }
                break;
            case Game_Platform.GP_Tiktok:
                if (this.moreGameButton) {
                    console.log("ASCSDK", "hideMoreGames=====================");
                    this.isShowMoreGames = false;
                    this.moreGameButton.destroy();
                    this.moreGameButton = null;
                } else {
                    console.log("ASCSDK", "不存在更多游戏 return");
                    return;
                }
                break;
            default:
                break;
        }
    }

    /**
     * 收藏游戏
     */
    public showFavoriteGuide(type, content, position) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Tiktok:
                tt.showFavoriteGuide({
                    type: type,
                    content: content,
                    position: position,
                    success(res) {
                        console.log("ASCSDK", "引导组件展示成功");
                    },
                    fail(res) {
                        console.log("ASCSDK", "引导组件展示失败:" + JSON.stringify(res));
                    },
                });
                break;
            default:
                break;
        }
    }

}
export default RecordAndShare