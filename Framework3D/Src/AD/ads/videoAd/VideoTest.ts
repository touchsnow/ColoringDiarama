import SdkTools from "../../tools/SdkTools"
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI"

import {
    _decorator, Node, SpriteComponent, UIOpacityComponent,
    SpriteFrame, loader, UITransformComponent, LabelComponent,
} from "cc";

class VideoTest {
    private static instance: VideoTest

    /**
    * VideoTest 单例
    */
    public static getInstance(): VideoTest {
        if (!VideoTest.instance) {
            VideoTest.instance = new VideoTest()
        }
        return VideoTest.instance
    }

    /**
     * 展示视频测试
     */
    public showVideo(callback) {

        console.log("ASCSDK", "Test showVideo===================");

        var layerBg = new Node("layerBg");

        layerBg.setPosition(0, 0, 30000);

        layerBg.addComponent(SpriteComponent);
        layerBg.addComponent(UIOpacityComponent);
        layerBg.getComponent(UIOpacityComponent).opacity = 200;
        layerBg.addComponent(UITransformComponent);
        loader.load('https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/layerBg.png', (err, imagetexture) => {
            console.log(imagetexture);
            var spFrame = new SpriteFrame();
            spFrame.texture = imagetexture._texture;
            layerBg.getComponent(SpriteComponent).spriteFrame = spFrame;
            setTimeout(() => {
                layerBg.setContentSize(2560, 2560);
            }, 1);
        });

        Cocos3dUI.getInstance().getsdkCanvas().getComponent(UITransformComponent).priority = 30000;
        Cocos3dUI.getInstance().getsdkCanvas().addChild(layerBg);
        if (Cocos3dUI.getInstance().cocosGroup != '') {
            layerBg.group = Cocos3dUI.getInstance().cocosGroup;
        }

        //关闭按钮
        layerBg.on(Node.EventType.TOUCH_START, function (event) {

        });

        var titleLabel = new Node("titleLabel");
        titleLabel.addComponent(LabelComponent);
        titleLabel.getComponent(LabelComponent).fontSize = 30;
        titleLabel.getComponent(LabelComponent).enableWrapText = true;
        titleLabel.width = cc.winSize.width - 200;
        titleLabel.getComponent(LabelComponent).string = "视频播放回调的测试";
        titleLabel.setPosition(0, 100, 0);
        layerBg.addChild(titleLabel);

        var buttonSuccess = new Node("buttonSuccess");
        buttonSuccess.addComponent(LabelComponent);
        buttonSuccess.getComponent(LabelComponent).fontSize = 30;
        buttonSuccess.getComponent(LabelComponent).string = "播放成功";
        buttonSuccess.setPosition(-100, -100, 0);
        layerBg.addChild(buttonSuccess);
        //关闭按钮
        buttonSuccess.on(Node.EventType.TOUCH_START, function (event) {
            Cocos3dUI.getInstance().getsdkCanvas().removeChild(layerBg);
            callback(true);
        });

        var buttonFailed = new Node("buttonFailed");
        buttonFailed.addComponent(LabelComponent);
        buttonFailed.getComponent(LabelComponent).fontSize = 30;
        buttonFailed.getComponent(LabelComponent).string = "播放失败";
        buttonFailed.setPosition(100, -100, 0);
        layerBg.addChild(buttonFailed);
        //关闭按钮
        buttonFailed.on(Node.EventType.TOUCH_START, function (event) {
            Cocos3dUI.getInstance().getsdkCanvas().removeChild(layerBg);
            callback(false);
        });
    }


}

export default VideoTest  