import { _decorator, Component, Node, Material, ModelComponent, tween, math, Vec2, Vec3, Quat, textureUtil, game, quat, loader } from 'cc';
import { ColoringDioramaModel } from '../../Data/ColoringDioramaModel';
import { LevelInfo } from '../../Data/LevelInfo';
import { StaticModel } from '../../Data/StaticModel';
import { SellectShaderAnim } from '../../View/Anim/SellectShaderAnim';
import { PaintingModel } from '../PaintingModel';
import { GFXOpearte } from '../Uitls/GFXOpearte';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('ModelMgr')
export class ModelMgr extends Component {

    @property(Material)
    paintedMat: Material = null

    @property(Material)
    paintedSellectMat: Material = null

    @property(Material)
    unpaintMat: Material = null

    @property(Material)
    unpaintSellectMat: Material = null

    @property(Material)
    lineMat: Material = null

    @property(Material)
    trangleMat: Material = null

    @property(Material)
    unLitMat: Material = null

    @property(Material)
    cutFaceMat: Material = null

    modelPoint: Node = null
    /**选择模式的旋转节点 */
    @property(Node)
    rotatePoint: Node = null
    /**填涂模式的旋转节点 */
    @property(Node)
    paintingRotatePoint: Node = null

    private promotyNode: Node = null

    public middleEffect :Node = null

    

    @property(Node)
    numPoint: Node = null
    /**模型原始四原数 */
    public originalRotate: Quat = new Quat()
    public originalPaintingRotate: Quat = new Quat()
    /**模型词典 key:模型名字，value:模型类列表 */
    public modelDic: Map<string, ColoringDioramaModel[]> = new Map<string, ColoringDioramaModel[]>()
    /**母模型词典 key:母模型的名字，value:母模型下的子模型类*/
    public motherModelDic: Map<string, ColoringDioramaModel[][]> = new Map<string, ColoringDioramaModel[][]>()
    /**子模型词典 key:母模型下的子模型名字，value:模型类列表 */
    public subModelDic: Map<string, ColoringDioramaModel[]> = new Map<string, ColoringDioramaModel[]>()
    /**正在涂色的模型 */
    public paintingModel: PaintingModel = null
    /**正在被选择的模型 */
    public sellectModel: ColoringDioramaModel = null
    /**已经填涂过的模型 */
    public paintedModelDic: Map<string, PaintingModel> = new Map<string, PaintingModel>()

    init(modelNode: Node, level: LevelInfo) {
        this.rotatePoint.setRotationFromEuler(level.ModelPointRotate[0], level.ModelPointRotate[1], level.ModelPointRotate[2])
        this.paintingRotatePoint.setRotationFromEuler(level.ModelPointRotate[0], level.ModelPointRotate[1], level.ModelPointRotate[2])
        modelNode.setParent(this.rotatePoint)
        this.modelPoint = modelNode.children[0].children[0]
        this.originalRotate = this.rotatePoint.getWorldRotation()
        this.originalPaintingRotate = this.paintingRotatePoint.getWorldRotation()
    }

    initModel() {
        //初始化模型
        this.modelDic.forEach((value, key) => {
            value.forEach(element => {
                element.lineModel = GFXOpearte.generateModel(element.node, element.lineModelAttr, this.lineMat)
                element.setMat(element.originalModel, this.paintedMat)
                element.setMat(element.cutFaceModel, this.cutFaceMat)
                element.lineModelState = false
                element.updateMeshStorgeData()
                element.updateMesh(null, false)
            })
        })
        this.motherModelDic.forEach((value, key) => {
            value.forEach(element => {
                element.forEach(subElement => {
                    subElement.lineModel = GFXOpearte.generateModel(subElement.node, subElement.lineModelAttr, this.lineMat)
                    subElement.setMat(subElement.originalModel, this.paintedMat)
                    subElement.setMat(subElement.cutFaceModel, this.cutFaceMat)
                    subElement.lineModelState = false
                    subElement.updateMeshStorgeData()
                    subElement.updateMesh(null, false)
                })
            })
        })
    }

    /**收集&分类模型脚本 */
    fatchModelInfo(node: Node) {
        //console.info("收集&分类模型脚本")
        for (let i = 0; i < node.children.length; i++) {
            let modelInfo = node.children[i].getComponent(ColoringDioramaModel)
            if (modelInfo) {
                let modeName = modelInfo.modelName
                //console.log(modeName)
                let value = this.modelDic.get(modeName)
                if (value) {
                    value.push(modelInfo)
                }
                else {
                    this.modelDic.set(modeName, [modelInfo])
                }
            }
            else {
                let sonInfoList: Array<Array<ColoringDioramaModel>> = new Array<Array<ColoringDioramaModel>>()
                let motherNode = node.children[i]
                for (let j = 0; j < motherNode.children.length; j++) {
                    // let sonModelInfo = motherNode.children[j].getComponent(ColoringDioramaModel)
                    // if (sonModelInfo) {
                    //     sonInfoList.push(sonModelInfo)
                    //     let value = this.subModelDic.get(sonModelInfo.modelName)
                    //     if (value) {
                    //         value.push(sonModelInfo)
                    //     } else {
                    //         this.subModelDic.set(sonModelInfo.modelName, [sonModelInfo])
                    //     }
                    // }

                    let sonModelInfo = motherNode.children[j].getComponent(ColoringDioramaModel)
                    if (sonModelInfo) {
                        if (sonInfoList.length === 0) {
                            sonInfoList.push([sonModelInfo])
                            //console.info(sonInfoList)
                        }
                        else {
                            for (let index = 0; index < sonInfoList.length; index++) {
                                //console.info(index)
                                if (sonInfoList[index][0].modelName == sonModelInfo.modelName) {
                                    sonInfoList[index].push(sonModelInfo)
                                    break
                                }
                                if (index == sonInfoList.length - 1) {
                                    sonInfoList.push([sonModelInfo])
                                    break
                                }
                            }
                        }
                    }
                }
                if (sonInfoList.length > 0) {
                    this.motherModelDic.set(motherNode.name, sonInfoList)
                }
            }
        }
    }

    /**
     * 返回同一组填涂的模型
     * @param node 模型节点
     */
    getModelGroup(node: Node): ColoringDioramaModel[] {
        let motherName = node.parent.name
        let sonModels = this.motherModelDic.get(motherName)
        if (sonModels) {
            let modelList = []
            for (let i of sonModels) {
                for (let j of i) {
                    modelList.push(j)
                }
            }
            return modelList
        }
        let modelName = node.getComponent(ColoringDioramaModel).modelName
        let modelList = this.modelDic.get(modelName)
        if (modelList) {
            return modelList
        }
        return null
    }

    /**
    * 返回同一模型列表
    * @param node 模型节点
    */
    getSameModelList(node: Node): ColoringDioramaModel[] {
        let motherName = node.getComponent(ColoringDioramaModel).parentName
        let sonModels = this.motherModelDic.get(motherName)
        let modelName = node.getComponent(ColoringDioramaModel).modelName

        if (sonModels) {
            //let modelName = node.getComponent(ColoringDioramaModel)
            for (let i of sonModels) {
                if (i[0].modelName == modelName) {
                    return i
                }
            }
            // let modelList = this.subModelDic.get(node.getComponent(ColoringDioramaModel).modelName)
            // if (modelList) return modelList
        }
        let modelList = this.modelDic.get(modelName)
        if (modelList) return modelList
        return null
    }

    /**
     * 播放选择动画
     * @param node 要播放选择动画的节点
     */
    playSellectAnim(node: Node) {
        let models = this.getModelGroup(node)
        if (models) {
            models.forEach(element => {
                let lineScale = 0.2 / element.scaling
                if (!element.getComponent(SellectShaderAnim)) {
                    let orginialModelComt = element.getComponent(ModelComponent)
                    //console.log(element.trangleModel)
                    //let trangleModelComt = element.trangleModel.getComponent(ModelComponent)
                    element.addComponent(SellectShaderAnim).init(orginialModelComt, this.unpaintSellectMat, lineScale)
                    //element.trangleModel.addComponent(SellectShaderAnim).init(trangleModelComt, this.unpaintSellectMat, lineScale)
                    let scale = element.node.worldScale.x
                    tween(element.node)
                        .to(0.08, { worldScale: cc.v3(scale * 1.05, scale * 1.05, scale * 1.05) }, { easing: "circIn" })
                        .to(0.08, { worldScale: cc.v3(scale, scale, scale) }, { easing: "circInOut" })
                        .start()
                }
            })
        }
    }

    /**
     * 停止选择动画
     * @param node 选择动画的节点
     */
    stopSellectAnim(node: Node) {
        let comt = node.getComponent(SellectShaderAnim)
        comt && comt.destroy()
    }

    /**
     * 选择模型
     * @param node 模型节点
     */
    getSellectModelByNode(node: Node) {
        let motherName = node.parent.name
        let sonModels = this.motherModelDic.get(motherName)
        if (sonModels) {
            for (let i of sonModels) {
                //console.log(node)
                if (i[0].modelName == node.getComponent(ColoringDioramaModel).modelName) {
                    return i[0]
                }
            }
        }
        else {
            return this.modelDic.get(node.getComponent(ColoringDioramaModel).modelName)[0]
        }
    }

    /**
     * 选择模型
     * @param node 模型节点
     */
    sellectModelByModel(model: ColoringDioramaModel) {
        this.playSellectAnim(model.node)
        let motherName = model.node.parent.name
        let sonModels = this.motherModelDic.get(motherName)
        if (sonModels) {
            //todo
            //console.warn("要进行母模型展示，先展示选择为点击到的模型")
            this.sellectModel = model.node.getComponent(ColoringDioramaModel)
        }
        else {
            //console.log(this.modelDic)
            //console.log(this.modelDic.get(model.node.getComponent(ColoringDioramaModel).modelName))
            this.sellectModel = this.modelDic.get(model.node.getComponent(ColoringDioramaModel).modelName)[0]
        }
    }

    initPaintingModel() {

        this.rotatePoint.setWorldRotation(this.originalRotate)
        //屏蔽掉不涂色模型
        this.motherModelDic.forEach(element => {
            element.forEach(subElement => {
                for (let i of subElement) {
                    if (i !== this.sellectModel) {
                        i.node.active = false
                    }
                }

            })
        })
        this.modelDic.forEach(element => {
            element.forEach(subElement => {
                if (subElement !== this.sellectModel) {
                    subElement.node.active = false
                }
            })
        })
        //停止选择动画
        this.stopSellectAnim(this.sellectModel.originalModel)
        //初始化涂色模型
        let paintedModel = this.paintedModelDic.get(this.sellectModel.uuid)
        //console.info(paintedModel)
        if (paintedModel) {
            this.paintingModel = paintedModel
            paintedModel.init(this.getSameModelList(this.sellectModel.node))
        } else {
            //console.log("赋值PaintModel")
            let newPaintModel = new PaintingModel()
            this.paintingModel = newPaintModel
            this.paintingModel.init(this.getSameModelList(this.sellectModel.node))
            this.paintedModelDic.set(this.sellectModel.uuid, newPaintModel)
        }
    }

    relseasePaintingModel() {
        //隐藏paintingModel并恢复原状
        this.releasePromoty()
        this.paintingModel.hide()

        //显示不涂色模型
        this.motherModelDic.forEach(element => {
            element.forEach(subElement => {
                for (let i of subElement) {
                    if (i !== this.sellectModel) {
                        i.node.active = true
                    }
                }

            })
        })
        this.modelDic.forEach(element => {
            element.forEach(subElement => {
                if (subElement !== this.sellectModel) {
                    subElement.node.active = true
                }
            })
        })
    }

    getAllProgress() {
        let finishCount = 0
        let totalCount = 0
        for (let i of this.modelDic.values()) {
            finishCount += i[0].paintedIndex.length
            totalCount += i[0].trangleScrIndices.length / 3
        }
        for (let i of this.motherModelDic.values()) {
            for (let j of i) {
                finishCount += j[0].paintedIndex.length
                totalCount += j[0].trangleScrIndices.length / 3
            }
        }
        return finishCount / totalCount
    }

    promoty() {
        this.releasePromoty()
        GameMgr.getInstance().cameraMgr.updateCamera()
        let currentIndex = this.paintingModel.currentColorIdices
        let paintIndex = this.paintingModel.model.paintedIndex
        for (let index of currentIndex) {
            if (!paintIndex.includes(index)) {
                let color = this.paintingModel.getColorByIndex(index)
                let trangle = this.paintingModel.spawATrangle(index, color)
                let size = GFXOpearte.getMinDisByIndices(index, this.paintingModel.model)
                let worldPos = GFXOpearte.getCenterByIndices(index, this.paintingModel.model)
                trangle.getComponent(ModelComponent).material = loader.getRes("Mat/Promoty")
                trangle.getComponent(ModelComponent).material.setProperty("tilingOffset", cc.v4(0.00025 / size, 0.00025 / size, 0, 0))
                this.promotyNode = trangle
                this.promotyNode.layer = 524288
                GameMgr.getInstance().effectMgr.playPromotyEffect(worldPos, trangle, size)
                break
            }
        }
    }

    releasePromoty() {
        if (this.promotyNode) {
            GameMgr.getInstance().effectMgr.stopPromotEffect()
            this.promotyNode.destroy()
            this.promotyNode = null
        }
    }
}
