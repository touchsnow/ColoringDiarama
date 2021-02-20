import { _decorator, Component, Node, instantiate, loader } from 'cc';
import { MotherModelItem } from './ModelItem/MotherModelItem';
import { SubModelItem } from './ModelItem/SubModelItem';
const { ccclass, property } = _decorator;

@ccclass('SubScrollViewMgr')
export class SubScrollViewMgr extends Component {

    public matherItem: MotherModelItem = null

    public subItemList: SubModelItem[] = []

    init(items, sellectUI) {
        for (let subModel of items) {
            //if (subModel[0].parentName === matherMdoelName) {
            let subModelItem = instantiate(loader.getRes("UI/SubModelItem"))
            let subItem = subModelItem.getComponent(SubModelItem)
            subItem.init(sellectUI, subModel, this)
            subModelItem.setParent(this.node.getChildByPath("view/content"))
            this.subItemList.push(subItem)
            //}
        }
        this.node.active = false
    }

    enable() {
        this.node.active = true
        this.updateDisplay()
        this.sellectAItem()
    }

    disable(item) {
        if (!this.subItemList.includes(item)) {
            this.node.active = false
            this.matherItem.cancleSellectBySubModel()
        }
    }

    sellectAItem() {
        for (let i = 0; i < this.subItemList.length; i++) {
            if (!this.subItemList[i].finished) {
                this.subItemList[i].onTouch()
                break
            } else if (i == this.subItemList.length - 1) {
                this.subItemList[i].onTouch()
                break
            }
        }

    }

    updateDisplay() {
        for (let i of this.subItemList) {
            i.updateDisplay()
        }
    }
}
