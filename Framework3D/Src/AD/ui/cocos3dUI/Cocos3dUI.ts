import SdkTools from "../../tools/SdkTools"
import NativeController from "../../ads/nativeAd/NativeController"
import BannerController from "../../ads/bannerAd/BannerController";
import UIController from "../UIController";
import NavigateController from "../../navigate/NavigateController";
import Network from "../../network/Network";
import NativeVivo from "../../ads/nativeAd/NativeVivo"
import NativeOppo from "../../ads/nativeAd/NativeOppo"
import IntersController from "../../ads/IntersAd/IntersController";

import {
    _decorator, Component, Node, CanvasComponent, SpriteComponent, UIOpacityComponent,
    SpriteFrame, director, loader, UITransformComponent, LabelComponent, Vec3
    , WidgetComponent, ButtonComponent, color, Color, tween, view, textureUtil,
} from "cc";


class Cocos3dUI {
    private static instance: Cocos3dUI

    /**
     * CocosCreator3d分组
     */
    public cocosGroup = "";

    /**
     * 原生Banner
     */
    public nativeBanner = null;

    /**
     * 原生Icon
     */
    public nativeIcon = null

    /**
     * 原生大图
     */
    public nativeImage = null;

    /**
     * 互推ICON刷新定时器
     */
    public navigateIconTimeInterval = null;

    /**
     * 互推游戏的信息
     */
    public navigateInfom: any = null;

    /**
     * 互推ICON的背景
     */
    public navigateBg: any = null;

    /**
     * 互推列表的背景
     */
    public navigateGroupBg: any = null;

    /**
     * 结算互推的背景
     */
    public navigateSettleBg: any = null;

    /**
     * SDK画布
     */
    public sdkCanvas: any = null;

    /**
     * banner测试UI
     */
    public bannerUI: any = null;
    /**
     * banner测试背景图
     */
    public bannerFakeBg: any = null;

    /**
     * Cocos3dUI 单例
     */
    public static getInstance(): Cocos3dUI {
        if (!Cocos3dUI.instance) {
            Cocos3dUI.instance = new Cocos3dUI()
        }
        return Cocos3dUI.instance
    }

    /**
     * 获取SDK画布
     */
    public getsdkCanvas() {
        if (!this.sdkCanvas || this.sdkCanvas === undefined || !this.sdkCanvas.parent) {
            var scene = director.getScene();
            Cocos3dUI.instance.sdkCanvas = new Node("sdkCanvas");
            this.sdkCanvas.addComponent(UITransformComponent);
            this.sdkCanvas.addComponent(CanvasComponent);
            this.sdkCanvas.getComponent(CanvasComponent).priority = 1000;
            scene.addChild(this.sdkCanvas);
        }
        return this.sdkCanvas;
    }

    /**
     * 设置分组
     */
    public setGroup(group: string) {
        this.cocosGroup = group;
    }

    // 加载图片资源
    public loadImageArr(arr, callback) {

        var spFrameArr = new Array();
        var arrNumber = 0;
        for (let i = 0; i < arr.length; i++) {
            textureUtil.loadImage(arr[i], (err, imagetexture) => {
                if (err) {
                    console.log(arr[i], "加载错误", err);
                    callback(true, null);
                    return;
                }
                var spFrame = new SpriteFrame();
                spFrame.texture = imagetexture._texture;
                spFrameArr[i] = spFrame;
                arrNumber++;
                if (arrNumber >= arr.length) {
                    callback(false, spFrameArr);
                }
            });
        }
    }

    /**
     * 加载原生插屏UI资源
     */
    public loadNativeInstersRes() {
        console.log("ASCSDK", "开始加载原生插屏资源")

        UIController.getInstance().NIUIInfo =
        {
            layerBg: null,
            bg: null,
            button: null,
            exit: null,
            mask: null
        }

        var urlList = [
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/layerBg.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/nativeIntersBg.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/touchButton.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/nativeClose.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIntersRes/mask.png"
        ];

        this.loadImageArr(urlList, (err, texture) => {
            if (err) {
                console.log("ASCSDK" + "原生插屏资源加载错误" + JSON.stringify(err));
                if (UIController.getInstance().nativeIntersErrorTimes < 5) {
                    UIController.getInstance().nativeIntersErrorTimes++;
                    this.loadNativeInstersRes();
                }
                return;
            }
            UIController.getInstance().isLoadNIUI = true;
            UIController.getInstance().NIUIInfo.layerBg = texture[0];
            UIController.getInstance().NIUIInfo.bg = texture[1];
            UIController.getInstance().NIUIInfo.button = texture[2];
            UIController.getInstance().NIUIInfo.exit = texture[3];
            UIController.getInstance().NIUIInfo.mask = texture[4];
            console.log("ASCSDK", "Cocos3d 原生插屏资源加载成功");
        });
    }

    /**
     * 加载原生bannerUI资源
     */
    public loadNativeBannerRes() {
        console.log("ASCSDK", "Cocos3d 开始加载原生Banner资源")
        UIController.getInstance().NativeBannerUIInfo =
        {
            bannerBg: null,
            bannerButton: null,
            bannerClose: null,
            bannerTip: null,
        }

        var urlList = [
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/newNativeBanner.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/nativeBannerButton.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/nativeBannerClose.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/nativeBannerTip.png",
        ];

        this.loadImageArr(urlList, (err, texture) => {
            if (err) {
                console.log("ASCSDK", "原生Banner资源加载错误" + JSON.stringify(err));
                if (UIController.getInstance().nativeBannerErrorTimes < 5) {
                    UIController.getInstance().nativeBannerErrorTimes++;
                    this.loadNativeBannerRes();
                }
                return;
            }
            UIController.getInstance().NativeBannerUIInfo.bannerBg = texture[0];
            UIController.getInstance().NativeBannerUIInfo.bannerButton = texture[1];
            UIController.getInstance().NativeBannerUIInfo.bannerClose = texture[2];
            UIController.getInstance().NativeBannerUIInfo.bannerTip = texture[3];
            UIController.getInstance().isLoadNativeBannerUI = true;
            console.log("ASCSDK", "原生Banner资源加载成功");
        });
    }

    /**
     * 加载原生ICON广告角标UI资源
     */
    public loadNativeIconRes() {
        console.log("ASCSDK", "开始加载原生广告角标资源");
        UIController.getInstance().ICONInfo =
        {
            iconButton: null,
            iconClose: null
        }

        var urlList = [
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeIconRes/ICONAd.png",
            "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NativeBannerRes/nativeBannerClose.png",
        ];

        this.loadImageArr(urlList, (err, texture) => {
            if (err) {
                console.log("ASCSDK", "原生广告角标资源加载错误" + JSON.stringify(err));
                if (UIController.getInstance().nativeIconErrorTimes < 5) {
                    UIController.getInstance().nativeIconErrorTimes++;
                    this.loadNativeIconRes();
                }
                return;
            }
            UIController.getInstance().ICONInfo.iconButton = texture[0];
            UIController.getInstance().ICONInfo.iconClose = texture[1];
            UIController.getInstance().isLoadIconTip = true;
            console.log("ASCSDK", "原生广告角标UI资源加载成功");
        });
    }

    /**
     * 加载互推ICON资源
     */
    public loadNavigateIconRes() {
        console.log('ASCSDK', '开始加载互推ICON资源');
        UIController.getInstance().navigateUITextures = {
            maskTexture: null,
            bgTexture: null,
            moreGameTexture: null
        }
        var iconUIUrlList =
            [
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconMask.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/morgametitle.png"
            ]
        this.loadImageArr(iconUIUrlList, (err, texture) => {
            if (err) {
                console.log("ASCSDK", "互推ICON资源加载错误" + JSON.stringify(err));
                return;
            }
            UIController.getInstance().isLoadNavigateIcon = true;
            console.log("ASCSDK", "互推ICON资源加载成功");
            UIController.getInstance().navigateUITextures.maskTexture = texture[0];
            UIController.getInstance().navigateUITextures.bgTexture = texture[1];
            UIController.getInstance().navigateUITextures.moreGameTexture = texture[2];
        });
        this.loadNavigateList();
    }

    /**
     * 加载互推列表资源
     */
    public loadNavigateGroup() {
        console.log("ASCSDK", "开始加载互推列表资源");
        UIController.getInstance().navigateGroupUITextures = {
            groupHTexture: null,
            groupVTexture: null,
            leftTexture: null,
            maskTexture: null,
            moreGameTitleTexture: null,
            redTexture: null,
            rightTexture: null
        }
        var iconUIUrlList =
            [
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateGroupRes/groupH.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateGroupRes/groupV.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateGroupRes/left.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateGroupRes/mask.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateGroupRes/moreGameTitle.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateGroupRes/red.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateGroupRes/right.png"
            ]


        this.loadImageArr(iconUIUrlList, (err, texture) => {
            if (err) {
                console.log("ASCSDK", "互推列表资源加载错误", JSON.stringify(err));
                return;
            }
            UIController.getInstance().isLoadNavigateGroup = true;
            console.log("ASCSDK", "互推列表资源加载成功");
            UIController.getInstance().navigateGroupUITextures.groupHTexture = texture[0];
            UIController.getInstance().navigateGroupUITextures.groupVTexture = texture[1];
            UIController.getInstance().navigateGroupUITextures.leftTexture = texture[2];
            UIController.getInstance().navigateGroupUITextures.maskTexture = texture[3];
            UIController.getInstance().navigateGroupUITextures.moreGameTitleTexture = texture[4];
            UIController.getInstance().navigateGroupUITextures.redTexture = texture[5];
            UIController.getInstance().navigateGroupUITextures.rightTexture = texture[6];
        });
        this.loadNavigateList();
    }

    /**
     * 加载结算互推资源
     */
    public loadNavigateSettleRes() {
        console.log("ASCSDK", "开始加载结算互推资源");
        UIController.getInstance().navigateSettleUITextures = {
            navigateSettleGroup: null,
            navigateSettletitleBg: null,
            mask: null,
            iconWihte: null
        }
        var settleUIUrlList =
            [
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/navigateSettleGroup.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/navigateSettletitleBg.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/settleIcon.png",
                "https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateSettleRes/iconWihte.png"
            ]
        this.loadImageArr(settleUIUrlList, (err, texture) => {
            if (err) {
                console.log("ASCSDK", "结算互推资源加载错误" + JSON.stringify(err));
                return;
            }
            UIController.getInstance().isLoadNavigateSettle = true;
            console.log("ASCSDK", "结算互推资源加载成功");
            UIController.getInstance().navigateSettleUITextures.navigateSettleGroup = texture[0];
            UIController.getInstance().navigateSettleUITextures.navigateSettletitleBg = texture[1];
            UIController.getInstance().navigateSettleUITextures.mask = texture[2];
            UIController.getInstance().navigateSettleUITextures.iconWihte = texture[3];
        });
        this.loadNavigateList();
    }

    /**
     * 加载互推游戏资源列表
     */
    public loadNavigateList() {
        let navigateListNum = 0;
        let navigateList = NavigateController.getInstance().navigateList;
        for (let i = 0; i < navigateList.length; i++) {
            loader.load(navigateList[i].pushGamePicture, (err, texture) => {
                if (err) {
                    console.log("ASCSDK", "互推游戏资源", `icon${i}加载失败`);
                    loader.load('https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/noIconImage.png', (err, texture) => {
                        navigateListNum++;
                        if (err) {
                            UIController.getInstance().NavigateIconTextureList[i] = null;
                        }
                        else {
                            UIController.getInstance().NavigateIconTextureList[i] = texture._texture;
                            if (navigateListNum >= navigateList.length) {
                                UIController.getInstance().isLoadNavigateList = true;
                            }
                        }
                    });
                }
                else {
                    UIController.getInstance().NavigateIconTextureList[i] = texture._texture;
                    navigateListNum++;
                    if (navigateListNum >= navigateList.length) {
                        UIController.getInstance().isLoadNavigateList = true;
                    }
                }
            });
        }
    }

    /**
     * 展示原生插屏
     * @param nativeInfo 原生信息
     * @param uiInfo     ui资源
     */
    showNativeIntersUI(nativeInfo, uiInfo) {
        console.log("ASCSDK", "showNativeInters===========================")

        //原生插屏背景组件
        let layerBg = new Node("layerBg");
        layerBg.addComponent(SpriteComponent);
        layerBg.addComponent(UIOpacityComponent);
        layerBg.addComponent(UITransformComponent);
        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = uiInfo.layerBg;
        //console.log("uiInfo.layerBg" + JSON.stringify(uiInfo.layerBg))
        //console.log("nativeInfo.Native_BigImage" +　JSON.stringify(nativeInfo.Native_BigImage))
        layerBg.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        layerBg.active = false;
        setTimeout(() => {
            layerBg.width = 2560;
            layerBg.height = 2560;
            layerBg.setPosition(0, 0, 0);
            layerBg.getComponent(UIOpacityComponent).opacity = 150;
        }, 0.5);
        layerBg.setSiblingIndex(20000);
        layerBg.attr({ adId: nativeInfo.adId });
        this.getsdkCanvas().addChild(layerBg);

        if (this.cocosGroup != '') {
            layerBg.group = this.cocosGroup;
        }
        layerBg.on(Node.EventType.TOUCH_START, function (event) {
        })

        // 插屏可点击区域背景
        let bg = new Node("bg");
        bg.addComponent(SpriteComponent);
        bg.addComponent(UITransformComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = uiInfo.bg;
        bg.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        bg.setSiblingIndex(20010);

        // 竖版
        if (cc.winSize.width < cc.winSize.height) {
            setTimeout(() => {
                bg.width = cc.winSize.width - 100;
                bg.height = bg.width * 0.89;
                bg.setPosition(0, 100, 0);
            }, 1);
            this.getsdkCanvas().addChild(bg);

            if (this.cocosGroup != '') {
                bg.group = this.cocosGroup;
            }

            // 查看广告按钮
            var button = new Node("button");
            button.addComponent(SpriteComponent);
            button.addComponent(UITransformComponent);
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = uiInfo.button;
            button.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            setTimeout(() => {
                button.width = bg.width - 200;
                button.height = button.width * 0.382;
                button.setPosition(bg.position.x, bg.position.y - bg.height / 2 - button.height / 2 - 30, 0);
            }, 1);
            button.setSiblingIndex(20010);
            this.getsdkCanvas().addChild(button);

            if (this.cocosGroup != '') {
                button.group = this.cocosGroup;
            }

            let tempid = nativeInfo.adId
            //点击原生插屏上报
            button.on(Node.EventType.TOUCH_START, function (event) {
                NativeController.getInstance().reportNativeClick(tempid)
            });
        }
        else { //横版
            setTimeout(() => {
                bg.height = cc.winSize.height - 200;
                bg.width = bg.height / 0.89;
                bg.setPosition(0, 0, 0);
            }, 1);
            this.sdkCanvas.addChild(bg);
            if (this.cocosGroup != '') {
                bg.group = this.cocosGroup;
            }
        }
        let tempid = nativeInfo.adId
        //点击原生插屏上报
        bg.on(Node.EventType.TOUCH_START, function (event) {
            NativeController.getInstance().reportNativeClick(tempid)
        });

        // 插屏标题文字
        let titleLabel = new Node("titleLabel");
        titleLabel.addComponent(LabelComponent);
        titleLabel.addComponent(UITransformComponent);
        titleLabel.getComponent(LabelComponent).fontSize = 30;
        titleLabel.getComponent(LabelComponent).string = nativeInfo.title;
        titleLabel.getComponent(LabelComponent).color = color(0xCC, 0x7C, 0x70);
        bg.addChild(titleLabel);

        // 如果加载原生大图
        if (NativeController.getInstance().getImageNativeFlag()) {
            console.log("ASCSDK", "VIVO 原生插屏广告大图优先")
            let descLabel = new Node("descLabel");
            descLabel.addComponent(LabelComponent);
            descLabel.getComponent(LabelComponent).string = nativeInfo.desc;
            descLabel.getComponent(LabelComponent).fontSize = 30;
            descLabel.getComponent(LabelComponent).color = color(0x99, 0x7C, 0x70);
            bg.addChild(descLabel);

            // 原生大图
            let bigImage = new Node("icon");
            bigImage.addComponent(SpriteComponent);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = nativeInfo.Native_BigImage;
            bigImage.getComponent(SpriteComponent).spriteFrame = spriteFrame;

            // 设置标题、描述、图片大小位置
            setTimeout(() => {
                titleLabel.setPosition(titleLabel.position.x, bg.height / 2 - titleLabel.height / 2 - bg.height * 0.15, 0);
                descLabel.setPosition(0, bg.height * 0.22, 0);
                bigImage.width = bg.height * 0.8;
                bigImage.height = bg.height * 0.4;
                bigImage.setPosition(0, bg.height * -0.085, 0);
            }, 1);
            bg.addChild(bigImage);
        }
        // 未加载到原生大图 而加载到原生ICON
        else if (NativeController.getInstance().getIconNativeFlag()) {
            console.log("ASCSDK", "VIVO 原生插屏广告ICON展示")
            // 文字描述
            let descLabel = new Node("descLabel");
            descLabel.addComponent(LabelComponent);
            descLabel.getComponent(LabelComponent).string = nativeInfo.desc;
            descLabel.getComponent(LabelComponent).fontSize = 30;
            descLabel.getComponent(LabelComponent).color = color(0x00, 0x00, 0x00);
            bg.addChild(descLabel);

            // 原生ICON图片
            let icon = new Node("icon");
            icon.addComponent(SpriteComponent);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = nativeInfo.Native_icon;
            icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            bg.addChild(icon);

            // 设置标题、描述、图片大小位置
            setTimeout(() => {
                titleLabel.setPosition(titleLabel.position.x, bg.height / 2 - titleLabel.height / 2 - bg.height * 0.15, 0);
                descLabel.setPosition(0, -bg.height * 0.33, 0);
                icon.height = bg.height * 0.55;
                icon.width = icon.height;
                icon.setPosition(0, 0, 0);
            }, 1);
        }

        let exit = new Node("exit");
        exit.addComponent(SpriteComponent);
        exit.addComponent(UITransformComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = uiInfo.exit;
        exit.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        exit.setSiblingIndex(20010);

        setTimeout(() => {
            exit.setPosition(bg.width / 2 - exit.width / 2 * 1.25 * bg.width / 914 - bg.width * 0.07, bg.height / 2 - exit.width / 2 * 1.25 * bg.width / 914 - bg.width * 0.07, 0);
            exit.scale = new Vec3(bg.width / 914 * 0.8, bg.width / 914 * 0.8, bg.width / 914 * 0.8);
        }, 1);
        bg.addChild(exit);

        let self = this;
        //关闭按钮
        exit.on(Node.EventType.TOUCH_START, function (event) {
            IntersController.getInstance().intersNowTime = 0;
            self.getsdkCanvas().removeChild(layerBg);
            self.getsdkCanvas().removeChild(bg);
            self.getsdkCanvas().removeChild(button);
            // 防止事件冒泡
            event.stopPropagation();
        });
    }


    /**
     * 展示BannerUI
     */
    public showNativeBannerUI(nativeInfo, uiInfo) {
        if (this.nativeBanner) {
            console.log("ASCSDK", "已存在原生banner,return");
            return;
        }
        // 原生广告id
        let tempid = nativeInfo.adId

        NativeController.getInstance().reportNativeShow(tempid);

        console.log('ASCSDK', 'showNativeBanner ========================')

        // 原生banner背景
        this.nativeBanner = new Node("nativeBanner");
        this.nativeBanner.addComponent(SpriteComponent);
        this.nativeBanner.addComponent(WidgetComponent);
        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = uiInfo.bannerBg;
        this.nativeBanner.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        this.nativeBanner.getComponent(WidgetComponent).isAlignHorizontalCenter = true;
        this.nativeBanner.scale = new Vec3(0, 0, 0);
        setTimeout(() => {
            // 横版
            if (cc.winSize.width < cc.winSize.height) {
                this.nativeBanner.width = cc.winSize.width;
                this.nativeBanner.height = cc.winSize.width * 0.18;
            } else { // 竖版
                this.nativeBanner.width = cc.winSize.width / 2;
                this.nativeBanner.height = this.nativeBanner.width * 0.18;
            }
            this.nativeBanner.scale = new Vec3(1, 1, 1);
            this.nativeBanner.setPosition(this.nativeBanner.position.x, -cc.winSize.height / 2 + this.nativeBanner.height / 2, 0);
        }, 1);

        var resolution = JSON.stringify(view.getResolutionPolicy())
        var viewScaleHeight = JSON.parse(resolution)._contentStrategy._result.viewport.height
        if (typeof viewScaleHeight != 'undefined' && viewScaleHeight && viewScaleHeight != SdkTools.getInstance().getSystemInfo().screenHeight && cc.winSize.height > cc.winSize.width && SdkTools.getInstance().getSystemInfo().screenHeight != 0) {
            var viewScale = viewScaleHeight / cc.winSize.height;
            this.nativeBanner.setPosition(0, this.nativeBanner.height / 2 - (SdkTools.getInstance().getSystemInfo().screenHeight - viewScaleHeight) / 2 / viewScale, 0);
        }
        this.nativeBanner.setSiblingIndex(29999);
        this.getsdkCanvas().addChild(this.nativeBanner);

        //点击原生banner广告
        this.nativeBanner.on(Node.EventType.TOUCH_START, function (event) {
            NativeController.getInstance().reportNativeClick(tempid)
        });

        if (this.cocosGroup != '') {
            this.nativeBanner.group = this.cocosGroup;
        }

        // 广告角标
        var adTip = new Node("adTip");
        adTip.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = uiInfo.bannerTip;
        adTip.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        this.nativeBanner.addChild(adTip);

        // banner可点击区域
        var bannerButton = new Node("bannerButton");
        bannerButton.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = uiInfo.bannerButton;
        bannerButton.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        // 设置广告角标和banner点击安装按钮大小位置
        setTimeout(() => {
            adTip.height = 0.2 * this.nativeBanner.height;
            adTip.width = adTip.height / 0.45;
            adTip.setPosition(this.nativeBanner.width / 2 - adTip.width / 2, this.nativeBanner.height / 2 - adTip.height / 2, 0);
            bannerButton.width = this.nativeBanner.width * 0.255;
            bannerButton.height = bannerButton.width * 0.351;
            bannerButton.setPosition(this.nativeBanner.width / 2 - this.nativeBanner.width * 0.185, 0, 0);
        }, 1);

        this.nativeBanner.addChild(bannerButton);

        if (NativeController.getInstance().getImageNativeFlag()) {
            var image = new Node("image");
            image.addComponent(SpriteComponent);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = nativeInfo.Native_BigImage;
            image.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            setTimeout(() => {
                image.height = this.nativeBanner.height;
                image.width = image.height * 2;
                image.setPosition(-this.nativeBanner.width / 2 + image.width / 2, 0, 0);
            }, 1);
            this.nativeBanner.addChild(image);

            // 描述文字
            var titleLabel = new Node("titleLabel");
            titleLabel.addComponent(LabelComponent);
            titleLabel.getComponent(LabelComponent).fontSize = 25;
            if (nativeInfo.desc == "") {
                titleLabel.getComponent(LabelComponent).string = nativeInfo.title;
            } else {
                titleLabel.getComponent(LabelComponent).string = nativeInfo.desc;
            }
            setTimeout(() => {
                titleLabel.width = this.nativeBanner.width - image.width - bannerButton.width - 0.2 * this.nativeBanner.height / 0.45;
                titleLabel.height = this.nativeBanner.height;
                titleLabel.setPosition(-this.nativeBanner.width / 2 + this.nativeBanner.height * 2.2 + titleLabel.width / 2, 0, 0)
            }, 1);
            titleLabel.getComponent(LabelComponent).overflow = 1;
            titleLabel.getComponent(LabelComponent).horizontalAlign = 0;
            titleLabel.getComponent(LabelComponent).verticalAlign = 1;
            titleLabel.getComponent(LabelComponent).color = color(0xFF, 0x00, 0x00);
            this.nativeBanner.addChild(titleLabel);

        } else if (NativeController.getInstance().getIconNativeFlag()) {
            var icon = new Node("icon");
            icon.addComponent(SpriteComponent);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = nativeInfo.Native_icon;
            icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            setTimeout(() => {
                icon.width = this.nativeBanner.height * 0.8;
                icon.height = this.nativeBanner.height * 0.8;
                icon.setPosition(-this.nativeBanner.width / 2 + icon.width * 0.8, 0, 0);
            }, 1);
            this.nativeBanner.addChild(icon);

            // 描述文字
            var titleLabel = new Node("titleLabel");
            titleLabel.addComponent(LabelComponent);
            titleLabel.getComponent(LabelComponent).fontSize = 25;
            if (nativeInfo.desc == "") {
                titleLabel.getComponent(LabelComponent).string = nativeInfo.title;
            } else {
                titleLabel.getComponent(LabelComponent).string = nativeInfo.desc;
            }
            setTimeout(() => {
                titleLabel.width = this.nativeBanner.width - this.nativeBanner.height * 1.5 - bannerButton.width / 2 - (this.nativeBanner.width / 2 - bannerButton.position.x);
                titleLabel.height = this.nativeBanner.height;
                titleLabel.setPosition(-this.nativeBanner.width / 2 + this.nativeBanner.height * 1.5 + titleLabel.width / 2, 0, 0)
            }, 1);
            titleLabel.getComponent(LabelComponent).overflow = 1;
            titleLabel.getComponent(LabelComponent).horizontalAlign = 0;
            titleLabel.getComponent(LabelComponent).verticalAlign = 1;
            titleLabel.getComponent(LabelComponent).color = color(0xFF, 0x00, 0x00);
            this.nativeBanner.addChild(titleLabel);
        }

        // 关闭图片
        var closeICON = new Node("closeICON");
        closeICON.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = uiInfo.bannerClose;
        closeICON.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        this.nativeBanner.addChild(closeICON);

        // 关闭按钮
        var closeButton = new Node("closeButton");
        closeButton.addComponent(SpriteComponent);
        closeButton.addComponent(ButtonComponent);
        closeButton.addComponent(UITransformComponent);
        closeButton.setSiblingIndex(29999);
        this.nativeBanner.addChild(closeButton);

        setTimeout(() => {
            closeICON.width = 0.27 * this.nativeBanner.height;
            closeICON.height = 0.27 * this.nativeBanner.height;
            closeICON.setPosition(-this.nativeBanner.width / 2 + closeICON.width / 2, this.nativeBanner.height / 2 - closeICON.height / 2, 0);
            closeButton.width = closeICON.width;
            closeButton.height = closeICON.height;
            closeButton.setPosition(-this.nativeBanner.width / 2 + closeICON.width / 2, this.nativeBanner.height / 2 - closeICON.height / 2, 0);
        }, 1);

        // 监听原生banner关闭
        closeButton.on(Node.EventType.TOUCH_START, function (event) {
            let bannerController = BannerController.getInstance();
            console.log("ASCSDK", "原生banner关闭", bannerController.NUM_BannerUpdateTime + "S后再次刷新");
            NativeController.getInstance().hideNativeBanner();
            // 广告关闭统计
            bannerController.bannerClose();
            bannerController.updateBanner();
            // 清除触摸事件的冒泡
            event.stopPropagation();
        });

    }
    /**
     *  隐藏原生Banner
     */
    public hideNativeBannerUI() {
        if (this.nativeBanner) {
            this.nativeBanner.removeFromParent();
            this.nativeBanner = null;
            console.log("ASCSDK", "hideNativeBanner===========================");
        } else {
            console.log("ASCSDK", "不存在原生Banner")
        }
    }


    /**
     *  展示原生ICON
     */
    public showNativeIconUI(width, height, x, y, nativeInfo, iconUIInfo) {

        console.log("ASCSDK", "showNativeIcon===========================");

        // 原生ICON图片
        this.nativeIcon = new Node("icon");
        this.nativeIcon.addComponent(SpriteComponent);
        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = nativeInfo.Native_icon;
        this.nativeIcon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        this.nativeIcon.scale = new Vec3(0, 0, 0);
        setTimeout(() => {
            this.nativeIcon.width = width;
            this.nativeIcon.height = height;
            this.nativeIcon.setPosition(x, y, 0);
            this.nativeIcon.scale = new Vec3(1, 1, 1);
        }, 1);
        this.getsdkCanvas().addChild(this.nativeIcon);

        if (this.cocosGroup != '') {
            this.nativeIcon.group = this.cocosGroup;
        }

        // 广告角标
        var ICONTip = new Node("ICONInfo");
        ICONTip.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = iconUIInfo.iconButton;
        ICONTip.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        setTimeout(() => {
            ICONTip.width = width / 3;
            ICONTip.height = ICONTip.width / 70 * 34;
            ICONTip.setPosition(width / 2 - ICONTip.width / 2, height / 2 - ICONTip.height / 2, 0);
        }, 1);
        this.nativeIcon.addChild(ICONTip);

        var ICONClose = new cc.Node("ICONClose");
        ICONClose.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = iconUIInfo.iconClose;
        ICONClose.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        setTimeout(() => {
            ICONClose.width = 45;
            ICONClose.height = 45;
            ICONClose.setPosition(-this.nativeIcon.width / 2 + ICONClose.width / 2, this.nativeIcon.height / 2 - ICONClose.width / 2, 0);
        }, 1);
        this.nativeIcon.addChild(ICONClose);

        // 标题文字
        var titleLabel = new Node("titleLabel");
        titleLabel.addComponent(LabelComponent);
        titleLabel.getComponent(LabelComponent).fontSize = 20;
        titleLabel.getComponent(LabelComponent).string = nativeInfo.title;
        titleLabel.getComponent(LabelComponent).color = color(0xFF, 0xFF, 0xFF);
        setTimeout(() => {
            titleLabel.setPosition(titleLabel.position.x, -height / 2 - 30, 0);
        }, 1);
        this.nativeIcon.addChild(titleLabel);

        let self = this;
        //关闭原生ICON广告
        ICONClose.on(Node.EventType.TOUCH_START, function (event) {
            console.log("ASCSDK", "手动关闭原生ICON");
            self.nativeIcon.removeFromParent();
            event.stopPropagation();
        })

        //点击原生ICON广告上报
        let tempid = nativeInfo.adId
        this.nativeIcon.on(Node.EventType.TOUCH_START, function (event) {
            NativeController.getInstance().reportNativeClick(tempid)
        });
    }
    /**
     * 隐藏原生ICON
     */
    public hideNativeIconUI() {
        if (this.nativeIcon) {
            this.nativeIcon.removeFromParent();
            this.nativeIcon = null;
            console.log("ASCSDK", "hideNativeIcon===========================")
        }
        else {
            console.log("ASCSDK", "不存在原生ICON");
            return;
        }
    }


    /**
     *  展示原生大图
     */
    public showNativeImageUI(width, height, x, y, nativeInfo, iconUIInfo) {

        console.log("ASCSDK", "showNativeImage===========================");

        this.nativeImage = new Node("nativeImage");
        this.nativeImage.addComponent(SpriteComponent);
        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = nativeInfo.Native_BigImage;
        this.nativeImage.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        this.nativeImage.scale = new Vec3(0, 0, 0);
        this.nativeImage.setSiblingIndex(30000);
        setTimeout(() => {
            this.nativeImage.width = width;
            this.nativeImage.height = height;
            this.nativeImage.setPosition(x, y, 0);
            this.nativeImage.scale = new Vec3(1, 1, 1);
        }, 1);
        this.getsdkCanvas().addChild(this.nativeImage);

        if (this.cocosGroup != '') {
            this.nativeImage.group = this.cocosGroup;
        }

        var ICONTip = new Node("ICONInfo");
        ICONTip.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = iconUIInfo.iconButton;
        ICONTip.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        setTimeout(() => {
            ICONTip.width = width / 5;
            ICONTip.height = ICONTip.width / 70 * 34;
            ICONTip.setPosition(width / 2 - ICONTip.width / 2, height / 2 - ICONTip.height / 2, 0);
        }, 1);
        this.nativeImage.addChild(ICONTip);

        var ICONClose = new cc.Node("ICONClose");
        ICONClose.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = iconUIInfo.iconClose;
        ICONClose.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        setTimeout(() => {
            ICONClose.width = 45;
            ICONClose.height = 45;
            ICONClose.setPosition(-this.nativeImage.width / 2 + ICONClose.width / 2, this.nativeImage.height / 2 - ICONClose.width / 2, 0);
        }, 1);
        this.nativeImage.addChild(ICONClose);

        let self = this;
        //关闭原生大图广告
        ICONClose.on(Node.EventType.TOUCH_START, function (event) {
            console.log("ASCSDK", "手动关闭原生大图");
            self.nativeImage.removeFromParent();
            event.stopPropagation();
        })

        //点击原生广告
        let tempid = nativeInfo.adId
        this.nativeImage.on(Node.EventType.TOUCH_START, function (event) {
            console.log("ASCSDK", "点击原生大图");
            NativeController.getInstance().reportNativeClick(tempid)
        });

    }
    /**
     * 隐藏原生大图
     */
    public hideNativeImageUI() {
        if (this.nativeImage) {
            this.nativeImage.removeFromParent();
            this.nativeImage = null;
            console.log("ASCSDK", "hideNativeImage===========================")
        }
        else {
            console.log("ASCSDK", "不存在原生大图 return");
            return;
        }
    }


    /**
     * 展示互推ICON
     */
    public showNavigateIcon(width, height, x, y) {

        if (this.navigateBg) {
            console.log("ASCSDK", "已存在互推ICON return");
        }

        console.log("ASCSDK", "showNavigateIcon===========================")
        var self = this;

        // 互推背景
        this.navigateBg = new Node("navigateBg");
        this.navigateBg.addComponent(SpriteComponent);
        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = UIController.getInstance().navigateUITextures.bgTexture
        this.navigateBg.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        this.navigateBg.scale = new Vec3(0, 0, 0);
        setTimeout(() => {
            this.navigateBg.width = width;
            this.navigateBg.height = height;
            this.navigateBg.setPosition(x, y, 0);
        }, 0.5);
        this.navigateBg.setSiblingIndex(29999);
        this.getsdkCanvas().addChild(this.navigateBg);

        this.navigateBg.on(Node.EventType.TOUCH_START, function (event) {
            self.jumpToMiniGame(self.navigateInfom);
        });

        if (this.cocosGroup != '') {
            this.navigateBg.group = this.cocosGroup;
        }

        // 互推ICON图
        var navigateIconImage = new Node("image");
        navigateIconImage.addComponent(SpriteComponent);
        this.navigateBg.addChild(navigateIconImage);

        // 更多游戏标题图片
        var title = new Node("title");
        title.addComponent(SpriteComponent);
        spriteFrame = new SpriteFrame();
        spriteFrame.texture = UIController.getInstance().navigateUITextures.moreGameTexture;
        title.getComponent(SpriteComponent).spriteFrame = spriteFrame;
        setTimeout(() => {
            navigateIconImage.width = this.navigateBg.width;
            navigateIconImage.height = this.navigateBg.height;
            title.width = width * 0.84;
            title.height = height * 0.19;
            title.setPosition(0, - navigateIconImage.height / 2 + title.height / 2, 0);
            this.navigateBg.scale = new Vec3(1, 1, 1);
        }, 1);
        this.navigateBg.addChild(title);

        // 刷新互推ICON
        var iconupdate = function () {
            if (!navigateIconImage) {
                console.log("ASCSDK", 'no image');
                return;
            }
            var texture = self.updateNavigateIcon();
            console.log("ASCSDK", "texture:" + texture);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            navigateIconImage.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            setTimeout(() => {
                navigateIconImage.width = width;
                navigateIconImage.height = height;
            }, 1);
        }
        iconupdate();
        // 刷新互推ICON
        this.navigateIconTimeInterval = setInterval(iconupdate, 30 * 1000);
    }
    /**
     * 刷新互推ICON
     */
    private updateNavigateIcon() {
        console.log("ASCSDK", "updateNavigateIcon===========================")
        var NavigateList = NavigateController.getInstance().navigateList;
        var allWeight = 0;
        for (var i = 0; i < NavigateList.length; i++) {
            if (NavigateList[i].sort > 0) {
                allWeight += NavigateList[i].sort;
            }
        }

        var random = Math.floor(Math.random() * allWeight);
        var weightNow = 0;
        let inform = null;
        let index = 0;
        for (let i = 0; i < NavigateList.length; i++) {
            if (NavigateList[i].sort == 0) continue;
            if (random >= weightNow && random < weightNow + NavigateList[i].sort) {
                inform = NavigateList[i];
                index = i;
                console.log("ASCSDK", 'weight', random, NavigateList[i].pushGamePackage);
            }
            weightNow += NavigateList[i].sort;
        }
        if (inform) {
            this.navigateInfom = inform;
            return UIController.getInstance().NavigateIconTextureList[index];
        }
    }
    /**
     * 隐藏互推ICON
     * @param inform 
     */
    public hideNavigateIcon() {
        console.log("ASCSDK", "hideNavigateIcon===========================")
        if (this.navigateBg) {
            this.navigateBg.removeFromParent();
            this.navigateBg = null;
        }
        this.navigateIconTimeInterval && clearInterval(this.navigateIconTimeInterval);
    }

    /**
     * 展示互推列表
     */
    public showNavigateGroup(type: string, side: string) {
        if (this.navigateGroupBg) {
            console.log("ASCSDK", "存在互推列表 return");
            return;
        }

        if (!UIController.getInstance().isLoadNavigateGroup) {
            console.log("ASCSDK", "互推列表未加载到 return");
            return;
        }

        console.log("ASCSDK", "showNavigateGroup===========================");

        let Navigate = NavigateController.getInstance();

        Navigate.isNavigateGroupShow = true;

        var self = this;
        this.navigateGroupBg = new Node("navigateGroupBg");
        this.navigateGroupBg.addComponent(SpriteComponent);
        this.navigateGroupBg.addComponent(UITransformComponent);

        var dataArr = [];
        for (let index = 0; index < Navigate.navigateList.length; index++) {
            dataArr[index] = Navigate.navigateList[index];
            dataArr[index].index = index;
        }

        var getInfom = function () {
            var allWeight = 0;
            for (var i = 0; i < dataArr.length; i++) {
                allWeight += dataArr[i].sort;
            }

            var random = Math.floor(Math.random() * allWeight);
            var weightNow = 0;
            for (let i = 0; i < dataArr.length; i++) {
                if (random >= weightNow && random < weightNow + dataArr[i].sort) {
                    var inform = dataArr[i];
                    dataArr.splice(i, 1);
                    return inform;
                }
                weightNow += dataArr[i].sort;
            }
        }
        if (type == 'vertical') {
            if (side == 'left') {
                this.navigateGroupBg.setPosition(-cc.winSize.width / 2 + this.navigateGroupBg.width / 2, 0, 0);
            }
            else {
                this.navigateGroupBg.setPosition(cc.winSize.width / 2 - this.navigateGroupBg.width / 2, this.navigateGroupBg.position.y, 0);
            }
            this.getsdkCanvas().addChild(this.navigateGroupBg);

            if (this.cocosGroup != '') {
                this.navigateGroupBg.group = this.cocosGroup;
            }
            this.navigateGroupBg.setSiblingIndex(30000);

            // 左侧列表打开按钮
            let touchButtonOpen = new Node("touchButtonOpen");
            touchButtonOpen.addComponent(SpriteComponent);
            touchButtonOpen.addComponent(UITransformComponent);
            setTimeout(() => {
                touchButtonOpen.width = 80;
                touchButtonOpen.height = 100;
                touchButtonOpen.setPosition(-90, 8, 0);
            }, 1);

            this.navigateGroupBg.addChild(touchButtonOpen);

            var btnOPSP = new Node("btnOPSP");
            btnOPSP.addComponent(SpriteComponent);
            btnOPSP.addComponent(UITransformComponent);
            btnOPSP.scale = new Vec3(-1, btnOPSP.scale.y, btnOPSP.scale.z);
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = UIController.getInstance().navigateGroupUITextures.leftTexture;
            btnOPSP.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            touchButtonOpen.addChild(btnOPSP);

            touchButtonOpen.on(Node.EventType.TOUCH_START, function (event) {
                if (UIController.getInstance().groupMoving) return;
                console.log("ASCSDK", "touchButtonOpen");
                UIController.getInstance().groupMoving = true;
                tween(self.navigateGroupBg)
                    .sequence(
                        tween()
                            .by(0.2, { position: new Vec3(-184 * self.navigateGroupBg.scale.x, 0, 0) })
                            .union()
                            .repeat(1)
                            .call(function () { UIController.getInstance().groupMoving = false })
                            .start()
                    );
                touchButtonOpen.active = false;
                touchButtonClose.active = true;
            });

            // 左侧列表关闭按钮
            let touchButtonClose = new Node("touchButtonClose");
            touchButtonClose.addComponent(UITransformComponent);
            this.navigateGroupBg.addChild(touchButtonClose);
            setTimeout(() => {
                touchButtonClose.width = 80;
                touchButtonClose.height = 100;
                touchButtonClose.setPosition(-200, 8, 0);
            }, 1);

            touchButtonClose.active = false;

            var btnCLSP = new Node("btnOPSP");
            btnCLSP.addComponent(SpriteComponent);
            btnCLSP.addComponent(UITransformComponent);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = UIController.getInstance().navigateGroupUITextures.leftTexture;
            btnCLSP.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            touchButtonClose.addChild(btnCLSP);

            touchButtonClose.on(Node.EventType.TOUCH_START, function (event) {
                console.log("ASCSDK", "groupMoving");
                if (UIController.getInstance().groupMoving) return;
                console.log("ASCSDK", "touchButtonClose");
                UIController.getInstance().groupMoving = true;
                tween(self.navigateGroupBg)
                    .sequence(
                        tween()
                            .by(0.2, { position: new Vec3(184 * self.navigateGroupBg.scale.x, 0, 0) })
                            .call(function () { UIController.getInstance().groupMoving = false })
                            .union()
                            .repeat(1)
                            .start()
                    );
                touchButtonOpen.active = true;
                touchButtonClose.active = false;
            });

            spriteFrame = new SpriteFrame();
            spriteFrame.texture = UIController.getInstance().navigateGroupUITextures.groupVTexture;
            this.navigateGroupBg.getComponent(SpriteComponent).spriteFrame = spriteFrame;


            var items = new Node("Items");
            items.addComponent(SpriteComponent);
            items.addComponent(UITransformComponent);
            items.setPosition(30, items.position.y, items.position.z);
            items.scale = new Vec3(this.navigateGroupBg.scale.x, items.scale.y, items.scale.z);
            this.navigateGroupBg.addChild(items);

            var title = new Node("btnOPSP");
            title.addComponent(SpriteComponent);
            title.addComponent(UITransformComponent);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = UIController.getInstance().navigateGroupUITextures.moreGameTitleTexture;
            title.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            title.setPosition(0, 400, 0);
            items.addChild(title);

            for (let i = 0; i < (Navigate.navigateList.length > 5 ? 5 : Navigate.navigateList.length); i++) {
                let inform = getInfom();

                let button = new Node("button");
                button.addComponent(SpriteComponent);
                button.addComponent(UITransformComponent);
                setTimeout(() => {
                    button.width = 128;
                    button.height = 128;
                    button.setPosition(0, 873 / 2 - 152 - 152 * i, 0);
                }, 1);
                items.addChild(button);

                let icon = new Node("button");
                icon.addComponent(SpriteComponent);
                icon.addComponent(UITransformComponent);
                if (UIController.getInstance().NavigateIconTextureList[inform.index]) {
                    spriteFrame = new SpriteFrame();
                    spriteFrame.texture = UIController.getInstance().NavigateIconTextureList[inform.index];
                    icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                }
                setTimeout(() => {
                    icon.width = 100;
                    icon.height = 100;
                }, 1);
                button.addChild(icon);

                let nameLabel = new Node("titleLabel");
                nameLabel.addComponent(LabelComponent);
                nameLabel.addComponent(UITransformComponent);
                nameLabel.setPosition(0, 11 - 60, 0);
                nameLabel.getComponent(LabelComponent).string = inform.pushGameName;
                nameLabel.scale = new Vec3(0.5, 0.5, 0.5);
                nameLabel.getComponent(LabelComponent).color = Color.BLACK;
                button.addChild(nameLabel);

                button.on(Node.EventType.TOUCH_START, function (event) {
                    self.jumpToMiniGame(inform);
                });
            }
        }
        else {
            if (side == 'left') {
                this.navigateGroupBg.setPosition(-310, 0, 0);
                this.navigateGroupBg.scale = new Vec3(-1, 1, 1);
            }
            else {
                this.navigateGroupBg.setPosition(cc.winSize.width + 310, 0, 0);
                this.navigateGroupBg.scale = new Vec3(1, 1, 1);
            }
            this.getsdkCanvas().addChild(this.navigateGroupBg);

            if (this.cocosGroup != '') {
                this.navigateGroupBg.group = this.cocosGroup;
            }
            this.navigateGroupBg.setSiblingIndex(30000);

            let touchButtonOpen = new Node("touchButtonOpen");
            touchButtonOpen.addComponent(UITransformComponent);
            setTimeout(() => {
                touchButtonOpen.width = 80;
                touchButtonOpen.height = 100;
                touchButtonOpen.setPosition(-327, 8, 0);
            }, 1);
            this.navigateGroupBg.addChild(touchButtonOpen);

            var btnOPSP = new Node("btnOPSP");
            btnOPSP.addComponent(SpriteComponent);
            btnOPSP.addComponent(UITransformComponent);
            btnOPSP.scale = new Vec3(-1, btnOPSP.scale.y, btnOPSP.scale.z);
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = UIController.getInstance().navigateGroupUITextures.leftTexture;
            btnOPSP.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            touchButtonOpen.addChild(btnOPSP);

            touchButtonOpen.on(Node.EventType.TOUCH_START, function (event) {
                if (UIController.getInstance().groupMoving) return;
                console.log("ASCSDK", "touchButtonOpen");
                UIController.getInstance().groupMoving = true;
                tween(self.navigateGroupBg)
                    .sequence(
                        tween()
                            .by(0.2, { position: new Vec3(-665 * self.navigateGroupBg.scale.x, 0, 0) })
                            .call(function () { UIController.getInstance().groupMoving = false })
                            .union()
                            .repeat(1)
                            .start()
                    );
                touchButtonOpen.active = false;
                touchButtonClose.active = true;
            });

            let touchButtonClose = new Node("touchButtonClose");
            touchButtonClose.addComponent(UITransformComponent);
            this.navigateGroupBg.addChild(touchButtonClose);
            setTimeout(() => {
                touchButtonClose.width = 80;
                touchButtonClose.height = 100;
                touchButtonClose.setPosition(-327, 8, 0);
            }, 1);

            touchButtonClose.active = false;

            var btnCLSP = new Node("btnOPSP");
            btnCLSP.addComponent(SpriteComponent);
            btnCLSP.addComponent(UITransformComponent);
            spriteFrame = new SpriteFrame();
            spriteFrame.texture = UIController.getInstance().navigateGroupUITextures.leftTexture;
            btnCLSP.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            touchButtonClose.addChild(btnCLSP);

            touchButtonClose.on(Node.EventType.TOUCH_START, function (event) {
                console.log("ASCSDK", "groupMoving");
                if (UIController.getInstance().groupMoving) return;
                console.log("ASCSDK", "touchButtonClose");
                UIController.getInstance().groupMoving = true;
                tween(self.navigateGroupBg)
                    .sequence(
                        tween()
                            .by(0.2, { position: new Vec3(665 * self.navigateGroupBg.scale.x, 0, 0) })
                            .call(function () { UIController.getInstance().groupMoving = false })
                            .union()
                            .repeat(1)
                            .start()
                    );
                touchButtonOpen.active = true;
                touchButtonClose.active = false;
            });

            spriteFrame = new SpriteFrame();
            spriteFrame.texture = UIController.getInstance().navigateGroupUITextures.groupHTexture;
            this.navigateGroupBg.getComponent(SpriteComponent).spriteFrame = spriteFrame;

            var items = new Node("Items");
            items.addComponent(UITransformComponent);
            this.navigateGroupBg.addChild(items);
            items.setPosition(30, items.position.y, 0);
            items.scale = new Vec3(this.navigateGroupBg.scale.x, items.scale.y, items.scale.z);

            for (let i = 0; i < (Navigate.navigateList.length > 5 ? 5 : Navigate.navigateList.length); i++) {
                let inform = getInfom();

                let button = new Node("button");
                button.addComponent(UITransformComponent);
                items.addChild(button);

                let icon = new Node("button");
                icon.addComponent(SpriteComponent);
                icon.addComponent(UITransformComponent);
                if (UIController.getInstance().NavigateIconTextureList[inform.index]) {
                    spriteFrame = new SpriteFrame();
                    spriteFrame.texture = UIController.getInstance().NavigateIconTextureList[inform.index];
                    icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                }
                button.addChild(icon);

                let nameLabel = new Node("titleLabel");
                nameLabel.addComponent(UITransformComponent);
                nameLabel.addComponent(LabelComponent);
                nameLabel.getComponent(LabelComponent).fontSize = 20;
                nameLabel.getComponent(LabelComponent).overflow = 2;
                nameLabel.getComponent(LabelComponent).enableWrapText = false;
                nameLabel.getComponent(LabelComponent).horizontalAlign = 1;
                nameLabel.getComponent(LabelComponent).string = inform.pushGameName;
                nameLabel.getComponent(LabelComponent).color = Color.BLACK;
                button.addChild(nameLabel);

                button.on(Node.EventType.TOUCH_START, function (event) {
                    self.jumpToMiniGame(inform);
                });

                setTimeout(() => {
                    button.width = 128;
                    button.height = 128;
                    button.setPosition(-710 / 2 + 90 + i * 128, 5, 0);
                    icon.width = 100;
                    icon.height = 100;
                    nameLabel.width = 128;
                    nameLabel.height = 30;
                    nameLabel.setPosition(0, 11 - 70, 0);
                }, 1);
            }
        }
    }
    /**
     * 隐藏互推列表
     */
    public hideNavigateGroup() {
        if (this.navigateGroupBg) {
            console.log("ASCSDK", "hideNavigateGroup===========================")
            this.navigateGroupBg.removeFromParent();
            this.navigateGroupBg = null;
        } else {
            console.log("ASCSDK", "不存在互推列表 return");
            return;
        }
    }


    /**
     * 展示结算互推
     */
    public showNavigateSettle(type: number, x: number, y: number) {
        BannerController.getInstance().hideBanner();
        if (this.navigateSettleBg) {
            console.log("ASCSDK", "已存在结算互推 return");
            return;
        }
        console.log("ASCSDK", "showNavigateSettle===========================")

        let Navigate = NavigateController.getInstance();
        let NavigateList = Navigate.navigateList;
        if (!UIController.getInstance().isLoadNavigateSettle) {
            console.log("ASCSDK", "结算互推资源未加载到 return");
            return;
        }
        // if (!UIController.getInstance().isLoadNavigateList) {
        //   console.log("互推游戏列表资源未加载到 return");
        //   return;
        // }

        Navigate.isNavigateSettleShow = true;

        var dataArr = [];
        for (let index = 0; index < NavigateList.length; index++) {
            dataArr[index] = NavigateList[index];
            dataArr[index].index = index;
        }

        var getInfom = function () {
            var allWeight = 0;
            for (var i = 0; i < dataArr.length; i++) {
                allWeight += dataArr[i].sort;
            }

            var random = Math.floor(Math.random() * allWeight);
            var weightNow = 0;
            for (let i = 0; i < dataArr.length; i++) {
                if (random >= weightNow && random < weightNow + dataArr[i].sort) {
                    var inform = dataArr[i];
                    dataArr.splice(i, 1);
                    return inform;
                }
                weightNow += dataArr[i].sort;
            }
        }

        switch (type) {
            case 1:
                {
                    if (NavigateList.length < 6) {
                        console.log("ASCSDK", "互推游戏小于6个");
                        return;
                    }

                    var self = this;
                    this.navigateSettleBg = new Node("navigateSettleBg");
                    this.navigateSettleBg.addComponent(SpriteComponent);
                    this.navigateSettleBg.addComponent(UITransformComponent);
                    this.navigateSettleBg.setPosition(0, 0, 0);
                    this.navigateSettleBg.setSiblingIndex(30000);
                    if (this.cocosGroup != '') {
                        this.navigateSettleBg.group = this.cocosGroup;
                    }
                    this.getsdkCanvas().addChild(this.navigateSettleBg);

                    var navigateSettle = new Node("navigateSettle");
                    var sp = navigateSettle.addComponent(SpriteComponent);
                    navigateSettle.addComponent(UITransformComponent);

                    var spframe = new SpriteFrame();
                    spframe.texture = UIController.getInstance().navigateSettleUITextures.navigateSettleGroup;

                    navigateSettle.getComponent(SpriteComponent).type = 1;
                    spframe.insetTop = 30;
                    spframe.insetBottom = 30;
                    spframe.insetLeft = 30;
                    spframe.insetRight = 30;
                    sp.spriteFrame = spframe;

                    if (cc.winSize.width < cc.winSize.height) {
                        setTimeout(() => {
                            navigateSettle.width = cc.winSize.width * 0.65;
                            navigateSettle.height = navigateSettle.width / 1.15;
                        }, 0.5);
                    }
                    else {
                        setTimeout(() => {
                            navigateSettle.height = cc.winSize.height / 5 * 2;
                            navigateSettle.width = navigateSettle.height * 1.15;
                        }, 0.5);
                    }
                    navigateSettle.setPosition(x, y, 0);
                    self.navigateSettleBg.addChild(navigateSettle);

                    var leftTitle = new Node("leftTitle");
                    leftTitle.addComponent(SpriteComponent);
                    leftTitle.addComponent(UITransformComponent);
                    var titleframe = new SpriteFrame();
                    titleframe.texture = UIController.getInstance().navigateSettleUITextures.navigateSettletitleBg;
                    leftTitle.getComponent(SpriteComponent).type = 1;
                    titleframe.insetTop = 30;
                    titleframe.insetBottom = 30;
                    titleframe.insetLeft = 30;
                    titleframe.insetRight = 30;
                    leftTitle.getComponent(SpriteComponent).spriteFrame = titleframe;

                    setTimeout(() => {
                        leftTitle.width = navigateSettle.width * 0.972;
                        leftTitle.height = navigateSettle.height * 0.138;
                        leftTitle.setPosition(0, navigateSettle.height / 2 - leftTitle.height / 2 - navigateSettle.height * 0.018, 0);
                    }, 1);

                    var titleLabel = new Node("titleLabel");
                    titleLabel.addComponent(LabelComponent);
                    titleLabel.addComponent(UITransformComponent);
                    titleLabel.getComponent(LabelComponent).fontSize = 25;
                    titleLabel.getComponent(LabelComponent).horizontalAlign = 1;
                    titleLabel.getComponent(LabelComponent).verticalAlign = 1;
                    titleLabel.getComponent(LabelComponent).string = '更多精品游戏推荐!';
                    titleLabel.getComponent(LabelComponent).color = Color.WHITE;
                    leftTitle.addChild(titleLabel);

                    navigateSettle.addChild(leftTitle);

                    var iconSize;

                    for (let i = 0; i < 6; i++) {
                        let inform = getInfom();

                        let button = new Node("button");
                        button.addComponent(UITransformComponent);

                        navigateSettle.addChild(button);

                        let iconWihte = new Node("button");
                        iconWihte.addComponent(SpriteComponent);
                        iconWihte.addComponent(UITransformComponent);
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = UIController.getInstance().navigateSettleUITextures.iconWihte;
                        iconWihte.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        button.addChild(iconWihte);

                        let icon = new Node("button");
                        icon.addComponent(SpriteComponent);
                        icon.addComponent(UITransformComponent);
                        if (UIController.getInstance().NavigateIconTextureList[inform.index]) {
                            spriteFrame = new SpriteFrame();
                            spriteFrame.texture = UIController.getInstance().NavigateIconTextureList[inform.index];
                            icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        }
                        button.addChild(icon);

                        let nameLabel = new Node("titleLabel");
                        nameLabel.addComponent(LabelComponent);
                        nameLabel.addComponent(UITransformComponent);
                        nameLabel.getComponent(LabelComponent).fontSize = 20;
                        nameLabel.getComponent(LabelComponent).overflow = 2;
                        nameLabel.getComponent(LabelComponent).enableWrapText = false;
                        nameLabel.getComponent(LabelComponent).horizontalAlign = 1;
                        nameLabel.getComponent(LabelComponent).string = inform.pushGameName;
                        nameLabel.getComponent(LabelComponent).color = Color.WHITE;

                        button.addChild(nameLabel);

                        setTimeout(() => {
                            iconSize = (navigateSettle.height - leftTitle.height * 1.5) / 2;
                            button.width = iconSize;
                            button.height = iconSize;
                            button.setPosition(- navigateSettle.width / 2 + navigateSettle.width / 6 + navigateSettle.width / 3 * (i % 3),
                                navigateSettle.height / 2 - leftTitle.height * 1.25 - iconSize / 2 - iconSize * Math.floor(i / 3), 0);
                            iconWihte.setPosition(0, iconSize * 0.085, 0);
                            iconWihte.width = iconSize * 0.781;
                            iconWihte.height = iconSize * 0.781;
                            icon.width = iconSize * 0.785;
                            icon.height = iconSize * 0.785;
                            icon.setPosition(0, iconSize * 0.085, 0);
                            nameLabel.width = iconSize;
                            nameLabel.height = iconSize * 0.234;
                            nameLabel.setPosition(0, iconSize * 0.085 - iconSize * 0.546 + 10, 0);
                        }, 1);

                        button.on(Node.EventType.TOUCH_START, function (event) {
                            self.jumpToMiniGame(inform);
                        });
                    }
                }
                break;
            case 2:
                {
                    if (NavigateList.length < 4) {
                        console.log("ASCSDK", "互推游戏小于4个");
                        return;
                    }

                    var self = this;
                    this.navigateSettleBg = new Node("navigateSettleBg");
                    this.navigateSettleBg.addComponent(SpriteComponent);
                    this.navigateSettleBg.addComponent(UITransformComponent);
                    this.navigateSettleBg.setPosition(0, 0, 0);
                    this.navigateSettleBg.setSiblingIndex(30000);
                    if (this.cocosGroup != '') { this.navigateSettleBg.group = this.cocosGroup; }
                    this.getsdkCanvas().addChild(this.navigateSettleBg);

                    var navigateSettleLeft = new Node("navigateSettleLeft");
                    var spleft = navigateSettleLeft.addComponent(SpriteComponent);
                    navigateSettleLeft.addComponent(UITransformComponent);
                    var spleftframe = new SpriteFrame();
                    spleftframe.texture = UIController.getInstance().navigateSettleUITextures.navigateSettleGroup;
                    navigateSettleLeft.getComponent(SpriteComponent).type = 1;
                    spleftframe.insetTop = 30;
                    spleftframe.insetBottom = 30;
                    spleftframe.insetLeft = 30;
                    spleftframe.insetRight = 30;
                    spleft.spriteFrame = spleftframe;
                    if (cc.winSize.width < cc.winSize.height) {
                        setTimeout(() => {
                            navigateSettleLeft.width = cc.winSize.width * 0.2;
                            navigateSettleLeft.height = navigateSettleLeft.width / 0.439;
                        }, 0.5);
                    }
                    else {
                        setTimeout(() => {
                            navigateSettleLeft.height = cc.winSize.height - 200;
                            navigateSettleLeft.width = cc.winSize.height * 0.439;
                        }, 0.5);
                    }

                    navigateSettleLeft.setPosition(-cc.winSize.width / 2 + navigateSettleLeft.width / 2, 0, 0);
                    this.navigateSettleBg.addChild(navigateSettleLeft);

                    var leftTitle = new Node("leftTitle");
                    leftTitle.addComponent(SpriteComponent);
                    leftTitle.addComponent(UITransformComponent);
                    let spriteFrame = new SpriteFrame();
                    spriteFrame.texture = UIController.getInstance().navigateSettleUITextures.navigateSettletitleBg;
                    leftTitle.getComponent(SpriteComponent).spriteFrame = spriteFrame;

                    var titleLabel = new Node("titleLabel");
                    titleLabel.addComponent(LabelComponent);
                    titleLabel.addComponent(UITransformComponent);
                    titleLabel.getComponent(LabelComponent).fontSize = 20;
                    titleLabel.getComponent(LabelComponent).horizontalAlign = 1;
                    titleLabel.getComponent(LabelComponent).verticalAlign = 1;
                    titleLabel.getComponent(LabelComponent).string = '更多游戏';
                    titleLabel.getComponent(LabelComponent).color = Color.WHITE;
                    leftTitle.addChild(titleLabel);
                    navigateSettleLeft.addChild(leftTitle);

                    setTimeout(() => {
                        iconSize = navigateSettleLeft.width * 0.7;
                        leftTitle.width = navigateSettleLeft.width * 0.931;
                        leftTitle.height = navigateSettleLeft.height * 0.142;
                        leftTitle.setPosition(0, navigateSettleLeft.height / 2 - leftTitle.height / 2 - navigateSettleLeft.height * 0.018, 0)
                        titleLabel.setPosition(navigateSettleLeft.width * 0.05, titleLabel.position.y, 0);
                    }, 1);

                    for (let i = 0; i < 2; i++) {
                        let inform = getInfom();

                        let button = new Node("button");
                        button.addComponent(UITransformComponent);
                        navigateSettleLeft.addChild(button);

                        let iconWihte = new Node("button");
                        iconWihte.addComponent(SpriteComponent);
                        iconWihte.addComponent(UITransformComponent);
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = UIController.getInstance().navigateSettleUITextures.iconWihte;
                        iconWihte.getComponent(SpriteComponent).spriteFrame = spriteFrame;

                        button.addChild(iconWihte);

                        let icon = new Node("button");
                        icon.addComponent(SpriteComponent);
                        icon.addComponent(UITransformComponent);
                        if (UIController.getInstance().NavigateIconTextureList[inform.index]) {
                            let spriteFrame = new SpriteFrame();
                            spriteFrame.texture = UIController.getInstance().NavigateIconTextureList[inform.index];
                            icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        }
                        button.addChild(icon);

                        let nameLabel = new Node("titleLabel");
                        nameLabel.addComponent(LabelComponent);
                        nameLabel.addComponent(UITransformComponent);
                        nameLabel.getComponent(LabelComponent).fontSize = 20;
                        nameLabel.getComponent(LabelComponent).overflow = 2;
                        nameLabel.getComponent(LabelComponent).enableWrapText = false;
                        nameLabel.getComponent(LabelComponent).horizontalAlign = 1;
                        nameLabel.getComponent(LabelComponent).string = inform.pushGameName;
                        nameLabel.getComponent(LabelComponent).color = Color.WHITE;
                        button.addChild(nameLabel);

                        button.on(Node.EventType.TOUCH_START, function (event) {
                            self.jumpToMiniGame(inform);
                        });

                        setTimeout(() => {
                            button.width = iconSize;
                            button.height = iconSize;
                            button.setPosition(navigateSettleLeft.width * 0.05, - navigateSettleLeft.height / 2 + (navigateSettleLeft.height - navigateSettleLeft.height * 0.036 - leftTitle.height) / 4 + i * (navigateSettleLeft.height - navigateSettleLeft.height * 0.036 - leftTitle.height) / 2, 0);
                            iconWihte.setPosition(0, iconSize * 0.085, 0);
                            iconWihte.width = iconSize * 0.781 + 2;
                            iconWihte.height = iconSize * 0.781 + 2;
                            icon.width = iconSize * 0.79;
                            icon.height = iconSize * 0.79;
                            icon.setPosition(0, iconSize * 0.085, 0);
                            nameLabel.setPosition(0, iconSize * 0.085 - iconSize * 0.546 + 2, 0);
                            nameLabel.width = iconSize;
                            nameLabel.height = iconSize * 0.234;
                        }, 1);
                    }

                    var navigateSettleRight = new Node("navigateSettleRight");
                    navigateSettleRight.addComponent(UITransformComponent);
                    var spright = navigateSettleRight.addComponent(SpriteComponent);
                    var sprightframe = new SpriteFrame();
                    sprightframe.texture = UIController.getInstance().navigateSettleUITextures.navigateSettleGroup;
                    navigateSettleRight.getComponent(SpriteComponent).type = 1;
                    sprightframe.insetTop = 30;
                    sprightframe.insetBottom = 30;
                    sprightframe.insetLeft = 30;
                    sprightframe.insetRight = 30;
                    spright.spriteFrame = sprightframe;
                    setTimeout(() => {
                        if (cc.winSize.width < cc.winSize.height) {
                            navigateSettleRight.width = cc.winSize.width * 0.2;
                            navigateSettleRight.height = navigateSettleRight.width / 0.439;
                        }
                        else {
                            navigateSettleRight.height = cc.winSize.height - 200;
                            navigateSettleRight.width = cc.winSize.height * 0.439;
                        }
                        navigateSettleRight.setPosition(cc.winSize.width / 2 - navigateSettleRight.width / 2, 0, 0);
                    }, 0.5);

                    self.navigateSettleBg.addChild(navigateSettleRight);

                    var rightTitle = new Node("rightTitle");
                    rightTitle.addComponent(SpriteComponent);
                    rightTitle.addComponent(UITransformComponent);
                    spriteFrame = new SpriteFrame();
                    spriteFrame.texture = UIController.getInstance().navigateSettleUITextures.navigateSettletitleBg;
                    rightTitle.getComponent(SpriteComponent).spriteFrame = spriteFrame;

                    navigateSettleRight.addChild(rightTitle);
                    var rtitleLabel = new Node("rtitleLabel");
                    rtitleLabel.addComponent(LabelComponent);
                    rtitleLabel.addComponent(UITransformComponent);
                    rtitleLabel.getComponent(LabelComponent).fontSize = 20;
                    rtitleLabel.getComponent(LabelComponent).horizontalAlign = 1;
                    rtitleLabel.getComponent(LabelComponent).verticalAlign = 1;
                    rtitleLabel.getComponent(LabelComponent).string = '更多游戏';
                    rtitleLabel.getComponent(LabelComponent).color = Color.WHITE;

                    rightTitle.addChild(rtitleLabel);
                    iconSize = navigateSettleRight.width * 0.7;

                    setTimeout(() => {
                        rightTitle.width = navigateSettleRight.width * 0.931;
                        rightTitle.height = navigateSettleRight.height * 0.142;
                        rightTitle.setPosition(0, navigateSettleRight.height / 2 - rightTitle.height / 2 - navigateSettleRight.height * 0.018, 0);
                        rtitleLabel.setPosition(- (navigateSettleRight.width * 0.05), rtitleLabel.position.y, rtitleLabel.position.z);
                    }, 1);

                    for (let i = 0; i < 2; i++) {
                        let inform = getInfom();

                        let button = new Node("button");
                        button.addComponent(UITransformComponent);

                        navigateSettleRight.addChild(button);

                        let iconWihte = new Node("button");
                        iconWihte.addComponent(SpriteComponent);
                        iconWihte.addComponent(UITransformComponent);
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = UIController.getInstance().navigateSettleUITextures.iconWihte;
                        iconWihte.getComponent(SpriteComponent).spriteFrame = spriteFrame;

                        setTimeout(() => {
                            iconWihte.setPosition(0, iconSize * 0.085, 0);
                            iconWihte.width = iconSize * 0.781 + 2;
                            iconWihte.height = iconSize * 0.781 + 2;
                        }, 1);
                        button.addChild(iconWihte);

                        let icon = new Node("button");
                        icon.addComponent(SpriteComponent);
                        icon.addComponent(UITransformComponent);
                        if (UIController.getInstance().NavigateIconTextureList[inform.index]) {
                            spriteFrame = new SpriteFrame();
                            spriteFrame.texture = UIController.getInstance().NavigateIconTextureList[inform.index];
                            icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        }
                        button.addChild(icon);

                        let nameLabel = new Node("titleLabel");
                        nameLabel.addComponent(LabelComponent);
                        nameLabel.addComponent(UITransformComponent);
                        nameLabel.getComponent(LabelComponent).fontSize = 20;
                        nameLabel.getComponent(LabelComponent).overflow = 2;
                        nameLabel.getComponent(LabelComponent).enableWrapText = false;
                        nameLabel.getComponent(LabelComponent).horizontalAlign = 1;
                        nameLabel.getComponent(LabelComponent).string = inform.pushGameName;
                        nameLabel.getComponent(LabelComponent).color = Color.WHITE;
                        button.addChild(nameLabel);

                        button.on(Node.EventType.TOUCH_START, function (event) {
                            self.jumpToMiniGame(inform);
                        });

                        setTimeout(() => {
                            button.width = iconSize;
                            button.height = iconSize;
                            button.setPosition(-navigateSettleRight.width * 0.05, - navigateSettleLeft.height / 2 + (navigateSettleRight.height - navigateSettleRight.height * 0.036 - rightTitle.height) / 4 + i * (navigateSettleRight.height - navigateSettleRight.height * 0.036 - rightTitle.height) / 2, 0);
                            icon.width = iconSize * 0.79;
                            icon.height = iconSize * 0.79;
                            icon.setPosition(0, iconSize * 0.085, 0);
                            nameLabel.setPosition(0, iconSize * 0.085 - iconSize * 0.546 + 2, 0);
                            nameLabel.width = iconSize;
                            nameLabel.height = iconSize * 0.234;
                        }, 1);
                    }

                }
                break;
            case 3:
                {
                    if (NavigateList.length < 5) {
                        console.log("ASCSDK", "互推游戏小于5个");
                        return;
                    }

                    var self = this;
                    this.navigateSettleBg = new Node("navigateSettleBg");
                    this.navigateSettleBg.addComponent(UITransformComponent);
                    this.navigateSettleBg.setPosition(0, 0, 0);
                    this.navigateSettleBg.setSiblingIndex(30000);
                    if (this.cocosGroup != '') { this.navigateSettleBg.group = this.cocosGroup; }

                    this.getsdkCanvas().addChild(this.navigateSettleBg);

                    var navigateSettle = new Node("navigateSettle");
                    var sp = navigateSettle.addComponent(SpriteComponent);
                    navigateSettle.addComponent(UITransformComponent);
                    let spframe = new SpriteFrame();
                    spframe.texture = UIController.getInstance().navigateSettleUITextures.navigateSettleGroup;
                    navigateSettle.getComponent(SpriteComponent).type = 1;
                    spframe.insetTop = 30;
                    spframe.insetBottom = 30;
                    spframe.insetLeft = 30;
                    spframe.insetRight = 30;
                    sp.spriteFrame = spframe;

                    setTimeout(() => {
                        if (cc.winSize.width < cc.winSize.height) {
                            navigateSettle.width = cc.winSize.width * 0.904;
                            navigateSettle.height = navigateSettle.width * 0.317;
                        }
                        else {
                            navigateSettle.height = cc.winSize.height / 4;
                            navigateSettle.width = navigateSettle.height / 0.317;
                        }
                        navigateSettle.setPosition(x, y, 0);
                    }, 0.5);
                    self.navigateSettleBg.addChild(navigateSettle);

                    var leftTitle = new Node("leftTitle");
                    leftTitle.addComponent(SpriteComponent);
                    leftTitle.addComponent(UITransformComponent);

                    var leftTitle = new Node("leftTitle");
                    leftTitle.addComponent(SpriteComponent);
                    leftTitle.addComponent(UITransformComponent);
                    let titleframe = new SpriteFrame();
                    titleframe.texture = UIController.getInstance().navigateSettleUITextures.navigateSettletitleBg;
                    // iconWihte.getComponent(SpriteComponent).spriteFrame = spriteFrame;

                    leftTitle.getComponent(SpriteComponent).type = 1;
                    titleframe.insetTop = 30;
                    titleframe.insetBottom = 30;
                    titleframe.insetLeft = 30;
                    titleframe.insetRight = 30;
                    leftTitle.getComponent(SpriteComponent).spriteFrame = titleframe;


                    setTimeout(() => {
                        leftTitle.width = navigateSettle.width * 0.972;
                        leftTitle.height = navigateSettle.height * 0.138;
                        leftTitle.setPosition(0, navigateSettle.height / 2 - leftTitle.height / 2 - navigateSettle.height * 0.018, 0);
                    }, 1);

                    var titleLabel = new Node("titleLabel");
                    titleLabel.addComponent(LabelComponent);
                    titleLabel.addComponent(UITransformComponent);
                    titleLabel.getComponent(LabelComponent).fontSize = 25;
                    titleLabel.getComponent(LabelComponent).horizontalAlign = 1;
                    titleLabel.getComponent(LabelComponent).verticalAlign = 1;
                    titleLabel.getComponent(LabelComponent).string = '更多精品游戏推荐!';
                    titleLabel.getComponent(LabelComponent).color = Color.WHITE;
                    leftTitle.addChild(titleLabel);

                    navigateSettle.addChild(leftTitle);

                    for (let i = 0; i < 5; i++) {
                        let inform = getInfom();

                        let button = new Node("button");
                        button.addComponent(UITransformComponent);

                        navigateSettle.addChild(button);

                        let iconWihte = new Node("button");
                        iconWihte.addComponent(SpriteComponent);
                        iconWihte.addComponent(UITransformComponent);
                        let spriteFrame = new SpriteFrame();
                        spriteFrame.texture = UIController.getInstance().navigateSettleUITextures.iconWihte;
                        iconWihte.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        button.addChild(iconWihte);

                        let icon = new Node("button");
                        icon.addComponent(SpriteComponent);
                        icon.addComponent(UITransformComponent);
                        if (UIController.getInstance().NavigateIconTextureList[inform.index]) {
                            let spriteFrame = new SpriteFrame();
                            spriteFrame.texture = UIController.getInstance().NavigateIconTextureList[inform.index];
                            icon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
                        }
                        button.addChild(icon);

                        let nameLabel = new Node("titleLabel");
                        nameLabel.addComponent(LabelComponent);
                        nameLabel.addComponent(UITransformComponent);
                        nameLabel.getComponent(LabelComponent).fontSize = 20;
                        nameLabel.getComponent(LabelComponent).overflow = 2;
                        nameLabel.getComponent(LabelComponent).enableWrapText = false;
                        nameLabel.getComponent(LabelComponent).horizontalAlign = 1;
                        nameLabel.getComponent(LabelComponent).string = inform.pushGameName;
                        nameLabel.getComponent(LabelComponent).color = Color.WHITE;
                        button.addChild(nameLabel);

                        button.on(Node.EventType.TOUCH_START, function (event) {
                            self.jumpToMiniGame(inform);
                        });

                        setTimeout(() => {
                            iconSize = navigateSettle.width / 5;
                            button.width = iconSize;
                            button.height = iconSize;
                            button.setPosition(- navigateSettle.width / 2 + navigateSettle.width / 10 + navigateSettle.width / 5 * i,
                                navigateSettle.height / 2 - leftTitle.height * 1.25 - iconSize / 2 - 30, 0);
                            iconWihte.setPosition(0, iconSize * 0.085, 0);
                            iconWihte.width = iconSize * 0.77 + 2;
                            iconWihte.height = iconSize * 0.77 + 2;
                            icon.width = iconSize * 0.79;
                            icon.height = iconSize * 0.79;
                            icon.setPosition(0, iconSize * 0.085, 0);
                            nameLabel.setPosition(0, y - icon.height / 2, 0);
                            nameLabel.width = iconSize;
                            nameLabel.height = iconSize * 0.234;
                        }, 1);
                    }
                }
                break;
            default:
                console.log("ASCSDK", "不存在该种类型的互推:" + type);
                break;
        }
    }
    /**
     * 隐藏结算互推
     */
    public hideNavigateSettle() {
        if (this.navigateSettleBg) {
            console.log("ASCSDK", "hideNavigateSettle===========================")
            this.navigateSettleBg.removeFromParent();
            this.navigateSettleBg = null;
        } else {
            console.log("ASCSDK", "不存在结算互推 return");
            return;
        }
    }


    /**
     * 加载VIVO原生广告
     */
    public loadVIVONativeAd(res) {
        let NativeVIVO = NativeVivo.getInstance();

        console.log("ASCSDK", "VIVO 原生广告加载成功", JSON.stringify(res.adList))

        let index = 0;
        if (typeof res.adList != 'undefined' && res.adList.length != 0) {
            index = res.adList.length - 1;
        } else {
            console.log("ASCSDK", "VIVO 原生广告列表为空 return");
            return;
        }

        console.log("ASCSDK", "第" + index + "个原生广告:" + JSON.stringify(res.adList[index]));

        if (res.adList[index].icon != "" && res.adList[index].imgUrlList.length != 0) {
            console.log("ASCSDK", "VIVO 同时存在原生ICON和大图");
        } else {
            console.log("ASCSDK", "VIVO 只存在原生ICON或大图");
        }

        NativeVIVO.nativeInfo.adId = String(res.adList[index].adId);
        NativeVIVO.nativeInfo.title = String(res.adList[index].title);
        NativeVIVO.nativeInfo.desc = String(res.adList[index].desc);
        NativeVIVO.nativeInfo.clickBtnTxt = String(res.adList[index].clickBtnTxt);

        NativeVIVO.nativeContent.adId = String(res.adList[index].adId);
        NativeVIVO.nativeContent.title = String(res.adList[index].title);
        NativeVIVO.nativeContent.desc = String(res.adList[index].desc);

        if (res.adList[index].icon != "") {
            loader.load(String(res.adList[index].icon), (err, texture) => {
                console.log("ASCSDK", "VIVO 原生ICON加载成功");
                NativeVIVO.nativeInfo.Native_icon = texture._texture;
                NativeVIVO.isLoadIconNative = true;
            });
            NativeVIVO.nativeContent.Native_icon = String(res.adList[index].icon);
        } else {
            NativeVIVO.nativeInfo.Native_icon = null;
            NativeVIVO.isLoadIconNative = false;
        }

        if (res.adList[index].imgUrlList.length != 0) {
            loader.load(String(res.adList[index].imgUrlList[0]), (err, texture) => {
                console.log("ASCSDK", "VIVO 原生大图加载成功");
                NativeVIVO.nativeInfo.Native_BigImage = texture._texture;
                NativeVIVO.isLoadImageNative = true;
            });
            NativeVIVO.nativeContent.Native_BigImage = String(res.adList[index].imgUrlList[0]);
        } else {
            NativeVIVO.nativeInfo.Native_BigImage = null;
            NativeVIVO.isLoadImageNative = false;
        }
    }

    /**
     * 加载OPPO原生广告
     */
    public loadOPPONativeAd(res) {

        let NativeOPPO = NativeOppo.getInstance();

        console.log("ASCSDK", "OPPO 原生广告加载成功", JSON.stringify(res.adList))

        var index = 0;
        for (var i = 0; i < res.adList.length; i++) {
            if (res.adList[i].iconUrlList.length > 0 && res.adList[i].imgUrlList.length > 0) {
                console.log("ASCSDK", "OPPO 同时存在原生ICON和大图");
                index = i;
                break;
            }
            if (i == res.adList.length - 1 && (res.adList[i].iconUrlList.length > 0 || res.adList[i].imgUrlList.length > 0)) {
                console.log("ASCSDK", "OPPO 只存在原生ICON或大图");
                index = i;
                break;
            }
        }

        NativeOPPO.nativeInfo.adId = String(res.adList[index].adId);
        NativeOPPO.nativeInfo.title = String(res.adList[index].title);
        NativeOPPO.nativeInfo.desc = String(res.adList[index].desc);
        NativeOPPO.nativeInfo.clickBtnTxt = String(res.adList[index].clickBtnTxt);

        NativeOPPO.nativeContent.adId = String(res.adList[index].adId);
        NativeOPPO.nativeContent.title = String(res.adList[index].title);
        NativeOPPO.nativeContent.desc = String(res.adList[index].desc);

        if (res.adList && res.adList[index].iconUrlList.length > 0) {
            loader.load({ url: String(res.adList[index].iconUrlList), type: 'png' }, (err, texture) => {
                console.log("ASCSDK", "OPPO 原生ICON加载成功");
                NativeOPPO.nativeInfo.Native_icon = texture._texture;
                NativeOPPO.isLoadIconNative = true;
            });
            NativeOPPO.nativeContent.Native_icon = String(res.adList[index].iconUrlList[0]);
        } else {
            NativeOPPO.nativeInfo.Native_icon = null;
            NativeOPPO.isLoadIconNative = false;
        }

        if (res.adList && res.adList[index].imgUrlList.length > 0) {
            loader.load({ url: String(res.adList[index].imgUrlList[0]), type: 'png' }, (err, texture) => {
                console.log("ASCSDK", "OPPO 原生大图加载成功");
                NativeOPPO.nativeInfo.Native_BigImage = texture._texture;
                NativeOPPO.isLoadImageNative = true;
            });
            NativeOPPO.nativeContent.Native_BigImage = String(res.adList[index].imgUrlList[0]);
        } else {
            NativeOPPO.nativeInfo.Native_BigImage = null;
            NativeOPPO.isLoadImageNative = false;
        }
    }


    /**
     * 互推游戏跳转
     * @param inform 
     */
    private jumpToMiniGame(inform) {
        console.log("ASCSDK", "jumpToMiniGame===========================")
        Network.getInstance().statistics(inform);
        qg.navigateToMiniGame({
            pkgName: inform.pushGamePackage,
            success: function () {
            },
            fail: function (res) {
                console.log("ASCSDK", "互推游戏跳转失败", JSON.stringify(res));
            }
        });
    }

    /**
     * 创建banner测试广告
     */
    public createBanner() {

    }
    /**
     * 展示测试横幅
     */
    public showBanner() {
        if (this.bannerFakeBg) {
            console.log("ASCSDK", "已存在测试banner return");
            return;
        }
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
            this.getsdkCanvas().addChild(this.bannerFakeBg);
            if (this.cocosGroup != '') {
                this.bannerFakeBg.group = this.cocosGroup;
            }
        })
    }
    /**
     * 隐藏测试横幅
     */
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

    /**
     * 积木广告测试
     */
    public showBlock(type, x, y, size) {
        console.log("ASCSDK", 'Test cocos3d showBlock==========================');
        var scene = director.getScene();
        loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, texture) => {
            this.nativeIcon = new Node("nativeIcon");
            this.nativeIcon.addComponent(SpriteComponent);
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture._texture;
            this.nativeIcon.getComponent(SpriteComponent).spriteFrame = spriteFrame;
            this.nativeIcon.width = 200;
            this.nativeIcon.height = 200;

            this.nativeIcon.setPosition(x + this.nativeIcon.width / 2, y - this.nativeIcon.height / 2, 0);
            this.nativeIcon.setSiblingIndex(29999);

            if (this.cocosGroup != '') {
                this.nativeIcon.group = this.cocosGroup;
            }

            scene.addChild(this.nativeIcon);
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
            console.log("ASCSDK", "不存在积木广告");
            return;
        }
    }


    /**
     * 展示原生ICON测试
     */
    public showNativeIcon(width: number, height: number, x: number, y: number) {
        console.log('showNative====================');
        var self = this;
        if (self.nativeIcon) return;

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

            this.getsdkCanvas().addChild(self.nativeIcon);
        });

    }
    /**
     * 隐藏原生ICON测试
     */
    public hideNativeIcon() {
        if (this.nativeIcon) {
            console.log("ASCSDK", "Test hideNativeIcon==========================");
            this.nativeIcon.removeFromParent(); this.nativeIcon = null
        } else {
            console.log("ASCSDK", "不存在原生ICON测试 return");
            return;
        }
    }


    /**
     * 展示视频测试
     */
    public showVideo(callback) {
        var self = this;
        var layerBg = new Node("layerBg");

        layerBg.setPosition(0, 0, 30000);

        layerBg.addComponent(SpriteComponent);
        layerBg.addComponent(UIOpacityComponent);
        layerBg.getComponent(UIOpacityComponent).opacity = 200;
        layerBg.addComponent(UITransformComponent);
        //layerBg.getComponent(UITransformComponent).priority = 30000;
        loader.load('http://minigame.xplaymobile.com/oppo_native_insters%5ClayerBg.png', (err, imagetexture) => {
            console.log(imagetexture);
            var spFrame = new SpriteFrame();
            spFrame.texture = imagetexture._texture;
            layerBg.getComponent(SpriteComponent).spriteFrame = spFrame;
            setTimeout(() => {
                layerBg.setContentSize(2560, 2560);
            }, 1);
        });

        this.getsdkCanvas().getComponent(UITransformComponent).priority = 30000;
        this.getsdkCanvas().addChild(layerBg);
        if (this.cocosGroup != '') {
            layerBg.group = this.cocosGroup;
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
            self.getsdkCanvas().removeChild(layerBg);
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
            self.getsdkCanvas().removeChild(layerBg);
            callback(false);
        });
    }



    /**
     * 展示互推ICON测试
     */
    public showNavigateIconTest(width, height, x, y) {
        var self = this;
        loader.load("https://tencentcnd.minigame.xplaymobile.com/Other/SDK/SDKImage_3_0/NavigateIconRes/iconBg.png", (err, imagetexture) => {
            var spFrame = new SpriteFrame();
            spFrame.texture = imagetexture._texture;
            self.navigateBg = new Node("navigateBg");
            self.navigateBg.addComponent(SpriteComponent);
            self.navigateBg.getComponent(SpriteComponent).spriteFrame = spFrame;
            setTimeout(() => {
                self.navigateBg.width = width;
                self.navigateBg.height = height;
                self.navigateBg.setPosition(x, y);
                self.getsdkCanvas().addChild(self.navigateBg);
            }, 1);
        });
        if (this.cocosGroup != '') {
            self.navigateBg.group = this.cocosGroup;
        }
    }
    /**
     * 隐藏互推ICON测试
     */
    public hideNavigateIconTest() {
        if (this.navigateBg) {
            console.log("ASCSDK", "Test hideNavigateIconTest==========================");
            this.navigateBg.removeFromParent();
        } else {
            console.log("ASCSDK", "不存在互推ICON测试 return");
            return;
        }
    }

}

export default Cocos3dUI 