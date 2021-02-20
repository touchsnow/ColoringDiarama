
import SdkTools from "../../tools/SdkTools"
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI"

import {
  _decorator, Node, SpriteComponent, SpriteFrame, loader, UITransformComponent, Vec3, WidgetComponent,
} from "cc";

class BannerTest {

  private static instance: BannerTest

  public bannerUI = null;
  public bannerFakeBg = null;

  /**
   * BannerTest 单例
   */
  public static getInstance(): BannerTest {
    if (!BannerTest.instance) {
      BannerTest.instance = new BannerTest()
    }
    return BannerTest.instance
  }

  //创建横幅
  public createBanner() {

  }
  //展示测试横幅
  public showBanner() {
    if (this.bannerFakeBg) {
      console.log("ASCSDK", "Test 已存在测试banner return");
      return;
    }
    console.log("ASCSDK", "Test showBanner====================");

    loader.load('https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/TestRes/FakeNativeBannerBg.png', (err, imagetexture) => {
      this.bannerUI = new SpriteFrame();
      this.bannerUI.texture = imagetexture._texture;
      this.bannerFakeBg = new Node("bannerFakeBg");
      this.bannerFakeBg.addComponent(SpriteComponent);
      this.bannerFakeBg.addComponent(UITransformComponent);
      this.bannerFakeBg.getComponent(SpriteComponent).spriteFrame = this.bannerUI;
      this.bannerFakeBg.addComponent(WidgetComponent);
      this.bannerFakeBg.getComponent(WidgetComponent).isAlignHorizontalCenter = true;

      this.bannerFakeBg.scale = new Vec3(0, 0, 0);
      setTimeout(() => {
        if (cc.winSize.width < cc.winSize.height) {
          this.bannerFakeBg.width = cc.winSize.width;
          this.bannerFakeBg.height = cc.winSize.width * 0.18;
        }
        else {
          this.bannerFakeBg.width = cc.winSize.width / 2;
          this.bannerFakeBg.height = this.bannerFakeBg.width * 0.18;
        }
        this.bannerFakeBg.setPosition(this.bannerFakeBg.position.x, -cc.winSize.height / 2 + this.bannerFakeBg.height / 2, 0);
        this.bannerFakeBg.scale = new Vec3(1, 1, 1);
      }, 0.5);
      Cocos3dUI.getInstance().getsdkCanvas().addChild(this.bannerFakeBg);
      if (Cocos3dUI.getInstance().cocosGroup != '') {
        this.bannerFakeBg.group = Cocos3dUI.getInstance().cocosGroup;
      }
    })
  }
  // 隐藏测试横幅
  public hideBanner() {
    if (this.bannerFakeBg) {
      console.log("ASCSDK", "Test hideBanner==================");
      this.bannerFakeBg.removeFromParent();
      this.bannerFakeBg = null;
    } else {
      console.log("ASCSDK", "Test 不存在测试banner return");
      return;
    }
  }


}

export default BannerTest 