import SdkTools, { Game_Platform } from "../../tools/SdkTools"
import BannerOppo from "./BannerOppo"
import BannerVivo from "./BannerVivo"
import BannerTest from "./BannerTest";
import NativeController from "../nativeAd/NativeController";
import NativeOppo from "../nativeAd/NativeOppo";
import NativeVivo from "../nativeAd/NativeVivo";
import NavigateController from "../../navigate/NavigateController";
import BannerTiktok from "./BannerTiktok";
import BannerQQ from "./BannerQQ";
import Cocos3dUI from "../../ui/cocos3dUI/Cocos3dUI";
import BannerWX from "./BannerWX";
import BannerXM from "./BannerXM";

class BannerController {
    private static instance: BannerController

    /**
     * 系统BannerId
     */
    public ID_BannerId = "";

    /**
     * 系统Banner开关
     */
    public SW_SystemBannerSwitch = false;

    /**
     * 系统banner优先开关
     */
    public SW_SystemBannerFirst = true;

    /**
     * 系统banner是否加载成功
     */
    public isLoadSystemeBanner = false;

    /**
     * banner刷新时间 
     */
    public NUM_BannerUpdateTime = 30;

    /**
     * banner最大展示次数
     */
    public NUM_BannerMostShowTimes = 10000;

    /**
     * oppo原生和横幅是否开始显示
     */
    public SW_StartShow = false;

    /**
     * 原生banner开关
     */
    public SW_NativeBannerSwitch = false;

    /**
     * 刷新广告条的计时器
     */
    public bannerUpdateInterval: any = null;

    /**
     * banner关闭的次数
     */
    private bannerCloseTime = 0;

    /**
     * 是否加载完Banner
     */
    private isLoadBanner = false;

    /**
     * 查询banner加载定时器
     */
    private loadBannerCheck = null;

    /**
     * 是否已经调用showBanner
     */
    public hasShowBanner: boolean = false;

    /**
     * 是否已经调用测试showBanner
     */
    public testBannerShow: boolean = false;

    /**
     * BannerController 单例
     */
    public static getInstance(): BannerController {
        if (!BannerController.instance) {
            BannerController.instance = new BannerController()
        }
        return BannerController.instance
    }


    /**
     * 创建系统Banner
     */
    public createSystemBanner() {
        if (!this.SW_SystemBannerSwitch) {
            console.log("ASCSDK", "系统Banner开关关闭");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                BannerOppo.getInstance().createSystemBanner(this.ID_BannerId);
                break;
            case Game_Platform.GP_Vivo:
                BannerVivo.getInstance().createSystemBanner(this.ID_BannerId);
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().createSystemBanner(this.ID_BannerId);
                break;
            case Game_Platform.GP_QQ:
                BannerQQ.getInstance().createSystemBanner(this.ID_BannerId);
                break;
            case Game_Platform.GP_WX:
                BannerWX.getInstance().createSystemBanner(this.ID_BannerId);
                break;
            case Game_Platform.GP_XIAOMI:
                BannerXM.getInstance().createSystemBanner(this.ID_BannerId);
                break;
            default:
                break;
        }

    }


    /**
     * 获取系统Banner是否加载成功
     */
    public getSystemBannerFlag(): boolean {
        return this.isLoadSystemeBanner;
    }

    checkLoadSucc() {
        console.log("ASCSDK,"+ "查询banner是否加载完成.");
        if (this.loadBannerCheck) {
            clearTimeout(this.loadBannerCheck);
        }
        if (this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch
            && (this.getSystemBannerFlag() || (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()))) {
            this.isLoadBanner = true;
            this.showBanner();
        } else if (this.SW_SystemBannerSwitch && !this.SW_NativeBannerSwitch && this.getSystemBannerFlag()) {
            this.isLoadBanner = true;
            this.showBanner();
        } else if (!this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch && (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag())) {
            this.isLoadBanner = true;
            this.showBanner();
        } else {
            console.log("ASCSDK,"+ "banner未加载完成");
            this.loadBannerCheck =
                setTimeout(() => {
                    this.checkLoadSucc();
                }, 5 * 1000)
        }
    }

    /**
     * 展示banner
     */
    public showBanner() {
        // 还不能显示banner和原生
        if (!this.SW_StartShow) {
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            if (NavigateController.getInstance().isNavigateSettleShow) {
                console.log("ASCSDK,"+ "测试结算互推正在展示,请先关闭测试结算互推再showBanner");
                return;
            }
            this.testBannerShow = true;
            BannerTest.getInstance().showBanner();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showBanner","calling_method_params":0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            jsb.reflection.callStaticMethod("AppController", "showBanner");
            return;
        }
        if (!this.isLoadBanner) {
            this.checkLoadSucc();
            return;
        }
        if (this.NUM_BannerMostShowTimes <= this.bannerCloseTime) {
            if (this.bannerUpdateInterval) {
                clearInterval(this.bannerUpdateInterval);
            };
            console.log("ASCSDK,"+ "banner展示次数(最大关闭次数)已达上限 return");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_Vivo:
                if (NavigateController.getInstance().isNavigateSettleShow) {
                    console.log("ASCSDK,"+ "结算互推正在展示,请先关闭结算互推再showBanner");
                    return;
                }
                this.hasShowBanner = true;
                if (this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch) {//两个开关都打开的情况
                    if (this.SW_SystemBannerFirst)//系统Banner优先
                    {
                        console.log("ASCSDK", "系统banner优先");
                        if (this.getSystemBannerFlag()) {
                            console.log("ASCSDK", "系统Banner可以展示");
                            this.showSystemBanner();
                        }
                        else {
                            console.log("ASCSDK,"+ "系统Banner没有加载完成");
                            if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                                console.log("ASCSDK,"+ "改为展示原生Banner");
                                this.showNativeBanner();
                            }
                        }
                    }
                    else {
                        console.log("ASCSDK", "原生banner优先");
                        if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                            console.log("ASCSDK", "原生Banner可以展示");
                            this.showNativeBanner();
                        }
                        else {
                            console.log("ASCSDK,"+ "原生Banner没有加载到");
                            if (this.getSystemBannerFlag()) {
                                console.log("ASCSDK,"+ "改为展示系统banner");
                                this.showSystemBanner();
                            }
                        }
                    }
                }
                else if (this.SW_SystemBannerSwitch)//只打开了系统banner开关的情况
                {
                    console.log("ASCSDK,"+ "只打开了系统Banner");
                    this.showSystemBanner();
                }
                else if (this.SW_NativeBannerSwitch)//只打开了原生banner的情况
                {
                    console.log("ASCSDK,"+ "只打开了原生Banner");
                    this.showNativeBanner();
                }
                else //两个banner开关都没有打开
                {
                    console.log("ASCSDK,"+ "系统banner开关和原生banner开关都没有打开");
                    return;
                }
                // 刷新Banner
                this.updateBanner();
                break;
            case Game_Platform.GP_Tiktok:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                }
                break;
            case Game_Platform.GP_WX:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                }
                break;
            case Game_Platform.GP_XIAOMI:
                {
                    if (this.SW_SystemBannerSwitch) {
                        this.showSystemBanner();
                        this.updateBanner();
                    }
                }
                break;
            default:
                break;
        }
    }


    /**
     * 展示系统Banner
    */
    public showSystemBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                BannerOppo.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_Vivo:
                BannerVivo.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_QQ:
                BannerQQ.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_WX:
                BannerWX.getInstance().showSystemBanner();
                break;
            case Game_Platform.GP_XIAOMI:
                BannerXM.getInstance().showSystemBanner();
                break;
            default:
                break;
        }
    }



    /**
     * 刷新banner
     */
    public updateBanner() {
        if (this.NUM_BannerMostShowTimes <= this.bannerCloseTime) {
            if (this.bannerUpdateInterval) {
                clearInterval(this.bannerUpdateInterval);
            };
            console.log("ASCSDK,"+ "banner展示次数(最大关闭次数)已达上限 return");
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
            case Game_Platform.GP_Vivo:
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                };
                // 刷新广告条
                this.bannerUpdateInterval = setInterval(() => {
                    if (this.NUM_BannerMostShowTimes <= this.bannerCloseTime) {
                        if (this.bannerUpdateInterval) {
                            clearInterval(this.bannerUpdateInterval);
                        };
                        console.log("ASCSDK,"+ "banner展示次数(最大关闭次数)已达上限 return");
                        return;
                    }
                    if (this.SW_SystemBannerSwitch && this.SW_NativeBannerSwitch) {//两个开关都打开的情况
                        if (this.SW_SystemBannerFirst)//系统Banner优先
                        {
                            console.log("ASCSDK", "系统banner优先");
                            if (this.getSystemBannerFlag()) {
                                console.log("ASCSDK", "刷新系统Banner");
                                Cocos3dUI.getInstance().hideNativeBannerUI();
                                this.updateSystemBanner();
                            }
                            else {
                                console.log("ASCSDK,"+ "系统Banner没有加载完成");
                                if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                                    console.log("ASCSDK,"+ "改为刷新原生Banner");
                                    if (BannerOppo.getInstance().bannerAd) {
                                        BannerOppo.getInstance().hideSystemBanner();
                                    }
                                    if (BannerVivo.getInstance().bannerAd) {
                                        BannerVivo.getInstance().hideSystemBanner();
                                    }
                                    this.updateNativeBanner();
                                }
                            }
                        }
                        else {
                            console.log("ASCSDK", "原生banner优先");
                            if (NativeController.getInstance().getIconNativeFlag() || NativeController.getInstance().getImageNativeFlag()) {
                                console.log("ASCSDK", "刷新原生Banner");
                                if (BannerOppo.getInstance().bannerAd) {
                                    BannerOppo.getInstance().hideSystemBanner();
                                }
                                if (BannerVivo.getInstance().bannerAd) {
                                    BannerVivo.getInstance().hideSystemBanner();
                                }
                                this.updateNativeBanner();
                            }
                            else {
                                console.log("ASCSDK,"+ "原生Banner没有加载到");
                                if (this.getSystemBannerFlag()) {
                                    console.log("ASCSDK,"+ "改为刷新系统banner");
                                    Cocos3dUI.getInstance().hideNativeBannerUI();
                                    this.updateSystemBanner();
                                }
                            }
                        }
                    }
                    else if (this.SW_SystemBannerSwitch)//只打开了系统banner开关的情况
                    {
                        console.log("ASCSDK", "只打开了系统Banner");
                        this.showSystemBanner();
                    }
                    else if (this.SW_NativeBannerSwitch)//只打开了原生banner的情况
                    {
                        console.log("ASCSDK", "只打开了原生Banner");
                        this.showNativeBanner();
                    }
                    else //两个banner都没有打开
                    {
                        console.log("ASCSDK", "系统banner开关和原生banner开关都没有打开")
                    }
                }, this.NUM_BannerUpdateTime * 1000);
                break;
            case Game_Platform.GP_Tiktok:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            case Game_Platform.GP_QQ:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            case Game_Platform.GP_WX:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            case Game_Platform.GP_XIAOMI:
                if (this.SW_SystemBannerSwitch) {
                    this.updateSystemBanner();
                }
                break;
            default:
                break;
        }
    }


    /**
     * 刷新系统banner
    */
    public updateSystemBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                BannerOppo.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_Vivo:
                BannerVivo.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_QQ:
                BannerQQ.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_WX:
                BannerWX.getInstance().updateSytemBanner();
                break;
            case Game_Platform.GP_XIAOMI:
                BannerXM.getInstance().updateSytemBanner();
                break;
            default:
                break;
        }

    }


    /**
     * 刷新原生banner
     */
    public updateNativeBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().updateNativeBanner();
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().updateNativeBanner();
                break;
            default:
                break;
        }
    }

    /**
     * 隐藏Banner
     */
    public hideBanner() {
        if (SdkTools.getPlatform() == Game_Platform.GP_Test) {
            this.testBannerShow = false;
            BannerTest.getInstance().hideBanner();
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_Android) {
            jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"hideBanner",'calling_method_params':0}`);
            return;
        }
        if (SdkTools.getPlatform() == Game_Platform.GP_IOS) {
            jsb.reflection.callStaticMethod("AppController", "hideBanner");
            return;
        }
        if (this.loadBannerCheck) {
            clearTimeout(this.loadBannerCheck);
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                this.hasShowBanner = false;
                // 存在则清除 banner刷新定时器
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                    this.bannerUpdateInterval = null;
                }
                BannerOppo.getInstance().hideSystemBanner();
                NativeOppo.getInstance().hideNativeBaner();
                break;
            case Game_Platform.GP_Vivo:
                // 存在则清除 banner刷新定时器
                if (this.bannerUpdateInterval) {
                    clearInterval(this.bannerUpdateInterval);
                    this.bannerUpdateInterval = null;
                }
                BannerVivo.getInstance().hideSystemBanner();
                NativeVivo.getInstance().hideNativeBaner();
                break;
            case Game_Platform.GP_Tiktok:
                BannerTiktok.getInstance().hideSystemBanner();
                break;
            case Game_Platform.GP_QQ:
                BannerQQ.getInstance().hideSystemBanner();
                break;
            case Game_Platform.GP_WX:
                BannerWX.getInstance().hideSystemBanner();
                break;
            case Game_Platform.GP_XIAOMI:
                BannerXM.getInstance().hideSystemBanner();
                break;
            default:
                break;
        }
    }

    /**
     * 展示原生Banner广告
     */
    public showNativeBanner() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                NativeOppo.getInstance().showNativeBanner();
                break;
            case Game_Platform.GP_Vivo:
                NativeVivo.getInstance().showNativeBanner();
                break;
            default:
                break;
        }
    }

    /**
     * Banner广告关闭统计
    */
    public bannerClose() {
        this.bannerCloseTime++;
        // var date = new Date();
        // var day = String(date.getFullYear()) + String(date.getDay() + 'banner');
        // SdkTools.saveData(day, String(this.bannerCloseTime));
    }

}

export default BannerController 