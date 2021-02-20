import SdkTools from "../../tools/SdkTools"
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI"

import {
    _decorator, Node, SpriteComponent, SpriteFrame, loader, view, UITransformComponent
} from "cc";

class BlockTest {
    private static instance: BlockTest

    /**
     * 积木广告白包ICON组件
     */
    public nativeIcon: any = null;

    /**
    * BlockTest 单例
    */
    public static getInstance(): BlockTest {
        if (!BlockTest.instance) {
            BlockTest.instance = new BlockTest()
        }
        return BlockTest.instance
    }
    /**
     * 展示积木广告
     */
    public showBlock(type: string, x: number, y: number, blockSize: number) {
        if (this.nativeIcon) {
            console.log("ASCSDK", "已存在测试积木广告 return");
            return;
        }
        console.log("ASCSDK", 'Test showBlock==========================');
        loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, texture) => {
            this.nativeIcon = new Node("nativeIcon");
            this.nativeIcon.addComponent(SpriteComponent);
            this.nativeIcon.addComponent(UITransformComponent);
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture._texture;
            this.nativeIcon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            setTimeout(() => {
                this.nativeIcon.width = 200;
                this.nativeIcon.height = 200;
                this.nativeIcon.setPosition(x + this.nativeIcon.width / 2, y - this.nativeIcon.height / 2, 0);
            }, 1)
            this.nativeIcon.setSiblingIndex(29999);
            Cocos3dUI.getInstance().getsdkCanvas().addChild(this.nativeIcon);
            if (Cocos3dUI.getInstance().cocosGroup != '') {
                this.nativeIcon.group = Cocos3dUI.getInstance().cocosGroup;
            }
        });
    }

    /**
     * 关闭积木广告
     */
    public hideBlock() {
        if (this.nativeIcon) {
            console.log("ASCSDK", "Test hideBlock==========================");
            this.nativeIcon.removeFromParent();
            this.nativeIcon = null;
        } else {
            console.log("ASCSDK", "Test 不存在测试积木广告");
            return;
        }
    }

}
export default BlockTest