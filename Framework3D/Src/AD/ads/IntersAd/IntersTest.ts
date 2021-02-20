import SdkTools from "../../tools/SdkTools";
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI";
import { loader, SpriteComponent, SpriteFrame, Node, UIOpacityComponent, LabelComponent, Color } from "cc"

class IntersTest {
    private static instance: IntersTest

    /**
     * 加载错误次数
     */
    public nativeIntersErrorTimes: number = 0;
    /**
     * 测试插屏组件
     */
    public NIUIInfo: any = null;


    /**
     * IntersTest 单例
     */
    public static getInstance(): IntersTest {
        if (!IntersTest.instance) {
            IntersTest.instance = new IntersTest()
        }
        return IntersTest.instance
    }

    /**
     * 展示测试插屏
     */
    public showInters() {
        console.log("ASCSDK", "Test showInters===========================")
        this.NIUIInfo =
        {
            layerBg: null,
            exit: null,
        }
        var urlList = [
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/layerBg.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/nativeClose.png",
        ];

        let self = this;

        Cocos3dUI.getInstance().loadImageArr(urlList, (err, texture) => {
            if (err) {
                console.log("ASCSDK", "测试插屏资源加载错误:" + JSON.stringify(err));
                if (self.nativeIntersErrorTimes < 5) {
                    self.nativeIntersErrorTimes++;
                    self.showInters();
                }
                return;
            } else {
                self.NIUIInfo.layerBg = texture[0];
                self.NIUIInfo.exit = texture[1];

                var layerBg = new Node("layerBg");
                layerBg.addComponent(SpriteComponent);
                layerBg.addComponent(UIOpacityComponent);
                let spriteFrame = new SpriteFrame();
                spriteFrame.texture = self.NIUIInfo.layerBg;
                layerBg.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                setTimeout(() => {
                    layerBg.width = cc.winSize.width;
                    layerBg.height = cc.winSize.height;
                }, 0.5);
                layerBg.setSiblingIndex(30003);
                layerBg.getComponent(UIOpacityComponent).opacity = 150;
                Cocos3dUI.getInstance().getsdkCanvas().addChild(layerBg);
                if (Cocos3dUI.getInstance().cocosGroup != '') {
                    layerBg.group = Cocos3dUI.getInstance().cocosGroup;
                }
                layerBg.on(Node.EventType.TOUCH_START, function (event) {
                })

                var text = new Node("text");
                text.addComponent(LabelComponent);
                text.getComponent(LabelComponent).color = Color.RED;
                text.getComponent(LabelComponent).string = "这是一个测试插屏,请点击右上角关闭";
                text.getComponent(LabelComponent).fontSize = 50;
                text.getComponent(LabelComponent).lineHeight = 60;
                layerBg.addChild(text);

                var exit = new cc.Node("exit");
                exit.addComponent(SpriteComponent);
                spriteFrame = new SpriteFrame();
                spriteFrame.texture = self.NIUIInfo.exit;
                exit.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                setTimeout(() => {
                    exit.setPosition(cc.winSize.width / 2 * 3 / 4, cc.winSize.height / 2 * 3 / 5, 0);
                }, 1);
                exit.setSiblingIndex(30010);
                layerBg.addChild(exit);
                exit.on(cc.Node.EventType.TOUCH_START, function (event) {
                    console.log("ASCSDK", "关闭测试插屏");
                    layerBg.removeFromParent();
                });
            }
        })
    }


}

export default IntersTest 