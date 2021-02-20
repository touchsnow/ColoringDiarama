import { _decorator, Node, EventHandler, ButtonComponent, Color, find, instantiate, Prefab, Asset, loader, director } from 'cc';
import DialogManager from "./DialogManager";
import TopTip from './TopTip';

const { ccclass } = _decorator;

@ccclass
export default class UIUtility {
    private static instance: UIUtility;
    private toptipPrefab: Prefab = null;

    public static getInstance(): UIUtility {
        if (!UIUtility.instance) {
            UIUtility.instance = new UIUtility();
        }
        return UIUtility.instance;
    }

    init(prefab) {
        this.toptipPrefab = prefab;
    }

    registerClick(target: Node, component: string, name: string, handler: string, customEventData: string): boolean {
        let node: Node = find(name, target);
        if (node) {
            return this.registerClickByNode(target, component, node, handler, customEventData);
        }
        return false;
    }

    registerClickByNode(target: Node, component: string, node: Node, handler: string, customEventData: string): boolean {
        let ret = false
        let clickEventHandler = new EventHandler();
        clickEventHandler.target = target;
        clickEventHandler.component = component;
        clickEventHandler.handler = handler;
        clickEventHandler.customEventData = customEventData;
        if (node != undefined) {
            let button = node.getComponent(ButtonComponent)
            if (button == undefined) {
                button = node.addComponent(ButtonComponent);
            }
            if (button.clickEvents.length == 0) {
                button.clickEvents.push(clickEventHandler);
            } else {
                console.log(`【UI工具】- 已有点击事件监听，请检查节点的点击事件 - ${component} - ${handler}`)
            }
            ret = true;
        } else {
            console.log(`【UI工具】- 不可以为空节点注册点击事件 - ${component} - ${handler}`)
        }
        return ret;
    }

    revisePropertyString(gold: number, unit: string) {
        if (typeof gold != 'number') {
            return '';
        }
        if (gold > 9999) {
            gold = gold / 10000
            let str = gold.toFixed(1);
            if (unit) {
                return str.substring(0, str.lastIndexOf('.') + 3) + unit
            }
            return str.substring(0, str.lastIndexOf('.') + 3) + 'w'
        } else {
            let str = gold.toFixed(1);
            return str.substring(0, str.lastIndexOf('.'))
        }
    }

    reviseNumString(num: number) {
        if (num < 10) {
            return '0' + num
        } else {
            return '' + num
        }
    }

    loadScene(name) {
        DialogManager.getInstance().hideAllDlg();
        DialogManager.getInstance().reset();
        director.loadScene(name);
    }

    loadRes(url: any, type: typeof Asset, progressCallback: (finish: number, total: number, item: any) => void, completeCallback: (error: Error, resource: any) => void): void {
        if (typeof cc.resources != 'undefined') {
            cc.resources.load(url, type, progressCallback, completeCallback);
        } else {
            if (typeof url == 'string') {
                loader.loadRes(url, type, progressCallback, completeCallback);
            } else if(url instanceof Array) {
                loader.loadResArray(url, type, progressCallback, completeCallback);
            }
        }
    }

    showTopTips(tips, color: Color = Color.WHITE) {
        let f: Function = (prefab: Prefab) => {
            let canvas = find('Canvas');
            if (canvas) {
                let node = instantiate(prefab);
                node.parent = canvas;
                node.getComponent(TopTip).setData(tips, color);
            }
        }
        if (this.toptipPrefab != null) {
            f(this.toptipPrefab);
        } else {
            this.loadRes('Prefab/TopTip', Prefab, null, (err: Error, prefab: Prefab) => {
                if (err) {
                   // console.log(err);
                   // console.log('未在loading场景设置toptip预制体');
                   // console.log(tips);
                    return;
                }
                f(prefab);
            })
        }
    }
}
