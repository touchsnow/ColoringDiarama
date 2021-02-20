import { _decorator, Component, Node, LabelOutlineComponent, LabelComponent, Material } from 'cc';
import AudioManager from '../../../../Framework3D/Src/Base/AudioManager';
import { ColoringDioramaModel } from '../../../Data/ColoringDioramaModel';
import { SellectUI } from '../SellectUI';
const { ccclass, property } = _decorator;

@ccclass('ModelItemBase')
export class ModelItemBase extends Component {

    @property(LabelComponent)
    label: LabelComponent = null

    @property(Material)
    uiMat:Material = null

    @property(Material)
    cutFaceMat:Material = null

    @property(LabelComponent)
    sameModelLabel:LabelComponent = null

    @property(Node)
    checkNode:Node = null

    @property(Node)
    sellectBg:Node = null

    public finished:boolean = false

    protected sellectUI:SellectUI = null

    init(...agrs) { 
        this.sellectUI = agrs[0]
    }

    sellect(agrs?) { }

    cancleSellect(agrs?) { }

    updateDisplay(){}

    onTouch(lock = true){
        AudioManager.getInstance().playEffectByPath("Click02")
      //  console.log("进行了Ontouch")
    }

}
