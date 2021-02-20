import SdkTools, { Game_Platform } from "../tools/SdkTools"
import UIController from "../ui/UIController"
import NavigateTest from "./NavigateTest"
import BannerController from "../ads/bannerAd/BannerController";

class NavigateController {

    private static instance: NavigateController

    /**
     * 互推盒子开关
     */
    public SW_BoxSwitch: boolean = false;

    /**
     * 互推盒子横幅广告实例
     */
    public gameBannerAd: any = null;
    /**
     * 是否加载到互推盒子横幅广告
     */
    public isLoadNavigateBoxBanner: boolean = false;

    /**
     * 互推盒子九宫格广告实例
     */
    public gamePortalAd: any = null;
    /**
     * 是否加载到互推盒子九宫格广告
     */
    public isLoadNavigateBoxPortal: boolean = false;
    /**
     * 存储bannerController的是否展示banner变量
     */
    public hasShowBanner: boolean = false;

    /**
     * 互推ICON开关
     */
    public SW_NavigateIconSwitch: boolean = false;

    /**
     * 互推列表开关
     */
    public SW_NavigateGroupSwitch: boolean = false;

    /**
     * 结算互推开关
     */
    public SW_NavigateSettleSwitch: boolean = false;

    /**
     * 互推游戏列表
     */
    public navigateList: any = [];

    /**
     * 互推ICON是否正在展示
     */
    public isNavigateIconShow: boolean = false;

    /**
     * 互推列表是否正在展示
     */
    public isNavigateGroupShow: boolean = false;

    /**
     * 结算互推是否正在展示
     */
    public isNavigateSettleShow: boolean = false;


    /**
     * NavigateController 单例
     */
    public static getInstance(): NavigateController {
        if (!NavigateController.instance) {
            NavigateController.instance = new NavigateController()
        }
        return NavigateController.instance
    }


    /**
     * 创建互推ICON
     */
    public createNavigateIcon() {
        if (!this.SW_NavigateIconSwitch) {
            console.log("ASCSDK", "互推ICON开关未开启")
            return;
        }
        if (qg.getSystemInfoSync().platformVersionCode < 1044) {
            console.log("ASCSDK", "不支持互推的版本")
            return;
        }
        UIController.getInstance().loadNavigateIconRes();
    }
    /**
     * 获取互推ICON是否可以展示标志
     */
    public getNavigateIconFlag() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test || SdkTools.getPlatform() == Game_Platform.GP_Android || SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            return true;
        }
        return UIController.getInstance().isLoadNavigateIcon && !this.isNavigateIconShow && UIController.getInstance().isLoadNavigateList;
    }
    /**
     * 展示互推ICON
     */
    public showNavigateIcon(width, height, x, y) {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NavigateTest.getInstance().showNavigateIcon(width, height, x, y);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showNavigateIcon","calling_method_params":{"icon_size":${width},"icon_x":${x},"icon_y":${y}}}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            let viewSize = cc.view.getVisibleSize();
            let size = width / viewSize.width;
            let posX = (x - width / 2) / viewSize.width;
            let posY = (viewSize.height - (y + width / 2)) / viewSize.height;
            jsb.reflection.callStaticMethod("AppController", "showNavigateIcon:withX:withY:", size, posX, posY);
            return;
        }
        if (!this.SW_NavigateIconSwitch) {
            console.log("ASCSDK", "互推ICON开关未开启")
            return;
        }
        if (qg.getSystemInfoSync().platformVersionCode < 1044) {
            console.log("ASCSDK", "不支持互推的版本")
            return;
        }
        this.isNavigateIconShow = true;
        UIController.getInstance().showNavigateIcon(width, height, x, y);
    }
    /**
     * 隐藏互推ICON
     */
    public hideNavigateIcon() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NavigateTest.getInstance().hideNavigateIcon();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideNavigateIcon",'calling_method_params':0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            jsb.reflection.callStaticMethod("AppController", "hideNavigateIcon");
            return;
        }
        this.isNavigateIconShow = false;
        UIController.getInstance().hideNavigateIcon();
    }


    /**
     * 创建互推列表
     */
    public createNavigateGroup() {
        if (!this.SW_NavigateGroupSwitch) {
            console.log("ASCSDK", "互推列表开关未开启")
            return;
        }
        if (qg.getSystemInfoSync().platformVersionCode < 1044) {
            console.log("ASCSDK", "不支持互推的版本")
            return;
        }
        UIController.getInstance().loadNavigateGroup();
    }
    /**
     * 获取互推列表是否可以展示标志
     */
    public getNavigateGroupFlag() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            console.log("ASCSDK", "Test 没有测试互推列表============");
            return false;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android || SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            return true;
        }
        return UIController.getInstance().isLoadNavigateGroup && !this.isNavigateGroupShow && UIController.getInstance().isLoadNavigateList;
    }
    /**
     * 展示互推列表
     */
    public showNavigateGroup(type: string, side: string) {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            console.log("ASCSDK", "Test 没有测试互推列表============");
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showNavigateGroup","calling_method_params":{"type":${type},"slide":${side}}}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            jsb.reflection.callStaticMethod("AppController", "showNavigateGroup:withSide:", type, side);
            return;
        }
        if (!this.SW_NavigateGroupSwitch) {
            console.log("ASCSDK", "互推列表开关未开启")
            return;
        }
        if (qg.getSystemInfoSync().platformVersionCode < 1044) {
            console.log("ASCSDK", "不支持互推的版本")
            return;
        }
        this.isNavigateGroupShow = true;
        UIController.getInstance().showNavigateGroup(type, side);
    }
    /**
     * 隐藏互推列表
     */
    public hideNavigateGroup() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            console.log("ASCSDK", "Test 没有测试互推列表============");
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideNavigateGroup",'calling_method_params':0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            jsb.reflection.callStaticMethod("AppController", "hideNavigateGroup");
            return;
        }
        this.isNavigateGroupShow = false;
        UIController.getInstance().hideNavigateGroup();
    }



    /**
     * 创建结算互推
     */
    public createNavigateSettle() {
        if (!this.SW_NavigateSettleSwitch) {
            console.log("ASCSDK", "结算互推开关未开启")
            return;
        }
        if (qg.getSystemInfoSync().platformVersionCode < 1044) {
            console.log("ASCSDK", "不支持互推的版本")
            return;
        }
        UIController.getInstance().loadNavigateSettleRes();
    }
    /**
     * 获取结算互推是否可以展示标志
     */
    public getNavigateSettleFlag() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test || SdkTools.getPlatform() == Game_Platform.GP_Android || SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            return true;
        }
        return UIController.getInstance().isLoadNavigateSettle && !this.isNavigateSettleShow && UIController.getInstance().isLoadNavigateList;
    }
    /**
     * 展示结算互推
     */
    public showNavigateSettle(type: number, x: number, y: number) {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            this.isNavigateSettleShow = true;
            NavigateTest.getInstance().showNavigateSettle(type, x, y);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showNavigateSettle","calling_method_params":{"type":${type},"viewX":${x},"viewY":${y}}}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            let viewSize = cc.view.getVisibleSize();
            let posX = x / viewSize.width;
            let posY = (viewSize.height - y) / viewSize.height;
            jsb.reflection.callStaticMethod("AppController", "showNavigateSettle:withX:withY:", type, posX, posY);
            return;
        }
        if (!this.SW_NavigateSettleSwitch) {
            console.log("ASCSDK", "结算互推开关未开启")
            return;
        }
        if (qg.getSystemInfoSync().platformVersionCode < 1044) {
            console.log("ASCSDK", "不支持互推的版本")
            return;
        }
        this.isNavigateSettleShow = true;
        UIController.getInstance().showNavigateSettle(type, x, y);
    }
    /**
     * 隐藏结算互推
     */
    public hideNavigateSettle() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            this.isNavigateSettleShow = false;
            NavigateTest.getInstance().hideNavigateSettle();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideNavigateSettle",'calling_method_params':0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            jsb.reflection.callStaticMethod("AppController", "hideNavigateSettle");
            return;
        }
        this.isNavigateSettleShow = false;
        UIController.getInstance().hideNavigateSettle();
    }


    /**
     * 加载互推list
    */
    public loadNavigateList() {
        if (!this.navigateList) {
            console.log("ASCSDK", "互推list加载出错")
            return;
        }
        UIController.getInstance().loadNavigateList();
    }


    /**
     * 创建互推盒子横幅广告
     */
    public createNavigateBoxBanner(ID) {

        if (!this.SW_BoxSwitch) {
            console.log("ASCSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }

        if (qg.getSystemInfoSync().platformVersionCode < 1076) {
            console.log("ASCSDK", "OPPO 版本较低,不支持互推盒子广告");
            return;
        }

        console.log("ASCSDK", "OPPO 互推盒子横幅广告初始化", ID);

        // 创建互推盒子横幅广告
        this.gameBannerAd = qg.createGameBannerAd({
            adUnitId: ID
        })

        this.isLoadNavigateBoxBanner = true;

        // 监听互推盒子横幅广告加载失败
        this.gameBannerAd.onError(function (err) {
            console.log("ASCSDK", "OPPO 互推盒子横幅广告出错:", JSON.stringify(err));
        })

    }
    /**
     * 获取能否展示互推盒子横幅广告标志
     */
    public getNavigateBoxBannerFlag() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            return true;
        }
        if (SdkTools.getPlatform() != Game_Platform.GP_Oppo) {
            console.log("ASCSDK", "非OPPO平台,不能展示互推盒子横幅广告");
            return false;
        } else {
            return this.isLoadNavigateBoxBanner;
        }
    }
    /**
     * 展示互推盒子横幅广告
     */
    public showNavigateBoxBanner() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            this.isNavigateSettleShow = true;
            NavigateTest.getInstance().showNavigateBoxBanner();
            return;
        }
        if (!this.SW_BoxSwitch) {
            console.log("ASCSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }
        if (SdkTools.getPlatform() != Game_Platform.GP_Oppo) {
            console.log("ASCSDK", "非OPPO平台,不能展示互推盒子横幅广告");
            return;
        }
        if (!this.isLoadNavigateBoxBanner) {
            console.log("ASCSDK", "OPPO 互推盒子横幅广告未加载完成");
            return;
        }
        console.log("ASCSDK", "showNavigateBoxBanner=====================");

        if (this.gameBannerAd) {
            BannerController.getInstance().hideBanner();
            this.gameBannerAd.show();
        } else {
            console.log("ASCSDK", "OPPO 不存在互推盒子横幅广告实例");
            return;
        }
    }
    /**
     * 隐藏互推盒子横幅广告
     */
    public hideNavigateBoxBanner() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            this.isNavigateSettleShow = false;
            NavigateTest.getInstance().hideNavigateBoxBanner();
            return;
        }
        if (this.gameBannerAd) {
            console.log("ASCSDK", "hideNavigateBoxBanner=====================");
            this.gameBannerAd.hide()
        } else {
            console.log("ASCSDK", "OPPO 不存在互推盒子横幅广告实例");
            return;
        }
    }


    /**
     * 创建互推盒子九宫格广告
     */
    public createNavigateBoxPortal(ID) {

        if (!this.SW_BoxSwitch) {
            console.log("ASCSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }

        if (qg.getSystemInfoSync().platformVersionCode < 1076) {
            console.log("ASCSDK", "OPPO 版本较低,不支持互推盒子广告");
            return;
        }

        console.log("ASCSDK", "OPPO 互推盒子九宫格广告初始化", ID);

        // 创建互推盒子九宫格广告
        this.gamePortalAd = qg.createGamePortalAd({
            adUnitId: ID
        })

        let self = this;

        // 监听互推盒子九宫格广告加载成功
        this.gamePortalAd.onLoad(function () {
            console.log("ASCSDK", "OPPO 互推盒子九宫格广告加载完成");
            self.isLoadNavigateBoxPortal = true;
        })

        // 监听互推盒子九宫格广告加载失败
        this.gamePortalAd.onError(function (err) {
            console.log("ASCSDK", "OPPO 互推盒子九宫格广告出错:", JSON.stringify(err));
            self.isLoadNavigateBoxPortal = false;
            if (err.code == 1004) {
                setTimeout(() => {
                    self.gamePortalAd.load();
                }, 20 * 1000);
            }
        })

        // 监听互推盒子九宫格广告关闭
        this.gamePortalAd.onClose(function () {
            console.log("ASCSDK", "OPPO 互推盒子九宫格广告关闭");
            self.gamePortalAd.load();
            self.hasShowBanner && BannerController.getInstance().showBanner();
        })

        this.gamePortalAd.load();
    }
    /**
     * 获取能否展示互推盒子九宫格广告标志
     */
    public getNavigateBoxPortalFlag() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            return true;
        }
        if (SdkTools.getPlatform() != Game_Platform.GP_Oppo) {
            console.log("ASCSDK", "非OPPO平台,不能展示互推盒子九宫格广告");
            return false;
        } else {
            return this.isLoadNavigateBoxPortal;
        }
    }
    /**
     * 展示互推盒子九宫格广告
     */
    public showNavigateBoxPortal() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            NavigateTest.getInstance().showNavigateBoxPortal();
            return;
        }
        if (!this.SW_BoxSwitch) {
            console.log("ASCSDK", "OPPO 互推盒子广告开关未开启");
            return;
        }
        if (SdkTools.getPlatform() != Game_Platform.GP_Oppo) {
            console.log("ASCSDK", "非OPPO平台,不能展示互推盒子九宫格广告");
            return;
        }
        if (!this.isLoadNavigateBoxPortal) {
            console.log("ASCSDK", "OPPO 互推盒子九宫格广告未加载完成");
            return;
        }
        console.log("ASCSDK", "showNavigateBoxPortal=====================");

        if (this.gamePortalAd) {
            this.hasShowBanner = BannerController.getInstance().hasShowBanner;
            BannerController.getInstance().hideBanner();
            this.gamePortalAd.show();
        } else {
            console.log("ASCSDK", "OPPO 不存在互推盒子九宫格广告实例");
            return;
        }
    }

}
export default NavigateController