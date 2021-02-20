import DialogRootNode from "./DialogRootNode";
import { _decorator, Node, Prefab, Tween, loader, instantiate } from "cc";

const { ccclass, property } = _decorator;

// 窗口列表item
class DialogListItem {
    // 窗口名称
    name: string = '';
    // 窗口实例化的节点
    view: Node = null;
    // 窗口是否加载完成
    isLoaded: boolean = false;

    public constructor(name: string, view: Node, isLoaded: boolean) {
        this.name = name;
        this.view = view;
        this.isLoaded = isLoaded;
    }
}

// 窗口延迟加载列表item
class DelayBindListItem {
    // 窗口名称
    name: string = '';
    // 窗口预知体
    prefab: Prefab = null;
    // 窗口初始化数据
    data: any = false;

    public constructor(name: string, prefab: Prefab, data: any) {
        this.name = name;
        this.prefab = prefab;
        this.data = data;
    }
}

@ccclass
export default class DialogManager {
    private static instance: DialogManager = null;
    //窗口资源根目录
    _prefix: string = 'Dialog/';
    //窗口父节点
    _dlgRoot: DialogRootNode = null;
    //当前展示的对话框列表
    _showDlgList: DialogListItem[] = [];
    //已关闭但资源未释放列表
    _removeDlgList: DialogListItem[] = [];
    //资源未加载完成，窗口已经关闭，延时自动释放资源
    _delayAutoRemove: string[] = [];
    //先加载资源，后绑定父节点列表
    _delayBindList: DelayBindListItem[] = [];
    //Dialog根节点预知体
    _dlgRootNodePrefab: Prefab = null;
    
    public static getInstance(): DialogManager {
        if (!DialogManager.instance) {
            DialogManager.instance = new DialogManager();
        }
        return DialogManager.instance;
    }

    //每个场景的dlgRoot节点不相同
    reset() {
        this._dlgRoot = null;
    }

    init(dlgRootNode: Node) {
        this._dlgRoot = dlgRootNode.getComponent(DialogRootNode);
        if (this._delayBindList.length > 0) {
            this.delayBind();
        }
        console.log(this._dlgRoot)
    }

    setDlgRootNodePrefab(prefab) {
        this._dlgRootNodePrefab = prefab;
    }

    getDlgRootNodePrefab() {
        return this._dlgRootNodePrefab;
    }

    //调用了showDlg就把dlg加入列表，等资源加载完成后再设置view
    setView(dlgName: string, view: Node) {
        let find = true;
        for (let i = this._showDlgList.length - 1; i >= 0; i--) {
            let element = this._showDlgList[i];
            if (element.name == dlgName) {
                element.view = view;
                element.isLoaded = true;
                find = true;
                break
            }
        }
        if (!find) {
            console.log(`没有找到 ${dlgName} , 不能添加view`)
        }
        return find;
    }

    //绑定父节点
    setParent(dlgName: string, prefab: Prefab, data: any) {
        let isInstantAdd = true;
        let lastElement
        this.find(dlgName, (element, index) => {
            // 多于一个窗口，需要检查上个窗口有没加载成功，确保节点顺序正确
            if (index - 1 >= 0) {
                lastElement = this._showDlgList[index - 1];
                console.log(`${dlgName}的上一个窗口${lastElement.name} 加载状态: ${lastElement.isLoaded}`);
                if (!lastElement.isLoaded) {
                    this._delayBindList.push({
                        name: dlgName,
                        prefab: prefab,
                        data: data
                    });
                    this._delayBindList.push(new DelayBindListItem(dlgName, prefab, data));
                    isInstantAdd = false;
                    return;
                }
            }
        })
        if (!isInstantAdd) {
            console.log(`延时绑定窗口${dlgName}，因为上一个窗口${lastElement.name}未加载完成`)
            return;
        }
        let view = instantiate(prefab);
        //添加到dlg列表的时候，没有设置view
        this.setView(dlgName, view);
        view.parent = this._dlgRoot.node;
        if (this._dlgRoot) {
            !this._dlgRoot.isBlockInputShow() && this._dlgRoot.showBlockInput(true);
            this._dlgRoot.setBlockInputZOrder(this._dlgRoot.node.children.length - 2);
        }
        let baseDlg = view.getComponent('BaseDialog');
        if (baseDlg != null) {
            baseDlg.initData(data);
        }
        // 每添加一个窗口检查一次延迟加载列表是否可以加载
        if (this._delayBindList.length > 0) {
            for (let i = 0; i < this._showDlgList.length; i++) {
                const element = this._showDlgList[i];
                if (element.name == dlgName) {
                    if (i < this._showDlgList.length - 1) {
                        let next = this._showDlgList[i + 1];
                        if (!next.isLoaded) {
                            this.bindOne(next.name);
                        }
                    }
                }
            }

        }
    }

    //添加到显示列表，此时资源未加载完成
    add(dlgName: string, view: Node): void {
        this._showDlgList.push(new DialogListItem(dlgName, view, false));
    }

    //寻找一个dlg
    find(dlgName: string, calllback: Function = null): DialogListItem {
        for (let i = this._showDlgList.length - 1; i >= 0; i--) {
            let element = this._showDlgList[i];
            if (element.name == dlgName) {
                if (calllback) {
                    calllback(element, i);
                }
                return element;
            }
        }
        return null;
    }

    //移除一个dlg
    remove(dlgName: string): boolean {
        for (let i = this._showDlgList.length - 1; i >= 0; i--) {
            let element = this._showDlgList[i];
            if (element.name == dlgName) {
                let dlgs = this._showDlgList.slice(i, i + 1);
                this._removeDlgList.push(dlgs[0]);
                this._showDlgList.splice(i, 1);
                return true
            }
        }
        return false
    }

    //延时绑定父节点
    delayBind(): void {
        for (let i = 0; i < this._delayBindList.length; i++) {
            const element = this._delayBindList[i];
            // cc.log(`延时挂载窗口，${element.name}`);
            this.setParent(element.name, element.prefab, element.data);
        }
    }

    //延迟列表中的一个元素立刻绑定付节点
    bindOne(name): void {
        for (let i = 0; i < this._delayBindList.length; i++) {
            const element = this._delayBindList[i];
            // cc.log(`延时挂载窗口，${element.name}`);
            if (name == element.name) {
                this.setParent(element.name, element.prefab, element.data);
            }
        }
    }

    //显示一个dlg
    showDlg(dlgName: string, data: any = null): void {
        console.log("显示一个Dialog")
        let dlg: DialogListItem = this.find(dlgName);
        console.log(dlg)
        if (dlg != null) {
            return;
        }
        //加载资源
        this.loadDlg(dlgName, data);
    }

    //关闭dlg
    hideDlg(dlgName: string, tween:Tween = null, delay: boolean = null) {
        let dlg: DialogListItem = this.find(dlgName);
        let release = true;
        if (dlg == null) {
            return false
        } else {
            if (typeof delay == 'boolean' && delay == true) {
                if (dlg.isLoaded == false) {
                    this._delayAutoRemove.push(dlgName)
                    return true
                }
            }
        }
        //从列表移除
        this.remove(dlgName);
        // 关闭最后一个dlg，隐藏blockinput
        if (this._showDlgList.length == 0) {
            if (this._dlgRoot && this._dlgRoot.isBlockInputShow()) {
                this._dlgRoot.showBlockInput(false);
            }
        } else {
            // 提前设置好blockinput的渲染顺序
            this._dlgRoot && this._dlgRoot.setBlockInputZOrder(this._dlgRoot.node.children.length - 3);
        }
        //延时自动释放的dlg，已经加载出来了，立马释放
        if (release) {
            if (tween) {
                tween.call(() => {
                    this.releaseDlg(dlgName);
                }).start();
            } else {
                this.releaseDlg(dlgName);
            }
        }
        return true;
    }

    //释放dlg
    releaseDlg(dlgName: string) {
        let find = false;
        for (let i = 0; i < this._removeDlgList.length; i++) {
            let element = this._removeDlgList[i];
            if (element.name == dlgName) {
                if (element.isLoaded == true) {
                    element.view.removeFromParent();
                }
                this._removeDlgList.splice(i, 1);
                find = true;
                break
            }
        }
        if (find) {
            // cc.loader.releaseRes(this._prefix + dlgName)
        }
    }

    //关闭所有窗口
    hideAllDlg(): void {
        if (this._showDlgList.length > 0) {
            for (let i = this._showDlgList.length - 1; i >= 0; i--) {
                const element = this._showDlgList[i];
                if (element.isLoaded == true) {
                    if (element.view.isValid) {
                        element.view.getComponent("BaseDialog").onTouchClose(null, null, true);
                    } else {
                        this.hideDlg(element.name);
                    }
                }
            }
        }
    }

    //获取上一个dlg
    getLastDlg(): Node {
        let length = this._showDlgList.length;
        if (length >= 2) {
            return this._showDlgList[length - 2].view;
        }
        return null;
    }

    //加载资源
    loadDlg(dlgName: string, data: any = null) {
        //先添加到dlg列表，防止多次点击问题
        this.add(dlgName, null);
        loader.loadRes(this._prefix + dlgName, Prefab, (err: Error, prefab: Prefab): void => {
            if (err) {
                console.log(err)
                return
            }
            console.log(prefab)
            let index = this._delayAutoRemove.indexOf(dlgName);;
            if (index != -1) {
                // cc.log(StringFunctions.format('网速太快，不展示{0}，直接释放{0}资源', dlgName))
                this._delayAutoRemove.splice(index, 1);
                this.remove(dlgName);
                this.releaseDlg(dlgName);
            } else {
                if (this._dlgRoot == null) {
                    console.log('延时加载窗口：' + dlgName)
                    this._delayBindList.push(new DelayBindListItem(dlgName, prefab, data));
                } else {
                    console.log('已加载窗口：' + dlgName)
                    this.setParent(dlgName, prefab, data);
                }
            }
        })
    }
}
