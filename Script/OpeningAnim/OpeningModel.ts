import { _decorator, Component, Node, ModelComponent, loader, CCInteger, CCString, instantiate } from 'cc';
import { ColoringDioramaModel } from '../Data/ColoringDioramaModel';
const { ccclass, property } = _decorator;

@ccclass('OpeningModel')
export class OpeningModel extends Component {

    @property(Node)
    modelRoot: Node = null

    @property(CCString)
    modelPath: string = ""

    modelList: ColoringDioramaModel[] = []

    start() {
        let model = instantiate(loader.getRes(this.modelPath)) as Node
        model.setParent(this.node)
        this.modelRoot = model
        this.scheduleOnce(() => {
            this.searchColorModel(this.modelRoot)
        }, 0)
    }

    searchColorModel(node: Node) {
        for (let model of node.children) {
            let colorModel = model.getComponent(ColoringDioramaModel)
            if (colorModel) {
                this.modelList.push(colorModel)
            }
            this.searchColorModel(model)
        }
    }

}
