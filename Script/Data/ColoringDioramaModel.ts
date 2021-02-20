import { _decorator, Component, Node, MeshColliderComponent, ModelComponent, Mesh, Material, GFXAttributeName, GFXPrimitiveMode, Color, Vec3, Vec4, Quat, utils, BoxColliderComponent } from 'cc';
import { ConfigManager } from '../Game/Managers/ConfigManager';
import { StorgeMgr } from '../Game/Managers/StorgeMgr';
import { GFXOpearte } from '../Game/Uitls/GFXOpearte';
import { Constants } from './Constants';
import { ModelAttr } from './ModelAttr';
const { ccclass, property } = _decorator;

@ccclass('ColoringDioramaModel')
export class ColoringDioramaModel extends Component {
    /**模型Mesh */
    private mesh: Mesh = null
    /**模型组件 */
    private model: ModelComponent = null
    /**模型名字 */
    public modelName: string = null
    public parentName: string = null
    /**缩放大小 */
    public scaling: number = 0
    /**模型大小 */
    public modelSize: number = 0
    /**模型最小点 */
    public modelMinPos: Vec3 = new Vec3()
    /**模型最大点 */
    public modelMaxPos: Vec3 = new Vec3()

    //模型属性
    public originalModelAttr: ModelAttr = null
    public lineModelAttr: ModelAttr = null
    //public trangleModelAttr: ModelAttr = null

    //模型节点
    public originalModel: Node = null
    public lineModel: Node = null
    public trangleModel: Node = null

    /**已经涂过的三角形Index */
    public paintedIndex: number[] = []
    /**所有三角形Index */
    public allIndex: number[] = []
    /**Trangle相同颜色的Index数组 */
    public sameColorList: Array<Array<number>> = new Array<Array<number>>()
    /**sameColorList中颜色Index对照表 key:index,value:Color*/
    public colorIndexDic: Map<number, Vec4> = new Map<number, Vec4>()

    /**原始transition */
    public originalParentNode: Node = null
    public originalPos: Vec3 = new Vec3()
    public originalRotate: Quat = new Quat()
    public originalScale: Vec3 = new Vec3()

    /**最初的Idicies */
    public trangleScrIndices: number[] = []

    public vecColor: number[] = []

    /**选中的数字词典 */
    public sellectNumDic: Map<number, Node> = new Map<number, Node>()
    /**未选中的数字词典 */
    public unSellectNumDic: Map<number, Node> = new Map<number, Node>()

    public cutFaceModel: Node = null

    start() {
        this.model = this.node.getComponent(ModelComponent)
        this.mesh = this.model.mesh
        // if (!this.node.getComponent(MeshColliderComponent)) {
        //     this.node.addComponent(MeshColliderComponent).mesh = this.mesh
        // }
        let nodeName = this.node.name
        this.modelName = nodeName.indexOf("autogen") >= 0 ? nodeName.slice(0, nodeName.indexOf("(__autogen")) : nodeName
        this.scaling = this.node.scale.x * this.node.parent.scale.x

        const positions = this.mesh.readAttribute(0, GFXAttributeName.ATTR_POSITION)
        const normals = this.mesh.readAttribute(0, GFXAttributeName.ATTR_NORMAL)
        const vecColor = this.mesh.readAttribute(0, GFXAttributeName.ATTR_COLOR)
        const tangent = this.mesh.readAttribute(0, GFXAttributeName.ATTR_TANGENT)
        const bitangent = this.mesh.readAttribute(0, GFXAttributeName.ATTR_BITANGENT)
        const indices = this.mesh.readIndices(0)
        const mixPos = this.mesh.minPosition
        const maxPos = this.mesh.maxPosition

        //生成颜色sameColorList和colorIndexDic
        //<i>:第i个三角形
        for (let i = 0; i < indices.length / 3; i++) {
            let index = i * 3;
            //this.allIndex.push(index)
            let color = new Vec4()
            color.x = vecColor[indices[i * 3] * 4 + 0]
            color.y = vecColor[indices[i * 3] * 4 + 1]
            color.z = vecColor[indices[i * 3] * 4 + 2]
            color.w = vecColor[indices[i * 3] * 4 + 3]
            let sameColorListIndex = -1
            let IndexResult = false
            for (let i of this.colorIndexDic.values()) {
                sameColorListIndex += 1
                if (color.equals(i, 0.01)) {
                    IndexResult = true
                    break
                }
            }
            if (!IndexResult) {
                this.colorIndexDic.set(this.colorIndexDic.size, color)
                this.sameColorList.push([index])
            } else {
                this.sameColorList[sameColorListIndex].push(index)
            }
        }


        //线框模型属性
        this.lineModelAttr = new ModelAttr(
            //@ts-ignore
            GFXOpearte.generateExtendVB(positions, normals, 0.00001),
            null,
            null,
            //@ts-ignore
            GFXOpearte.generateWireframeIB(indices),
            GFXPrimitiveMode.LINE_LIST,
            mixPos,
            maxPos
        )

        // //三角模型属性
        // this.trangleModelAttr = new ModelAttr(
        //     //@ts-ignore
        //     GFXOpearte.generateExtendVB(positions, normals, 0),
        //     normals,
        //     vecColor,
        //     indices,
        //     GFXPrimitiveMode.TRIANGLE_LIST,
        //     mixPos,
        //     maxPos
        // )
        // this.trangleModelAttr = GFXOpearte.generateTrangleAttr(
        //     this.trangleModelAttr.positions,
        //     this.trangleModelAttr.indices,
        //     this.trangleModelAttr.normals,
        //     this.trangleModelAttr.vecColor,
        //     mixPos,
        //     maxPos
        // )


        //原始模型属性
        this.originalModelAttr = new ModelAttr(
            //@ts-ignore
            GFXOpearte.generateExtendVB(positions, normals, 0),
            normals,
            vecColor,
            indices,
            GFXPrimitiveMode.TRIANGLE_LIST,
            mixPos,
            maxPos
        )
        this.originalModelAttr = GFXOpearte.generateTrangleAttr(
            this.originalModelAttr.positions,
            this.originalModelAttr.indices,
            this.originalModelAttr.normals,
            this.originalModelAttr.vecColor,
            mixPos,
            maxPos
        )

        for (let i = 0; i < this.originalModelAttr.indices.length; i++) {
            this.trangleScrIndices.push(this.originalModelAttr.indices[i])
        }
        for (let i = 0; i < this.originalModelAttr.vecColor.length; i++) {
            this.vecColor.push(this.originalModelAttr.vecColor[i])
        }
        this.modelSize = Vec3.distance(
            this.node.getComponent(ModelComponent).mesh.maxPosition,
            this.node.getComponent(ModelComponent).mesh.minPosition
        ) * Math.abs(this.node.getScale().x) * Math.abs(this.node.parent.getScale().x) * 100

        this.parentName = this.node.parent.name
        this.originalModel = this.node
        this.originalParentNode = this.node.parent
        this.originalPos = this.node.getWorldPosition()
        this.originalRotate = this.node.getWorldRotation()
        this.originalScale = this.node.getWorldScale()

        if (this.model.mesh.subMeshCount > 1) {

            const positions = this.mesh.readAttribute(1, GFXAttributeName.ATTR_POSITION)
            const normals = this.mesh.readAttribute(1, GFXAttributeName.ATTR_NORMAL)
            const vecColor = this.mesh.readAttribute(1, GFXAttributeName.ATTR_COLOR)
            const tangent = this.mesh.readAttribute(1, GFXAttributeName.ATTR_TANGENT)
            const bitangent = this.mesh.readAttribute(1, GFXAttributeName.ATTR_BITANGENT)
            const indices = this.mesh.readIndices(1)
            const vus = this.mesh.readAttribute(1, GFXAttributeName.ATTR_TEX_COORD)
            const mixPos = this.mesh.minPosition
            const maxPos = this.mesh.maxPosition

            let subMesh = utils.createMesh({
                positions: positions,
                normals: normals,
                colors: vecColor,
                primitiveMode: GFXPrimitiveMode.TRIANGLE_LIST,
                uvs: vus,
                indices: indices,
                minPos: mixPos,
                maxPos: maxPos,
            })

            this.cutFaceModel = new Node("CutFace")
            this.cutFaceModel.addComponent(ModelComponent).mesh = subMesh
            this.cutFaceModel.setParent(this.node)
            this.cutFaceModel.setWorldPosition(this.node.worldPosition)
            this.cutFaceModel.setWorldRotation(this.node.worldRotation)
        }
    }

    /**
    * 设置线框模型状态
    */
    set lineModelState(state: boolean) {
        this.lineModel.active = state
    }

    // /**
    // * 设置三角模型状态
    // */
    set trangleModelState(state: boolean) {
        this.trangleModel.active = state
    }

    /**
     * 设置原始模型状态
     */
    set originalModelState(state: boolean) {
        this.originalModel.getComponent(ModelComponent).enabled = state
    }

    /**
     * 特定模型设置材质
     * @param model 设置的模型
     * @param mat 材质
     */
    setMat(model: Node, mat: Material) {
        if (model) {
            let modelComt = model.getComponent(ModelComponent)
            modelComt.setMaterial(mat, 0)
        }
    }

    /**
     * 更新 Mesh
     */
    updateMesh(mat?, disableMesh: boolean = true) {
        let mesh1 = GFXOpearte.createMesh(this.originalModelAttr)

        if (disableMesh) {
            this.originalModel.getComponent(ModelComponent).mesh.destroyRenderingMesh()
        }
        this.originalModel.getComponent(ModelComponent).mesh = mesh1
    }


    updateMeshStorgeData() {
        let storgeName = Constants.GameVer + ConfigManager.getInstance().currentLevel.levelName + this.parentName + this.modelName
        let data = StorgeMgr.getInstance().getMeshData(storgeName)
        this.paintedIndex = data
        let newColor: number[] = []
        for (let i = 0; i < this.trangleScrIndices.length / 3; i++) {
            let index = this.trangleScrIndices[i * 3]
            let color = this.getColorByIndex(index)
            if (this.paintedIndex.includes(index)) {
                newColor.push(color.x)
                newColor.push(color.y)
                newColor.push(color.z)
                newColor.push(color.w)
                newColor.push(color.x)
                newColor.push(color.y)
                newColor.push(color.z)
                newColor.push(color.w)
                newColor.push(color.x)
                newColor.push(color.y)
                newColor.push(color.z)
                newColor.push(color.w)
            } else {
                let underColor = (color.x + color.y + color.z) / 3
                underColor = (1 - underColor) * 0.5 + underColor
                newColor.push(underColor)
                newColor.push(underColor)
                newColor.push(underColor)
                newColor.push(color.w)
                newColor.push(underColor)
                newColor.push(underColor)
                newColor.push(underColor)
                newColor.push(color.w)
                newColor.push(underColor)
                newColor.push(underColor)
                newColor.push(underColor)
                newColor.push(color.w)
            }
        }
        this.originalModelAttr.vecColor = newColor
    }

    updateMeshData() {
        let vecColor = this.originalModelAttr.vecColor
        let newColor: number[] = []
        for (let i = 0; i < this.trangleScrIndices.length / 3; i++) {
            let index = this.trangleScrIndices[i * 3]
            let color = this.getColorByIndex(index)
            if (this.paintedIndex.includes(index)) {
                newColor.push(color.x)
                newColor.push(color.y)
                newColor.push(color.z)
                newColor.push(color.w)
                newColor.push(color.x)
                newColor.push(color.y)
                newColor.push(color.z)
                newColor.push(color.w)
                newColor.push(color.x)
                newColor.push(color.y)
                newColor.push(color.z)
                newColor.push(color.w)
            } else {
                newColor.push(vecColor[index * 4 + 0])
                newColor.push(vecColor[index * 4 + 1])
                newColor.push(vecColor[index * 4 + 2])
                newColor.push(vecColor[index * 4 + 3])
                newColor.push(vecColor[index * 4 + 0])
                newColor.push(vecColor[index * 4 + 1])
                newColor.push(vecColor[index * 4 + 2])
                newColor.push(vecColor[index * 4 + 3])
                newColor.push(vecColor[index * 4 + 0])
                newColor.push(vecColor[index * 4 + 1])
                newColor.push(vecColor[index * 4 + 2])
                newColor.push(vecColor[index * 4 + 3])
            }
        }
        this.originalModelAttr.vecColor = newColor
    }

    storgeMeshData() {
        let storgeName = Constants.GameVer + ConfigManager.getInstance().currentLevel.levelName + this.parentName + this.modelName
        StorgeMgr.getInstance().setMeshData(storgeName, this.paintedIndex)
    }

    getColorByIndex(index: number) {
        for (let i = 0; i < this.sameColorList.length; i++) {
            let subList = this.sameColorList[i]
            if (subList.includes(index)) {
                return this.colorIndexDic.get(i)
            }
        }
        return new Vec4(1, 1, 1, 1)
    }

    addMeshCollider(){
        if (!this.node.getComponent(MeshColliderComponent)) {
            this.node.addComponent(MeshColliderComponent).mesh = this.mesh
        }
    }

    setFinish(){
        this.paintedIndex = this.allIndex
    }

    onDestroy() {
        //this.node.getComponent(ModelComponent).mesh = this.mesh
        //this.node.removeComponent(MeshColliderComponent)
    }


}
