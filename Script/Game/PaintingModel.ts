import { _decorator, Component, Node, Vec4, ModelComponent, Vec2, Mat4, Vec3, CameraComponent, utils, loader, find, tween, Material, instantiate, Color, math, Quat } from 'cc';
import { ColoringDioramaModel } from '../Data/ColoringDioramaModel';
import { ExpandPaintRange } from '../ExpandPaintRange';
import { ColorItem } from '../View/UI/ColorItem';
import { ColorItemMgr } from './Managers/ColorItemMgr';
import { GameMgr } from './Managers/GameMgr';
import { ModelMgr } from './Managers/ModelMgr';
import { GFXOpearte } from './Uitls/GFXOpearte';
const { ccclass, property } = _decorator;

@ccclass('PaintingModel')
export class PaintingModel extends Component {

    private models: ColoringDioramaModel[] = []
    public model: ColoringDioramaModel = null
    private modelMgr: ModelMgr = null
    private mainCamera: CameraComponent = null
    /**当前选取的色号 */
    private currentColorNum: number = null
    /**当前选取的颜色 */
    public currentColor: Vec4 = new Vec4()
    /**当前选取的颜色按钮 */
    public currentItem: ColorItem = null
    /**当前选取的色号 */
    public currentColorIdices: number[] = []
    /**屏幕坐标列表 */
    private screenPos: Array<Vec3> = new Array<Vec3>()
    /**屏幕坐标中心列表 */
    private screenCenterPos: Array<Vec3> = new Array<Vec3>()
    /**颜色滑动列表 */
    public scrollView: ColorItemMgr = null
    /**临时存储 */
    private pos = []
    /**此次拼涂的三角形 */
    public currentpaintIndex: number[] = []
    /**相机距离 */
    public cameraDis: number = 0

    /**
     * 初始化模型
     * @param models 同模型列表
     */
    init(models) {
        //初始化信息
        this.models = models
        this.model = models[0]
        this.modelMgr = GameMgr.getInstance().modelMgr
        this.mainCamera = GameMgr.getInstance().cameraMgr.mainCamera
        //设置模型拼涂材质和初始位置
        this.model.setMat(this.model.originalModel, this.modelMgr.unLitMat)
        this.model.setMat(this.model.trangleModel, this.modelMgr.unLitMat)
        this.model.node.setParent(this.modelMgr.paintingRotatePoint)
        this.model.node.setPosition(0, 0, 0)

        this.scheduleOnce(() => {
            let modelWorldPos = this.model.node.getWorldPosition()
            let modelBoxPos = this.model.node.getComponent(ModelComponent).model.worldBounds.center
            let moveVec = modelBoxPos.subtract(modelWorldPos)
            this.model.node.setWorldPosition(this.model.node.worldPosition.subtract(moveVec))
        }, 0)

        this.model.node.setWorldRotation(this.model.originalRotate)
        this.model.node.setWorldScale(this.model.originalScale)
        //显示线框
        this.model.lineModel.active = true
        //更新坐标回调
        var callBack = function () {
            this.updateScreenPos()
        }.bind(this)
        //计算相机距离
        this.cameraDis = -0.01843351 * this.model.modelSize - 0.015411
        //相机动画
        GameMgr.getInstance().cameraMgr.playCameraDisAnim(-0.196, this.cameraDis, callBack)
        GameMgr.getInstance().cameraMgr.currentSettingDis = this.cameraDis
        //初始化颜色列表
        GameMgr.getInstance().gameUIMgr.paintUI.setTrue()
        if (this.scrollView == null) {
            this.scrollView = instantiate(loader.getRes("UI/PaintingScrollView")).getComponent(ColorItemMgr)
            this.scrollView.node.setParent(GameMgr.getInstance().gameUIMgr.paintUI.node)
            this.scrollView.init(this)
        }
        else {
            this.scrollView.node.active = true
            //选择一号色
            this.scrollView.playFakeAnim()
            this.scrollView.updateDisplay()
            this.scrollView.playProgressAnim()
        }
        //生成号码
        this.generateModelNum()
        //将拼图过的号码全部False掉
        for (let i = 0; i < this.model.paintedIndex.length; i++) {
            let indice = this.model.paintedIndex[i]
            let sellectNum = this.model.sellectNumDic.get(indice)
            if (sellectNum) {
                sellectNum.active = false
            }
            let unSellectNum = this.model.unSellectNumDic.get(indice)
            if (unSellectNum) {
                unSellectNum.active = false
            }
        }
        //全部置为未选择状态
        for (let i = 0; i < this.model.colorIndexDic.size; i++) {
            this.setColorByColorNum(i, cc.v4(1, 1, 1, 1))
            this.setNumState(i, false)
        }
        //清除此次拼图
        this.currentpaintIndex = []
        this.scrollView.sellectAColor()
    }


    initForStarSkill() {
        this.modelMgr.releasePromoty()
        this.model.node.setWorldRotation(this.model.originalRotate)
        this.model.node.setWorldScale(this.model.originalScale)
        //显示线框
        this.model.lineModel.active = true
        //计算相机距离
        this.cameraDis = -0.01843351 * this.model.modelSize - 0.015411
        this.cameraDis += this.cameraDis * 0.4
        //相机动画
        let cameraNode = GameMgr.getInstance().cameraMgr.mainCamera.node
        tween(cameraNode)
            .to(1.5, { position: cc.v3(0, 0, this.cameraDis) }, { easing: "circOut" })
            .call(() => {
                this.updateScreenPos()
            })
            .start()
        GameMgr.getInstance().cameraMgr.currentSettingDis = this.cameraDis
        //将拼图过的号码全部False掉
        for (let i = 0; i < this.model.paintedIndex.length; i++) {
            let indice = this.model.paintedIndex[i]
            let sellectNum = this.model.sellectNumDic.get(indice)
            if (sellectNum) {
                sellectNum.active = false
            }
            let unSellectNum = this.model.unSellectNumDic.get(indice)
            if (unSellectNum) {
                unSellectNum.active = false
            }
        }
        //全部置为未选择状态
        for (let i = 0; i < this.model.colorIndexDic.size; i++) {
            this.setColorByColorNum(i, cc.v4(1, 1, 1, 1))
            this.setNumState(i, true)
        }
    }

    initForBombSkill() {
        this.modelMgr.releasePromoty()
        this.model.node.setWorldRotation(this.model.originalRotate)
        this.model.node.setWorldScale(this.model.originalScale)
        //显示线框
        this.model.lineModel.active = true
        //计算相机距离
        this.cameraDis = -0.01843351 * this.model.modelSize - 0.015411
        //相机动画
        let cameraNode = GameMgr.getInstance().cameraMgr.mainCamera.node
        tween(cameraNode)
            .to(1.5, { position: cc.v3(0, 0, this.cameraDis) }, { easing: "circOut" })
            .call(() => {
                this.updateScreenPos()
            })
            .start()
        GameMgr.getInstance().cameraMgr.currentSettingDis = this.cameraDis
        //将拼图过的号码全部False掉
        for (let i = 0; i < this.model.paintedIndex.length; i++) {
            let indice = this.model.paintedIndex[i]
            let sellectNum = this.model.sellectNumDic.get(indice)
            if (sellectNum) {
                sellectNum.active = false
            }
            let unSellectNum = this.model.unSellectNumDic.get(indice)
            if (unSellectNum) {
                unSellectNum.active = false
            }
        }
        //全部置为未选择状态
        for (let i = 0; i < this.model.colorIndexDic.size; i++) {
            this.setColorByColorNum(i, cc.v4(1, 1, 1, 1))
            this.setNumState(i, true)
        }
    }

    hide() {
        this.modelMgr.releasePromoty()
        //回到原来的位置和材质
        this.model.node.setParent(this.model.originalParentNode)
        this.model.node.setWorldPosition(this.model.originalPos)
        this.model.node.setWorldRotation(this.model.originalRotate)
        this.model.node.setWorldScale(this.model.originalScale)
        this.model.setMat(this.model.originalModel, this.modelMgr.paintedMat)
        this.model.setMat(this.model.trangleModel, this.modelMgr.unpaintMat)
        //隐藏线框
        this.model.lineModel.active = false
        //隐藏号码
        for (let i of this.model.sellectNumDic.values()) {
            i.active = false
        }
        for (let i of this.model.unSellectNumDic.values()) {
            i.active = false
        }
        //隐藏颜色列表
        if (this.scrollView) {
            this.scrollView.node.active = false
        }
        this.model.storgeMeshData()
        this.model.updateMeshStorgeData()
        this.model.updateMesh()
        this.unifyModels()
    }

    /**
     * 更新顶点数据到屏幕的映射
     */
    updateScreenPos() {
        this.screenPos = []
        this.screenCenterPos = []
        let modelPos = this.model.originalModelAttr.positions
        let indies = this.model.trangleScrIndices
        let mat4: Mat4 = this.model.node.getWorldMatrix()
        for (let i = 0; i < indies.length / 3; i++) {

            let point1_1 = modelPos[indies[i * 3 + 0] * 3 + 0]
            let point2_1 = modelPos[indies[i * 3 + 0] * 3 + 1]
            let point3_1 = modelPos[indies[i * 3 + 0] * 3 + 2]
            let pos1 = new Vec3(point1_1, point2_1, point3_1)

            let point1_2 = modelPos[indies[i * 3 + 1] * 3 + 0]
            let point2_2 = modelPos[indies[i * 3 + 1] * 3 + 1]
            let point3_2 = modelPos[indies[i * 3 + 1] * 3 + 2]
            let pos2 = new Vec3(point1_2, point2_2, point3_2)

            let point1_3 = modelPos[indies[i * 3 + 2] * 3 + 0]
            let point2_3 = modelPos[indies[i * 3 + 2] * 3 + 1]
            let point3_3 = modelPos[indies[i * 3 + 2] * 3 + 2]
            let pos3 = new Vec3(point1_3, point2_3, point3_3)

            let wordlPos1 = pos1.transformMat4(mat4)
            let wordlPos2 = pos2.transformMat4(mat4)
            let wordlPos3 = pos3.transformMat4(mat4)

            let screenPos1 = this.mainCamera.worldToScreen(wordlPos1)
            let screenPos2 = this.mainCamera.worldToScreen(wordlPos2)
            let screenPos3 = this.mainCamera.worldToScreen(wordlPos3)
            this.screenPos.push(screenPos1)
            this.screenPos.push(screenPos2)
            this.screenPos.push(screenPos3)
            this.screenCenterPos.push(new Vec3(
                (screenPos1.x + screenPos2.x + screenPos3.x) / 3,
                (screenPos1.y + screenPos2.y + screenPos3.y) / 3,
                (screenPos1.z + screenPos2.z + screenPos3.z) / 3,
            ))
        }
    }

    /**
     * 返回三角形的第一个索引值
     * @param pos 屏幕坐标
     */
    getTrangelIndexByPos(pos: Vec2) {
        if (this.screenPos.length <= 0) return
        let indies = this.model.trangleScrIndices
        let paintedIndex = this.model.paintedIndex
        let minDis = 99999
        let minIndex = -1
        for (let i = 0; i < indies.length / 3; i++) {
            if (paintedIndex.includes(indies[i * 3]) || !this.currentColorIdices.includes(indies[i * 3])) {
                continue
            }
            let screenPos1 = this.screenPos[i * 3 + 0]
            let screenPos2 = this.screenPos[i * 3 + 1]
            let screenPos3 = this.screenPos[i * 3 + 2]
            let signOfTrig = (screenPos2.x - screenPos1.x) * (screenPos3.y - screenPos1.y) - (screenPos2.y - screenPos1.y) * (screenPos3.x - screenPos1.x);
            let signOfAB = (screenPos2.x - screenPos1.x) * (pos.y - screenPos1.y) - (screenPos2.y - screenPos1.y) * (pos.x - screenPos1.x);
            let signOfCA = (screenPos1.x - screenPos3.x) * (pos.y - screenPos3.y) - (screenPos1.y - screenPos3.y) * (pos.x - screenPos3.x);
            let signOfBC = (screenPos3.x - screenPos2.x) * (pos.y - screenPos3.y) - (screenPos3.y - screenPos2.y) * (pos.x - screenPos3.x);
            let d1 = (signOfAB * signOfTrig > 0);
            let d2 = (signOfCA * signOfTrig > 0);
            let d3 = (signOfBC * signOfTrig > 0);
            if (d1 && d2 && d3 && signOfTrig > 0) {
                return indies[i * 3]
            }
            if (signOfTrig > 0) {
                let dis1 = Vec2.distance(cc.v2(screenPos1.x, screenPos1.y), pos)
                let dis2 = Vec2.distance(cc.v2(screenPos2.x, screenPos2.y), pos)
                let dis3 = Vec2.distance(cc.v2(screenPos3.x, screenPos3.y), pos)
                let dis4 = Vec2.distance(cc.v2(this.screenCenterPos[i].x, this.screenCenterPos[i].y), pos)
                if (minDis >= dis1) {
                    minDis = dis1
                    minIndex = indies[i * 3]
                }
                if (minDis >= dis2) {
                    minDis = dis2
                    minIndex = indies[i * 3]
                }
                if (minDis >= dis3) {
                    minDis = dis3
                    minIndex = indies[i * 3]
                }
                if (minDis >= dis4) {
                    minDis = dis4
                    minIndex = indies[i * 3]
                }
            }
        }
        if (minDis <= 50 * cc.view.getVisibleSize().height / 1920) {
            return minIndex
        }
        return null
    }

    /**
     * 根据号码设置颜色,设置所有此号码的三角形
     * @param num 涂色号
     * @param color 颜色
     */
    setColorByColorNum(num: number, color: Vec4) {
        let newVecColor: number[] = []
        let trangleColorScr = this.model.originalModelAttr.vecColor
        let trangleIndices = this.model.trangleScrIndices
        let colorIndicesList = this.model.sameColorList[num]
        if (!colorIndicesList) return null
        for (let i = 0; i < trangleIndices.length / 3; i++) {
            if (colorIndicesList.includes(i * 3) && !this.model.paintedIndex.includes(i * 3)) {
                newVecColor.push(color.x)
                newVecColor.push(color.y)
                newVecColor.push(color.z)
                newVecColor.push(color.w)
                newVecColor.push(color.x)
                newVecColor.push(color.y)
                newVecColor.push(color.z)
                newVecColor.push(color.w)
                newVecColor.push(color.x)
                newVecColor.push(color.y)
                newVecColor.push(color.z)
                newVecColor.push(color.w)
            }
            else {
                newVecColor.push(trangleColorScr[trangleIndices[i * 3] * 4 + 0])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3] * 4 + 1])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3] * 4 + 2])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3] * 4 + 3])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 1] * 4 + 0])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 1] * 4 + 1])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 1] * 4 + 2])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 1] * 4 + 3])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 2] * 4 + 0])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 2] * 4 + 1])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 2] * 4 + 2])
                newVecColor.push(trangleColorScr[trangleIndices[i * 3 + 2] * 4 + 3])
            }
        }
        this.model.originalModelAttr.vecColor = newVecColor
        //this.model.updateMeshData(false)
        this.model.updateMesh()
    }

    /**
     * 设置号码状态
     * @param num 号码
     * @param state 
     */
    setNumState(num: number, state: boolean) {
        let trangleIndices = this.model.trangleScrIndices
        let colorIndicesList = this.model.sameColorList[num]
        if (!colorIndicesList) return null
        for (let i = 0; i < trangleIndices.length / 3; i++) {
            if (colorIndicesList.includes(i * 3)) {
                if (!this.model.paintedIndex.includes(i * 3)) {
                    let sellectNum = this.model.sellectNumDic.get(i * 3)
                    if (sellectNum) {
                        sellectNum.active = state
                    }
                    let unSellectNum = this.model.unSellectNumDic.get(i * 3)
                    if (unSellectNum) {
                        unSellectNum.active = !state
                    }
                    //this.model.unSellectNumDic.get(i * 3).active = !state
                }
            }
        }
    }

    /**
     * 屏蔽掉三角形的号码
     * @param indice 三角形的索引
     */
    disableSingleNum(indice: number) {
        let sellectNum = this.model.sellectNumDic.get(indice)
        if (sellectNum) {
            sellectNum.active = false
        }
        let unSellectNum = this.model.unSellectNumDic.get(indice)
        if (unSellectNum) {
            unSellectNum.active = false
        }
        // this.model.sellectNumDic.get(indice).active = false
        // this.model.unSellectNumDic.get(indice).active = false
    }

    /**
     * 毁掉一个三角形
     * @param index 要毁掉的三角形
     */
    destoryTrangle(index: number, updateMesh: boolean = true) {
        this.modelMgr.releasePromoty()
        this.model.paintedIndex.push(index)
        // let indices = this.model.trangleModelAttr.indices as number[]
        // let destoryIndices = indices.splice(indices.indexOf(index), 3)
        // this.model.trangleModelAttr.indices = indices
        // let originalIndices = this.model.originalModelAttr.indices as number[]
        // originalIndices.push(destoryIndices[0])
        // originalIndices.push(destoryIndices[1])
        // originalIndices.push(destoryIndices[2])
        // this.model.paintedIndex.push(index)
        this.currentpaintIndex.push(index)
        if (updateMesh) {
            this.model.updateMeshData()
            this.model.updateMesh()
        }
    }

    /**
     * 毁掉多个三角形
     * @param index 要毁掉的三角形列表
     */
    destoryTrangleList(indexList: number[]) {
        for (let index of indexList) {
            // let indices = this.model.trangleModelAttr.indices as number[]
            // let destoryIndices = indices.splice(indices.indexOf(index), 3)
            // this.model.trangleModelAttr.indices = indices
            // let originalIndices = this.model.originalModelAttr.indices as number[]
            // originalIndices.push(destoryIndices[0])
            // originalIndices.push(destoryIndices[1])
            // originalIndices.push(destoryIndices[2])
            this.model.paintedIndex.push(index)
            this.currentpaintIndex.push(index)
        }
        this.model.updateMeshData()
        this.model.updateMesh()
    }

    /**
     * 播放三角形的填涂动画
     * @param index 三角形的第一个点的索引
     * @param normal 三角形的法线
     */
    playPaintAnim(indiesIndex: number, color: Vec4, destory: boolean = true) {
        let positions = []
        let colorList = []
        //let colorList = [color[0], color[1], color[2], color[3]]
        let indicesArray = [indiesIndex, indiesIndex + 1, indiesIndex + 2]
        for (let i = 0; i < 3; i++) {
            positions.push(this.model.originalModelAttr.positions[indicesArray[i] * 3 + 0])
            positions.push(this.model.originalModelAttr.positions[indicesArray[i] * 3 + 1])
            positions.push(this.model.originalModelAttr.positions[indicesArray[i] * 3 + 2])


            colorList.push(color.x)
            colorList.push(color.y)
            colorList.push(color.z)
            colorList.push(color.w)
        }
        let indices = [0, 1, 2]
        let uvs = [0, 0, 0.5, 1, 1, 0]
        let mesh = utils.createMesh({
            positions: positions,
            colors: colorList,
            primitiveMode: this.model.originalModelAttr.primitiveMode,
            indices: indices,
            uvs: uvs,
        })

        let node = new Node("Model")
        let modelComt = node.addComponent(ModelComponent)
        modelComt.mesh = mesh
        let mat = loader.getRes("Mat/AnimMat") as Material
        modelComt.material = mat
        node.addComponent(ExpandPaintRange)
        node.setParent(find("ModelPoint"))
        node.setWorldPosition(this.model.node.worldPosition)
        node.setWorldRotation(this.model.node.worldRotation)
        node.setWorldScale(this.model.node.worldScale)
        let startPos = node.getWorldPosition()
        let normal = GFXOpearte.getNormalByIndices(indiesIndex, this.model)
        let scale = GFXOpearte.getMinDisByIndices(indiesIndex, this.model)
        let endPos = node.getWorldPosition().add(normal.multiplyScalar(scale * 0.2))
        tween(node)
            .call(() => {
                node.setWorldPosition(startPos)
            })
            .to(0.25, { worldPosition: endPos }, { easing: "circIn" })
            .to(0.25, { worldPosition: startPos.add(normal.multiplyScalar(scale * 0.04)) }, { easing: "circInOut" })
            .call(() => {
                if (node && destory) {
                    node.destroy()
                }
            })
            .start()
        return node
    }

    getColorByIndex(index: number) {

        for (let i = 0; i < this.model.sameColorList.length; i++) {
            let subList = this.model.sameColorList[i]
            if (subList.includes(index)) {
                return this.model.colorIndexDic.get(i)
            }
        }
        return new Vec4(1, 1, 1, 1)
    }

    /**
     * 选择指定颜色号进行填涂
     * @param num 颜色号
     */
    sellectColorNum(num: number) {
        this.modelMgr.releasePromoty()
        this.currentColor = this.model.colorIndexDic.get(num)
        this.currentColorIdices = this.model.sameColorList[num]
        this.setColorByColorNum(num, cc.v4(0.5, 0.5, 0.5, 1))
        this.setNumState(num, true)
    }

    /**
     * 取消指定颜色号
     * @param num 颜色号
     */
    CancleColorNum(num: number) {
        this.setColorByColorNum(num, cc.v4(1, 1, 1, 1))
        this.setNumState(num, false)
    }

    generateModelNum() {
        let indices = this.model.trangleScrIndices
        if (indices.length / 3 > 500) return
        if (this.model.sellectNumDic.size != 0) return
        for (let i = 0; i < indices.length / 3.0; i++) {
            let indice = indices[i * 3]
            let worldPos = GFXOpearte.getCenterByIndices(indice, this.model)
            let scale = GFXOpearte.getMinDisByIndices(indice, this.model)
            scale *= 0.1
            let normal = GFXOpearte.getNormalByIndices(indice, this.model)
            let num = 0
            for (let list of this.model.sameColorList) {
                num += 1
                if (list.includes(indice)) {
                    break
                }
            }
            let Sellectnode = instantiate(loader.getRes("Num/Sellect/Num" + num.toString())) as Node
            Sellectnode.setParent(this.model.node)
            Sellectnode.setWorldScale(cc.v3(scale, scale, scale))
            Sellectnode.setWorldPosition(worldPos)
            let UnSellectnode = instantiate(loader.getRes("Num/UnSellect/Num" + num.toString())) as Node
            UnSellectnode.setParent(this.model.node)
            UnSellectnode.setWorldScale(cc.v3(scale, scale, scale))
            UnSellectnode.setWorldPosition(worldPos)
            let targerNode = new Node("Node")
            targerNode.setParent(this.model.node)
            targerNode.setWorldPosition(worldPos.add(normal.multiplyScalar(1)))
            Sellectnode.lookAt(targerNode.worldPosition)
            Sellectnode.setWorldPosition(Sellectnode.worldPosition.add(normal.multiplyScalar(0.01)))
            UnSellectnode.lookAt(targerNode.worldPosition)
            UnSellectnode.setWorldPosition(Sellectnode.worldPosition.add(normal.multiplyScalar(0.01)))
            this.model.sellectNumDic.set(indice, Sellectnode)
            this.model.unSellectNumDic.set(indice, UnSellectnode)
            Sellectnode.active = false
            targerNode.destroy()
        }
    }

    unifyModels() {
        this.models.forEach(element => {
            element.paintedIndex = this.model.paintedIndex
            this.scheduleOnce(() => {
                element.updateMeshData()
                element.updateMesh()
            }, 0)
        })
    }

    spawATrangle(indiesIndex: number, color: Vec4) {
        let positions = []
        let colorList = []
        //let colorList = [color[0], color[1], color[2], color[3]]
        let indicesArray = [indiesIndex, indiesIndex + 1, indiesIndex + 2]
        for (let i = 0; i < 3; i++) {
            positions.push(this.model.originalModelAttr.positions[indicesArray[i] * 3 + 0])
            positions.push(this.model.originalModelAttr.positions[indicesArray[i] * 3 + 1])
            positions.push(this.model.originalModelAttr.positions[indicesArray[i] * 3 + 2])


            colorList.push(color.x)
            colorList.push(color.y)
            colorList.push(color.z)
            colorList.push(color.w)
        }
        let indices = [0, 1, 2]
        let uvs = [0, 0, 0.5, 1, 1, 0]
        let mesh = utils.createMesh({
            positions: positions,
            colors: colorList,
            primitiveMode: this.model.originalModelAttr.primitiveMode,
            indices: indices,
            uvs: uvs,
        })

        let node = new Node("Model")
        let modelComt = node.addComponent(ModelComponent)
        modelComt.mesh = mesh
        node.setParent(this.model.node)
        node.setWorldPosition(this.model.node.worldPosition)
        node.setWorldRotation(this.model.node.worldRotation)
        node.setWorldScale(this.model.node.worldScale)
        let normal = GFXOpearte.getNormalByIndices(indiesIndex, this.model)
        let scale = GFXOpearte.getMinDisByIndices(indiesIndex, this.model)
        let endPos = node.getWorldPosition().add(normal.multiplyScalar(scale * 0.1))
        node.setWorldPosition(endPos)
        return node
    }

}
