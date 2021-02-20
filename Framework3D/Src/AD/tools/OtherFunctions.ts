import SdkTools, { Game_Platform } from "../tools/SdkTools"

let showAuthenticationCallback = null;

class OtherFunctions {
    private static instance: OtherFunctions

    /**
     * 添加桌面图标开关
     */
    public SW_DesktopSwitch: boolean = false;

    /**
     * 插屏间隔弹桌面图标开关
     */
    public SW_IntersToDesktop: boolean = false;

    /**
     * 自动弹添加桌面次数
     */
    public NUM_DeskAutoMostTimes: number = 0;

    /**
     * 第几次插屏变添加桌面
     */
    public NUM_IntersAddDesktopNumber: number = 0;

    /**
     * OtherFunctions 单例
     */
    public static getInstance(): OtherFunctions {
        if (!OtherFunctions.instance) {
            OtherFunctions.instance = new OtherFunctions()
        }
        return OtherFunctions.instance
    }


    /**
     * 获取能否添加桌面标志
     */
    public getDeskTopFlag(callback) {
        if (!this.SW_DesktopSwitch) {
            console.log("ASCSDK", "添加桌面图标开关未开启");
            callback(false);
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    if (qg.getSystemInfoSync().platformVersionCode < 1044) {
                        callback(true);
                        return;
                    }
                    qg.hasShortcutInstalled({
                        success: function (res) {
                            // 判断图标未存在时，创建图标
                            if (res == false) {
                                callback(true);
                            }
                        },
                        fail: function (err) {
                            console.log("ASCSDK", JSON.stringify(err));
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_Vivo:
                {
                    qg.hasShortcutInstalled({
                        success: function (status) {
                            if (status) {
                                console.log("ASCSDK", 'VIVO 已创建桌面图标');
                                callback(false);
                            } else {
                                console.log("ASCSDK", 'VIVO 未创建桌面图标')
                                callback(true);
                            }
                        }
                    })
                    break;
                }
            case Game_Platform.GP_Tiktok:
                callback(false);
                break;
            case Game_Platform.GP_QQ:
                callback(true);
                break;
            case Game_Platform.GP_Test:
                callback(true);
                break;
            default:
                callback(true);
                break;
        }
    }
    /**
     * 添加桌面
     */
    public addDeskTop(callback) {
        if (!this.SW_DesktopSwitch) {
            console.log("ASCSDK", "添加桌面图标开关未开启");
            callback(false);
            return;
        }
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    qg.installShortcut({
                        success: function () {
                            console.log("ASCSDK", 'OPPO 创建桌面图标成功')
                            // 执行用户创建图标奖励
                            callback(true);
                        },
                        fail: function (err) {
                            console.log("ASCSDK", 'OPPO 创建桌面图标失败:' + JSON.stringify(err));
                            callback(false);
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_Vivo:
                {
                    qg.installShortcut({
                        success: function () {
                            console.log("ASCSDK", 'VIVO 创建桌面图标成功')
                            callback(true);
                        },
                        fail: function (err) {
                            console.log("ASCSDK", 'VIVO 创建桌面图标失败:' + JSON.stringify(err));
                            callback(false);
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    qq.saveAppToDesktop({
                        success: function () {
                            console.log("ASCSDK", 'QQ 创建桌面图标成功')
                            // 执行用户创建图标奖励
                            callback(true);
                        },
                        fail: function (err) {
                            console.log("ASCSDK", 'QQ 创建桌面图标失败:' + JSON.stringify(err));
                            callback(false);
                        },
                        complete: function () { }
                    })
                    break;
                }
            case Game_Platform.GP_Tiktok:
                tt.addShortcut({
                    success: function (res) {
                        console.log("ASCSDK", "添加桌面成功");
                        callback(true);
                    },
                    fail: function (res) {
                        console.log("ASCSDK", "添加桌面失败:" + JSON.stringify(res));
                        callback(false);
                    }
                })
                break;
            default:
                callback(true);
                break;
        }
    }


    /**
     * 展示系统提示
     */
    public showToast(msg: string) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    if (qg.getSystemInfoSync().platformVersionCode < 1050) {
                        console.log("ASCSDK", "OPPO 不支持提示框的版本")
                        return;
                    }
                    console.log('ASCSDK', 'OPPO showToast：', msg);
                    qg.showToast({
                        title: msg,
                        duration: 3000
                    })
                    break;
                }
            case Game_Platform.GP_Vivo:
                {
                    qg.showToast({
                        message: msg,
                    })
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    qq.showToast({
                        title: msg,
                        duration: 3000
                    })
                    break;
                }
            case Game_Platform.GP_Test:
                console.log('ASCSDK', 'Test 打包后会有真实效果:', msg);
                break;
            default:
                break;
        }
    }


    /**
     * 手机震动
     */
    public phoneVibrate(type: string) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    if (type == 'short') {
                        qg.vibrateShort({
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { }
                        })
                    }
                    if (type == 'long') {
                        qg.vibrateLong({
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { }
                        })
                    }
                    break;
                }
            case Game_Platform.GP_Vivo:
                {
                    if (type == 'short') {
                        qg.vibrateShort()
                    }
                    if (type == 'long') {
                        qg.vibrateLong()
                    }
                    break;
                }
            case Game_Platform.GP_Tiktok:
                {
                    if (type == 'long') {
                        tt.vibrateLong({
                            success(res) {
                            },
                            fail(res) {
                                console.log("ASCSDK", 'Tiktok vibrateLong调用失败');
                            }
                        });
                    }
                    else if (type == 'short') {
                        tt.vibrateShort({
                            success(res) {
                                //console.log(`${res}`);
                            },
                            fail(res) {
                                console.log("ASCSDK", 'Tiktok vibrateShort调用失败');
                            }
                        });
                    }
                    break;
                }
            case Game_Platform.GP_QQ:
                {
                    if (type == 'long') {
                        qq.vibrateLong({
                            success(res) {
                            },
                            fail(res) {
                                console.log("ASCSDK", 'QQ vibrateLong调用失败');
                            }
                        });
                    }
                    else if (type == 'short') {
                        qq.vibrateShort({
                            success(res) {
                            },
                            fail(res) {
                                console.log("ASCSDK", 'vibrateShort调用失败');
                            }
                        });
                    }
                    break;
                }
            case Game_Platform.GP_Test:
                console.log("ASCSDK", 'Test 手机震动，需要在打包后会有真实效果:', type);
                break;
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"shakePhone","calling_method_params":${type}}`);
                break;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("AppController", "shakePhone:", type);
                break;
            default:
                break;
        }
    }


    /**
     * OPPO数据上报
     */
    reportMonitor() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Oppo:
                {
                    if (qg.getSystemInfoSync().platformVersionCode < 1060) {
                        return;
                    }
                    qg.reportMonitor('game_scene', 0)
                    break;
                }
            default:
                break;
        }
    }


    /**
     * 退出游戏
     */
    public exitTheGame() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{'calling_method_name':'exit'}`);
                break;
            case Game_Platform.GP_IOS:
                cc.game.end();
                break;
            default:
                break;
        }
    }


    /**
     * 事件上报
     */
    public reportAnalytics(params, data) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"reportAnalytics","calling_method_params":{"eventName":${params},"data":${data}}}`);
                break;
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("AppController", "showUMWithType:withData:", params, JSON.stringify(data));
                break;
            default:
                break;
        }
    }


    /**
     * 实名认证(防沉迷)
     */
    public showAuthentication(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showAuthentication","calling_method_params":0}`);
                break;
            case Game_Platform.GP_IOS:
                showAuthenticationCallback = callback;
                jsb.reflection.callStaticMethod("AppController", "showAuthentication");
                break;
            default:
                break;
        }
    }
    /**
     * 游客体验
     */
    public TouristModel(callback) {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"TouristModel","calling_method_params":0}`);
                break;
            case Game_Platform.GP_IOS:
                break;
            default:
                break;
        }
    }


    /**
     * oppo超休闲（首页更多游戏）
     */
    public showOPPOMoreGame() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_Android:
                jsb.reflection.callStaticMethod("com/asc/sdk/ndk/AndroidNDKHelper", "ReceiveCppMessage", "(Ljava/lang/String;)V", `{"calling_method_name":"showOPPOMoreGame","calling_method_params":0}`);
                break;
            default:
                break;
        }
    }


    /**
     * 是否有网络
     */
    public IsOnLine() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_IOS:
                if (navigator.onLine) {
                    return true;
                }
                else {
                    return false;
                }
            default:
                return false;
        }
    }


    /**
     * 展示评论
     */
    public showReviewAlert() {
        switch (SdkTools.getPlatform()) {
            case Game_Platform.GP_IOS:
                jsb.reflection.callStaticMethod("AppController", "showReviewAlert");
                break;
            default:
                break;
        }
    }
}
export default OtherFunctions

//防沉迷回调
{
    (<any>window).showAuthenticationCallback = function (result: string) {
        console.log("showAuthenticationCallback", showAuthenticationCallback)
        showAuthenticationCallback && showAuthenticationCallback(result == "1");
        return "callback suc"
    }
}