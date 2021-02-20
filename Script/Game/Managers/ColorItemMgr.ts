import { _decorator, Component, Node, instantiate, loader } from 'cc';
import { ColorItem } from '../../View/UI/ColorItem';
import { PaintingModel } from '../PaintingModel';
const { ccclass, property } = _decorator;

@ccclass('ColorItemMgr')
export class ColorItemMgr extends Component {

    public colorItem: ColorItem[] = []

    public currentItem: ColorItem = null

    public paintingModel: PaintingModel = null

    init(paintingModel: PaintingModel) {
        this.paintingModel = paintingModel
        let colorModel = this.paintingModel.model
        let colorDic = this.paintingModel.model.colorIndexDic
        let num = 0
        for (let i of colorDic.values()) {
            //初始化涂色列表
            num += 1
            let colorItem = instantiate(loader.getRes("UI/ColorItem"))
            colorItem.setParent(this.node.getChildByPath("view/content"))
            let colorItemClass = colorItem.getComponent(ColorItem)
            colorItemClass.init(i, num, colorModel, this)
            this.colorItem.push(colorItemClass)
        }
    }

    sellectColorNum(colorItem: ColorItem) {
        let num = colorItem.num - 1
        if (this.currentItem) {
            this.paintingModel.CancleColorNum(this.currentItem.num - 1)
            this.currentItem.cancle()
        }
        this.paintingModel.sellectColorNum(num)
        this.currentItem = colorItem
        this.currentItem.sellect()
    }

    sellectAColor() {
        for(let i of this.colorItem){
            if(!i.finished){
                this.sellectColorNum(i)
                break
            }
        }
    }

    playFakeAnim(callback = null) {
        for (let i of this.colorItem) {
            i.playFakeAnim()
        }
        this.scheduleOnce(() => {
            if (callback) callback()
        }, 1.2)
    }

    playProgressAnim(){
        for (let i of this.colorItem) {
            i.playProgressAnim()
        }
    }

    updateDisplay(){
        for(let item of this.colorItem){
            item.updateDisplay()
        }
    }
}
