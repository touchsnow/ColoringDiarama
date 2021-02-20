import BaseScene from "../Base/BaseScene";
import UIUtility from "../Base/UIUtility";
import { Prefab, _decorator, ProgressBarComponent, LabelComponent, Color, log, warn, loader, Asset, CCString, instantiate, Node, tween, sys, UIOpacityComponent } from "cc";
import sdkConfig from "../AD/sdkConfig";
import PlatformManager from "./PlatformManager";
import ASCAd from "../AD/ASCAd";
import BaseEventResolve from "../Analytics/BaseEventResolve";
import AnalyticsManager, { EAnalyticsEvent } from "../Analytics/AnalyticsManager";
import SdkTools, { Game_Platform } from "../AD/tools/SdkTools";
import PrivacyPolicyUI from "./PrivacyPolicyUI";

const { ccclass, property } = _decorator;

@ccclass('DirAsset')
export class DirAsset {
    @property
    url: string = '';
};

@ccclass('TTEventResolve')
export class TTEventResolve {
    @property({
        displayName: 'id（变量名）',
    })
    id: string = '';

    @property({
        displayName: '事件名（中文）',
    })
    name: string = '';
};

@ccclass
export default class BaseLoadingScene extends BaseScene {
    @property({
        displayName: '广告配置文件根目录的名称',
        override: true
    })
    appName: string = "";

    @property({
        displayName: 'AppId',
        tooltip: '必填，cocos service创建的游戏ID',
    })
    cocosAppId: string = '';

    @property({
        type: Prefab,
        displayName: 'Dialog的根节点预制体',
        tooltip: '必填，请拖拽Framework3D/Res/DialogRootNode.prefab（推荐），如需定制窗口根节点，请在resources的Prefab文件夹下新建DialogRootNode节点',
        override: true
    })
    dialogRootNodePrefab: Prefab = new Prefab;
    @property({
        type: Prefab,
        displayName: 'TopTip预制体',
        tooltip: '必填，请拖拽Framework3D/Res/TopTip.prefab（推荐）',
        override: true
    })
    topTipPrefab: Prefab = new Prefab;

    @property({
        type: Prefab,
        displayName: 'PrivacyPolicyUI预制体',
        tooltip: "必填，华为平台隐私协议,请拖拽Framework/Res/PrivacyPolicyUI.prefab",
    })
    privacyPolicyUIPrefab: Prefab = null;
    @property({
        type: Node,
        displayName: '华为健康游戏首屏',
        tooltip: "2d必填，3d可不填",
    })
    healthGameFirstScreen: Node = null;
    @property({ type: ProgressBarComponent })
    progressBar: ProgressBarComponent = null;
    @property({ type: LabelComponent })
    progressLabel: LabelComponent = null;
    @property({ type: DirAsset })
    resDirs: DirAsset[] = [];
    @property({ type: TTEventResolve })
    ttEventResolves: TTEventResolve[] = [];

    private eventResolve: any = null

    _isHuaWeiAgree: boolean = false;//华为隐私服务是否同意
    _isLoadFinish: boolean = false;//资源是否加载完成

    start() {
        if (!this.appName) {
            console.error('必须先配置广告目录');
            return;
        }
        if (!this.cocosAppId) {
            console.warn('Cocos Service的AppId没填！！！');
            return;
        }

        if (SdkTools.getPlatform() == Game_Platform.GP_HuaWei) {
            /**
             * 华为隐私协议界面
             */

            let privacyCallBack = function () {
                let callBack = function (isAgree) {
                    this._isHuaWeiAgree = isAgree;
                    if (this._isLoadFinish && this._isHuaWeiAgree) {
                        this.setHuaWeiPolicy()
                        this.onLoadResFinished();
                    }
                }.bind(this);
                if (!this.getHuaWeiPolicy()) {
                    let node = instantiate(this.privacyPolicyUIPrefab);
                    node.getComponent(PrivacyPolicyUI).initUI(callBack);
                    this.node.addChild(node);
                } else {
                    callBack(true);
                }
            }.bind(this);

            /**是否有首屏 */
            if (this.healthGameFirstScreen) {
                this.healthGameFirstScreen.getComponent(UIOpacityComponent).opacity = 255;//健康游戏界面展示
                tween(this.healthGameFirstScreen.getComponent(UIOpacityComponent))
                    .to(1, { opacity: 0 })
                    .call(() => {
                        privacyCallBack();
                    })
                    .start()
            } else {
                privacyCallBack();
            }
        }
        //数据上报
        ASCAd.getInstance().reportMonitor();
        //广告配置文件的路径
        sdkConfig.getInstance().configUrl = `https://config-1259481479.cos.ap-guangzhou.myqcloud.com/BenFei/AD/${this.appName}/${PlatformManager.getInstance().getChannel()}/config.json`;
        //初始化entity
        this.onInitEntity()
        //设置toptip预制体
        UIUtility.getInstance().init(this.topTipPrefab);
        //网络检测
        let isNotOnLine: boolean = navigator && !navigator.onLine;
        // 测试用
        // isNotOnLine = true;
        if (isNotOnLine) {
            UIUtility.getInstance().showTopTips('当前无网络，请联网后重新尝试', Color.RED);
            return;
        }
        // 初始化数据统计sdk
        let es = this.getEventResolve();
        let array = [];
        for (let i = 0; i < this.ttEventResolves.length; i++) {
            const element = this.ttEventResolves[i];
            array.push([element.id, element.name]);
        }
        es.init(array);
        AnalyticsManager.getInstance().init(this.cocosAppId, es);
        // 登陆
        AnalyticsManager.getInstance().login(EAnalyticsEvent.Start);
        // 首帧事件
        AnalyticsManager.getInstance().raiseCustomEvent(EAnalyticsEvent.Success, {
            name: "场景事件",
            eventName: "首帧",
        })
        super.start();
        let isCocos240 = typeof cc.resources != 'undefined';
        let allUuids = [];
        if (isCocos240) {
            //@ts-ignore
            let map = cc.resources._config.assetInfos._map;
            for (const key in map) {
                if (Object.prototype.hasOwnProperty.call(map, key)) {
                    const element = map[key];
                    if (element.path) {
                        for (let i = 0; i < this.resDirs.length; i++) {
                            const resDir = this.resDirs[i];
                            const path = resDir.url + '/';
                            if (element.path.substr(0, path.length) === path) {
                                allUuids.push(element.path);
                                break
                            }
                        }
                    }
                }
            }
        } else {
            // 2.4之前
            const uuids = Object.keys(loader._assetTables.assets._pathToUuid);
            for (let i = 0; i < uuids.length; i++) {
                const uuid = uuids[i];
                for (let i = 0; i < this.resDirs.length; i++) {
                    const resDir = this.resDirs[i];
                    if (uuid.indexOf(resDir.url) > -1) {
                        allUuids.push(uuid);
                        break
                    }
                }
            }
        }
        //console.log('allUuids.length: ', allUuids);
        if (allUuids.length > 0) {
            if (this.progressBar) {
                this.progressBar.node.active = true;
            }
            if (this.progressLabel) {
                this.progressLabel.node.active = true;
            }
            //@ts-ignore
            UIUtility.getInstance().loadRes(allUuids, Asset, (completedCount, totalCount) => {
                let progress = completedCount / totalCount;
                if (isNaN(progress)) {
                    return;
                }
                this.setProgress(progress);
            }, (err) => {
                if (err) {
                    warn(err);
                    return;
                }
                this.scheduleOnce(() => {
                    log('loadResDir finished!!!');
                    if (SdkTools.getPlatform() == Game_Platform.GP_HuaWei) {
                        this._isLoadFinish = true;
                        if (this._isLoadFinish && this._isHuaWeiAgree) {
                            this.onLoadResFinished();
                        }
                    } else {
                        this.onLoadResFinished();
                    }
                }, 0);
            });
        } else {
            // this.setProgress(1);
            if (this.progressBar) {
                this.progressBar.node.active = false;
            }
            if (this.progressLabel) {
                this.progressLabel.node.active = false;
            }
            if (SdkTools.getPlatform() == Game_Platform.GP_HuaWei) {
                this._isLoadFinish = true;
                if (this._isLoadFinish && this._isHuaWeiAgree) {
                    this.onLoadResFinished();
                }
            } else {
                this.onLoadResFinished();
            }
        }
    }

    onInitEntity() {

    }

    onLoadResFinished() {
        
    }

    getEventResolve() {
        if (this.eventResolve == null) {
            this.eventResolve = new BaseEventResolve();
        }
        return this.eventResolve;
    }

    setProgress(progress: any) {
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
        if (this.progressLabel) {
            this.progressLabel.string = `${(progress * 100).toFixed(2)}%`;
        }
    }

    setHuaWeiPolicy(): void {
        let data = JSON.stringify(true);
        sys.localStorage.setItem("HuaWeiPolicy_2", data);
    }

    getHuaWeiPolicy(): any {
        let data = sys.localStorage.getItem("HuaWeiPolicy_2");
        if (data) {
            let value = JSON.parse(data);
            return typeof value == 'undefined' || value == null ? false : value;
        }
        return false;
    }
}
