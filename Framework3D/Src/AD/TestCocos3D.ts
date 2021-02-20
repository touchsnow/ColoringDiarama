import { _decorator, Component, Node } from "cc";
import ASCAd from './ASCAd'
const { ccclass, property } = _decorator;

@ccclass("TestCocos3D")
export class TestCocos3D extends Component {

    public videoPath;

    start() {
        ASCAd.getInstance().initAd();
    }

    showFavoriteGuide() {
        ASCAd.getInstance().showFavoriteGuide("bar", "一键添加到我的小程序", "overtab");
    }

    recordClip() {
        ASCAd.getInstance().recordClip(5, 5);
    }

    startGameVideo() {
        ASCAd.getInstance().startGameVideo(60);
    }
    stopGameVideo() {
        ASCAd.getInstance().stopGameVideo(videoPath => {
            console.log('视频录制成功 ', this.videoPath = videoPath);
        });
    }
    shareVideo() {
        ASCAd.getInstance().shareVideo("这是抖音分享视频的标题", "这是头条分享视频的描述", "这是抖音分享视频的话题", this.videoPath, res => {
            if (res) {
                console.log("分享成功");
            } else {
                console.log("分享失败");
            }
        });
    }

    showMoreGames() {
        ASCAd.getInstance().showMoreGames("https://tencentcnd.minigame.xplaymobile.com/Wuyuhui/KuGou/lddqq.png", 200, 100, cc.winSize.width / 2, cc.winSize.height / 2);
    }

    hideMoreGames() {
        ASCAd.getInstance().hideMoreGames();
    }

    showBlock() {
        // QQ "landscape"-横向展示 "vertical"-竖向展示
        // ASCAd.getInstance().getBlockFlag() && ASCAd.getInstance().showBlock("landscape", 100, 300, 3);
        // WX：广告组件的主题颜色,"white"-白色 "black"-黑色
        ASCAd.getInstance().getBlockFlag() && ASCAd.getInstance().showBlock("black", 0, 600, 8);
    }

    hideBlock() {
        ASCAd.getInstance().hideBlock();
    }

    showAppBox() {
        ASCAd.getInstance().getBoxFlag() && ASCAd.getInstance().showAppBox();
    }

    showBanner() {
        ASCAd.getInstance().showBanner();
    }
    hideBanner() {
        ASCAd.getInstance().hideBanner();
    }

    showVideo() {
        ASCAd.getInstance().getVideoFlag() && ASCAd.getInstance().showVideo((res) => {
            if (res) {
                console.log("视频播放完成");
            } else {
                console.log("视频取消播放");
            }
        });
    }
    showVideoInters() {
        ASCAd.getInstance().getVideoIntersFlag() && ASCAd.getInstance().showVideoInters(() => {
            // do something 视频播放完成所做的操作 恢复游戏
        });
    }

    showInters() {
        ASCAd.getInstance().showInters();
    }



    showNativeIcon() {
        ASCAd.getInstance().getNativeIconFlag() && ASCAd.getInstance().showNativeIcon(200, 200, 300, 300);
    }

    hideNativeIcon() {
        ASCAd.getInstance().hideNativeIcon();
    }

    showNativeImage() {
        ASCAd.getInstance().getImageNativeFlag() && ASCAd.getInstance().showNativeImage(628, 314, 100, -400);
    }

    hideNativeImage() {
        ASCAd.getInstance().hideNativeImage();
    }

    getNativeInfo() {
        ASCAd.getInstance().getNativeInfo();
    }

    showNavigateIcon() {
        ASCAd.getInstance().showNavigateIcon(120, 120, 200, 200);
    }

    hideNavigateIcon() {
        ASCAd.getInstance().hideNavigateIcon();
    }

    showNavigateGroup() {
        ASCAd.getInstance().showNavigateGroup("horizontal", "left");
    }
    hideNavigateGroup() {
        ASCAd.getInstance().hideNavigateGroup();
    }

    showNavigateSettle() {
        ASCAd.getInstance().showNavigateSettle(3, 0, 0);
    }
    hideSettleNavigate() {
        ASCAd.getInstance().hideNavigateSettle();
    }

    showNavigateBoxBanner() {
        ASCAd.getInstance().getNavigateBoxBannerFlag() && ASCAd.getInstance().showNavigateBoxBanner();
    }
    hideNavigateBoxBanner() {
        ASCAd.getInstance().hideNavigateBoxBanner();
    }

    showNavigateBoxPortal() {
        ASCAd.getInstance().getNavigateBoxPortalFlag() && ASCAd.getInstance().showNavigateBoxPortal();
    }
    
}
