import SdkTools from "../../tools/SdkTools";
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI";

import {
    _decorator, Node, director, SpriteComponent, SpriteFrame, loader
} from "cc";

class NativeTest {

    private static instance: NativeTest
    /**
     * 原生ICON测试
     */
    public nativeIcon: any = null;

    /**
     * 原生大图测试
     */
    public nativeImage: any = null;

    /**
    * NativeTest 单例
    */
    public static getInstance(): NativeTest {
        if (!NativeTest.instance) {
            NativeTest.instance = new NativeTest()
        }
        return NativeTest.instance
    }

    /**
     * 展示原生Icon测试
     */
    public showNativeIcon(width, height, x, y) {
        if (this.nativeIcon) {
            console.log("ASCSDK", "Test 已存在测试原生ICON return");
            return;
        }
        console.log("ASCSDK", 'Test showNativeIcon====================');

        var self = this;

        loader.load('https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png', (err, imagetexture) => {
            var spFrame = new SpriteFrame();
            spFrame.texture = imagetexture._texture;
            self.nativeIcon = new Node("nativeIcon");
            self.nativeIcon.addComponent(SpriteComponent);
            self.nativeIcon.getComponent(SpriteComponent).spriteFrame = spFrame;
            setTimeout(() => {
                self.nativeIcon.width = width;
                self.nativeIcon.height = height;
                self.nativeIcon.setPosition(x, y, 0);
            }, 1);

            Cocos3dUI.getInstance().getsdkCanvas().addChild(self.nativeIcon);
            if (Cocos3dUI.getInstance().cocosGroup != '') {
                self.nativeIcon.group = Cocos3dUI.getInstance().cocosGroup;
            }
        });
    }
    /**
     * 隐藏原生Icon测试
     */
    public hideNativeIcon() {
        if (this.nativeIcon) {
            console.log("ASCSDK", "Test hideNativeIcon==================");
            this.nativeIcon.removeFromParent();
            this.nativeIcon = null
        } else {
            console.log("ASCSDK", "Test 不存在测试原生ICON return");
            return;
        }
    }


    /**
     * 展示测试原生大图
     */
    public showNativeImage(width, height, x, y) {
        if (this.nativeImage) {
            console.log("ASCSDK", "Test 已存在原生大图 return");
            return;
        }
        console.log("ASCSDK", 'Test showNativeImage==================');

        loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/fakeNativeImage.png", (err, texture) => {
            var scene = director.getScene();
            this.nativeImage = new Node("nativeImage");
            this.nativeImage.addComponent(SpriteComponent);
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture._texture;
            this.nativeImage.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            setTimeout(() => {
                this.nativeImage.width = width;
                this.nativeImage.height = height;
                this.nativeImage.setPosition(x, y, 0);
            }, 1)
            this.nativeImage.setSiblingIndex(29999);
            Cocos3dUI.getInstance().getsdkCanvas().addChild(this.nativeImage);
            if (Cocos3dUI.getInstance().cocosGroup != "") {
                this.nativeImage.group = Cocos3dUI.getInstance().cocosGroup;
            }
        });
    }
    /**
     * 隐藏测试原生大图
     */
    public hideNativeImage() {
        if (this.nativeImage) {
            console.log("ASCSDK", "Test hideNativeImage==============");
            this.nativeImage.removeFromParent();
            this.nativeImage = null
        } else {
            console.log("ASCSDK", "Test 不存在原生大图 return");
            return;
        }
    }
}

export default NativeTest