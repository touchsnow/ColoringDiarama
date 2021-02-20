import { _decorator, Component, Node, Mesh, ModelComponent, GFXAttributeName, utils, Vec3, Material, GFXPrimitiveMode, Color, color, find, Mat4, RenderTexture, Vec2, CameraComponent, tween, Loader, loader, instantiate, math, Quat } from 'cc';
import { ModelAttr } from './Data/ModelAttr';
import { ExpandPaintRange } from './ExpandPaintRange';
const { ccclass, property } = _decorator;
const v3_1 = new Vec3();
const v3_2 = new Vec3();

@ccclass('DemoModel')
export class DemoModel extends Component {

    @property(Material)
    triangelMat: Material = null

    @property(Material)
    lineMat: Material = null

    @property(Material)
    recoverMat: Material = null

    @property(Material)
    triangelMatSellect: Material = null

    @property(Material)
    recoverMatSellect: Material = null

    @property(Material)
    animMat: Material = null

    public originalModelAttr: ModelAttr = null
    public recoverModelAttr: ModelAttr = null
    public lineModelAttr: ModelAttr = null
    public trangleModelAttr: ModelAttr = null

    public recoverModel: Node = null
    public lineModel: Node = null
    public trangleModel: Node = null

    public originalPos:Vec3 = new Vec3()
    public originalRotate:Quat = new Quat()

    start() {
        let modelComt = this.node.getComponent(ModelComponent).mesh
        const positions = modelComt.readAttribute(0, GFXAttributeName.ATTR_POSITION)
        const normals = modelComt.readAttribute(0, GFXAttributeName.ATTR_NORMAL)
        const vecColor = modelComt.readAttribute(0, GFXAttributeName.ATTR_COLOR)
        const tangent = modelComt.readAttribute(0, GFXAttributeName.ATTR_TANGENT)
        const bitangent = modelComt.readAttribute(0, GFXAttributeName.ATTR_BITANGENT)
        const indices = modelComt.readIndices(0)
        const mixPos = modelComt.minPosition
        const maxPos = modelComt.maxPosition

        this.originalModelAttr = new ModelAttr(positions, normals, vecColor, indices, GFXPrimitiveMode.TRIANGLE_LIST, mixPos, maxPos)
        this.recoverModelAttr = new ModelAttr(positions, normals, vecColor, [], GFXPrimitiveMode.TRIANGLE_LIST, mixPos, maxPos)
        this.lineModelAttr = new ModelAttr(this.generateWireframeVB(positions, normals, 0.00001), null, null, this.generateWireframeIB(indices), GFXPrimitiveMode.LINE_LIST, mixPos, maxPos)
        this.trangleModelAttr = new ModelAttr(this.generateWireframeVB(positions, normals, 0.0000001), normals, vecColor, this.generateTrangleIB(indices), GFXPrimitiveMode.TRIANGLE_LIST, mixPos, maxPos)

        // console.info("position:" + positions)
        // console.info("normals:" + normals)
        // console.info("vecColor:" + vecColor)
        // console.info("indices:" + indices)
        // console.info("tangent:" + tangent)
        // console.info("bitangent:" + bitangent)

        this.recoverModel = this.generateModel(this.node, this.recoverModelAttr, this.recoverMat)
        this.lineModel = this.generateModel(this.node, this.lineModelAttr, this.lineMat)
        this.trangleModel = this.generateModel(this.node, this.trangleModelAttr, this.triangelMat)
        this.node.getComponent(ModelComponent).material = this.recoverMat

        for (let i = 0; i < this.originalModelAttr.indices.length / 3; i++) {
            this.generateNum(i)
        }

        this.originalPos = this.node.getWorldPosition()
        this.originalRotate = this.node.getWorldRotation()
        
    }

    generateWireframeVB(positions: Float32Array, normals: Float32Array, extrude: number) {
        if (normals) {
            const len = positions.length / 3;
            const res: number[] = [];
            for (let i = 0; i < len; i++) {
                Vec3.fromArray(v3_1, positions, i * 3);
                Vec3.fromArray(v3_2, normals, i * 3);
                Vec3.scaleAndAdd(v3_1, v3_1, Vec3.normalize(v3_2, v3_2), extrude);
                Vec3.toArray(res, v3_1, i * 3);
            }
            return res;
        }
        else {
            return positions
        }
    }

    generateWireframeIB(src: number[]) {
        const res: number[] = [];
        const len = src.length / 3;
        for (let i = 0; i < len; i++) {
            const a = src[i * 3 + 0];
            const b = src[i * 3 + 1];
            const c = src[i * 3 + 2];
            res.push(a, b, b, c, c, a);
        }
        return res;
    }

    generateModel(transitionNode: Node, modelAttr: ModelAttr, mat: Material) {
        let node = new Node("Model")
        let modelComt = node.addComponent(ModelComponent)
        let mesh = utils.createMesh({
            positions: modelAttr.positions,
            normals: modelAttr.normals,
            colors: modelAttr.vecColor,
            primitiveMode: modelAttr.primitiveMode,
            indices: modelAttr.indices,
            minPos: modelAttr.minPos,
            maxPos: modelAttr.maxPos,
        })
        modelComt.mesh = mesh
        modelComt.material = mat
        node.setParent(find("ModelPoint"))
        node.setPosition(transitionNode.position)
        node.setScale(transitionNode.scale)
        node.setRotation(transitionNode.rotation)
        return node
    }

    enabledMesh(node: Node, modelAttr: ModelAttr) {
        let mesh = utils.createMesh({
            positions: modelAttr.positions,
            normals: modelAttr.normals,
            colors: modelAttr.vecColor,
            primitiveMode: modelAttr.primitiveMode,
            indices: modelAttr.indices,
            minPos: modelAttr.minPos,
            maxPos: modelAttr.maxPos,
        })
        let modelComt = node.getComponent(ModelComponent)
        let destoryMesh = modelComt.mesh
        modelComt.mesh = mesh
        destoryMesh.destroyRenderingMesh()
    }

    //返回当前第i个三角形及其世界坐标系下的法向量
    getIncludeTrangle(pos: Vec2, camera: CameraComponent): any {
        let modelPos = this.trangleModelAttr.positions
        let indies = this.trangleModelAttr.indices
        let mat4: Mat4 = this.node.getWorldMatrix()
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

            //console.info("第" + i + "个三角形", pos1, pos2, pos3)

            let screenPos1 = camera.worldToScreen(wordlPos1)
            let screenPos2 = camera.worldToScreen(wordlPos2)
            let screenPos3 = camera.worldToScreen(wordlPos3)

            //叉乘判断
            let signOfTrig = (screenPos2.x - screenPos1.x) * (screenPos3.y - screenPos1.y) - (screenPos2.y - screenPos1.y) * (screenPos3.x - screenPos1.x);
            let signOfAB = (screenPos2.x - screenPos1.x) * (pos.y - screenPos1.y) - (screenPos2.y - screenPos1.y) * (pos.x - screenPos1.x);
            let signOfCA = (screenPos1.x - screenPos3.x) * (pos.y - screenPos3.y) - (screenPos1.y - screenPos3.y) * (pos.x - screenPos3.x);
            let signOfBC = (screenPos3.x - screenPos2.x) * (pos.y - screenPos3.y) - (screenPos3.y - screenPos2.y) * (pos.x - screenPos3.x);
            let d1 = (signOfAB * signOfTrig > 0);
            let d2 = (signOfCA * signOfTrig > 0);
            let d3 = (signOfBC * signOfTrig > 0);


            if (d1 && d2 && d3 && signOfTrig > 0) {
                let v1 = wordlPos1.clone().subtract(wordlPos2)
                let v2 = wordlPos2.clone().subtract(wordlPos3)
                let normal: Vec3 = new Vec3()
                Vec3.cross(normal, v1, v2)
                return [i, normal]
            }
        }
        return null
    }

    getCenterWorldPostionByIndices(indicesIndex: number) {
        let modelPos = this.originalModelAttr.positions
        let indies = this.originalModelAttr.indices
        let mat4: Mat4 = this.node.getWorldMatrix()

        let point1_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 0]
        let point2_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 1]
        let point3_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 2]
        let pos1 = new Vec3(point1_1, point2_1, point3_1)

        let point1_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 0]
        let point2_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 1]
        let point3_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 2]
        let pos2 = new Vec3(point1_2, point2_2, point3_2)

        let point1_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 0]
        let point2_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 1]
        let point3_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 2]
        let pos3 = new Vec3(point1_3, point2_3, point3_3)

        let wordlPos1 = pos1.transformMat4(mat4)
        let wordlPos2 = pos2.transformMat4(mat4)
        let wordlPos3 = pos3.transformMat4(mat4)

        let posx = (wordlPos1.x + wordlPos2.x + wordlPos3.x) / 3.0
        let posy = (wordlPos1.y + wordlPos2.y + wordlPos3.y) / 3.0
        let posz = (wordlPos1.z + wordlPos2.z + wordlPos3.z) / 3.0

        let pos = new Vec3(posx, posy, posz)

        return pos
    }

    getNormalByIndices(indicesIndex: number) {
        let modelPos = this.originalModelAttr.positions
        let indies = this.originalModelAttr.indices
        let mat4: Mat4 = this.node.getWorldMatrix()

        let point1_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 0]
        let point2_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 1]
        let point3_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 2]
        let pos1 = new Vec3(point1_1, point2_1, point3_1)

        let point1_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 0]
        let point2_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 1]
        let point3_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 2]
        let pos2 = new Vec3(point1_2, point2_2, point3_2)

        let point1_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 0]
        let point2_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 1]
        let point3_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 2]
        let pos3 = new Vec3(point1_3, point2_3, point3_3)

        let wordlPos1 = pos1.transformMat4(mat4)
        let wordlPos2 = pos2.transformMat4(mat4)
        let wordlPos3 = pos3.transformMat4(mat4)

        let v1 = wordlPos1.clone().subtract(wordlPos2)
        let v2 = wordlPos2.clone().subtract(wordlPos3)
        let normal: Vec3 = new Vec3()
        Vec3.cross(normal, v1, v2)
        //normal = normal.transformMat4(mat4).normalize()

        return normal.normalize()
    }

    getMinDisByIndices(indicesIndex: number) {
        let modelPos = this.originalModelAttr.positions
        let indies = this.originalModelAttr.indices
        let mat4: Mat4 = this.node.getWorldMatrix()

        let point1_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 0]
        let point2_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 1]
        let point3_1 = modelPos[indies[indicesIndex * 3 + 0] * 3 + 2]
        let pos1 = new Vec3(point1_1, point2_1, point3_1)

        let point1_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 0]
        let point2_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 1]
        let point3_2 = modelPos[indies[indicesIndex * 3 + 1] * 3 + 2]
        let pos2 = new Vec3(point1_2, point2_2, point3_2)

        let point1_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 0]
        let point2_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 1]
        let point3_3 = modelPos[indies[indicesIndex * 3 + 2] * 3 + 2]
        let pos3 = new Vec3(point1_3, point2_3, point3_3)

        let wordlPos1 = pos1.transformMat4(mat4)
        let wordlPos2 = pos2.transformMat4(mat4)
        let wordlPos3 = pos3.transformMat4(mat4)

        // let edgePos1 = cc.v3((wordlPos1.x + wordlPos2.x) / 2.0, (wordlPos1.y + wordlPos2.y) / 2.0, (wordlPos1.z + wordlPos2.z) / 2.0)
        // let edgePos2 = cc.v3((wordlPos2.x + wordlPos3.x) / 2.0, (wordlPos2.y + wordlPos3.y) / 2.0, (wordlPos2.z + wordlPos3.z) / 2.0)
        // let edgePos3 = cc.v3((wordlPos1.x + wordlPos3.x) / 2.0, (wordlPos1.y + wordlPos3.y) / 2.0, (wordlPos1.z + wordlPos3.z) / 2.0)
        // let edge1 = Vec3.distance(wordlPos1, wordlPos2)
        // let edge2 = Vec3.distance(wordlPos2, wordlPos3)
        // let edge3 = Vec3.distance(wordlPos1, wordlPos2)




        let posx = (wordlPos1.x + wordlPos2.x + wordlPos3.x) / 3.0
        let posy = (wordlPos1.y + wordlPos2.y + wordlPos3.y) / 3.0
        let posz = (wordlPos1.z + wordlPos2.z + wordlPos3.z) / 3.0
        let centerPos = new Vec3(posx, posy, posz)

        let edge1_1 = Vec3.distance(centerPos, wordlPos1)
        let edge1_2 = Vec3.distance(centerPos, wordlPos2)
        let edge1_3 = Vec3.distance(wordlPos1, wordlPos2)

        let p1 = (edge1_1 + edge1_2 + edge1_3) / 2.0
        let D1 = p1 * (p1 - edge1_1) * (p1 - edge1_2) * (p1 - edge1_3)
        let S1 = Math.sqrt(D1)
        let edge1 = S1 / edge1_3 * 2

        let edge2_1 = Vec3.distance(centerPos, wordlPos2)
        let edge2_2 = Vec3.distance(centerPos, wordlPos3)
        let edge2_3 = Vec3.distance(wordlPos2, wordlPos3)

        let p2 = (edge2_1 + edge2_2 + edge2_3) / 2.0
        let D2 = p2 * (p2 - edge2_1) * (p2 - edge2_2) * (p2 - edge2_3)
        let S2 = Math.sqrt(D2)
        let edge2 = S2 / edge2_3 * 2

        let edge3_1 = Vec3.distance(centerPos, wordlPos1)
        let edge3_2 = Vec3.distance(centerPos, wordlPos3)
        let edge3_3 = Vec3.distance(wordlPos1, wordlPos3)

        let p3 = (edge3_1 + edge3_2 + edge3_3) / 2.0
        let D3 = p3 * (p3 - edge3_1) * (p3 - edge3_2) * (p3 - edge3_3)
        let S3 = Math.sqrt(D3)
        let edge3 = S3 / edge3_3 * 2

        // let edge1_1 = Vec3.distance(centerPos,wordlPos1)
        // let edge1_2 = Vec3.distance(centerPos,wordlPos2) 
        // let edge1_3 = Vec3.distance(wordlPos1,wordlPos1)

        // let p1 = (edge1_1+edge1_2+edge1_3)/2.0
        // let D1 = p1*(p1-edge1_1)*(p1-edge1_2)*(p1-edge1_3)
        // let S1 = Math.sqrt(D1)

        let lessEdge = edge1
        if (lessEdge >= edge2)
            lessEdge = edge2
        if (lessEdge >= edge3)
            lessEdge = edge3

       // console.log(edge1, edge2, edge3, lessEdge)
        return lessEdge
    }

    generateTrangleIB(src: number[]) {
        const res: number[] = [];
        const len = src.length / 3;
        for (let i = 0; i < len; i++) {
            const a = src[i * 3 + 0];
            const b = src[i * 3 + 1];
            const c = src[i * 3 + 2];
            res.push(a, b, c);
        }
        return res;
    }

    generateNum(indices) {
        let node = instantiate(loader.getRes("Mat/Num")) as Node
        node.setParent(find("ModelPoint/Num"))
        let wodlePos = this.getCenterWorldPostionByIndices(indices)
        let scale = this.getMinDisByIndices(indices)
        scale *= 0.001
        node.setScale(cc.v3(scale, scale, scale))

        node.setWorldPosition(wodlePos)
        let normal = this.getNormalByIndices(indices)
        let targerNode = new Node("Node")
        targerNode.setParent(find("ModelPoint/Num"))
        targerNode.setWorldPosition(wodlePos.add(normal.multiplyScalar(1)))

        node.lookAt(targerNode.worldPosition)
        node.setWorldPosition(node.worldPosition.add(normal.multiplyScalar(0.01)))
        this.scheduleOnce(() => { targerNode.destroy() })

    }

    // generateTrangleNumberUV(indices:number[]){
    //     let vus = []
    //     let uv = [0, 0, 0.5, 1, 1, 0]
    //     for(let i = 0; i<indices.length;i++){
    //         vus.push(uv)
    //     }
    // }

    addRecoverTrangle(indiesIndex: number) {
        indiesIndex *= 3
        this.recoverModelAttr.indices.push(indiesIndex)
        this.recoverModelAttr.indices.push(indiesIndex + 1)
        this.recoverModelAttr.indices.push(indiesIndex + 2)
    }

    removeTrangle(indiesIndex: number) {
        indiesIndex *= 3
        let indices = this.trangleModelAttr.indices
        let newIndices: number[] = []
        for (let i = 0; i < indices.length; i++) {
            if (i >= indiesIndex && i <= indiesIndex + 2) {
                continue
            }
            newIndices.push(indices[i])
        }
        this.trangleModelAttr.indices = newIndices
    }

    removeWireframe(indiesIndex: number) {
        indiesIndex *= 6
        let indices = this.lineModelAttr.indices
        let newIndices: number[] = []
        for (let i = 0; i < indices.length; i++) {
            if (i >= indiesIndex && i <= indiesIndex + 5) {
                continue
            }
            newIndices.push(indices[i])
        }
        this.lineModelAttr.indices = newIndices
        //console.info(this.lineModelAttr.indices.length / 3)
        //return indices.slice(indiesIndex * 2, indiesIndex * 2 + 6)
    }

    refresh() {
        this.enabledMesh(this.recoverModel, this.recoverModelAttr)
        this.enabledMesh(this.trangleModel, this.trangleModelAttr)
        this.enabledMesh(this.lineModel, this.lineModelAttr)
    }

    changeToSellecMat() {
        this.trangleModel.getComponent(ModelComponent).material = this.triangelMatSellect
        this.node.getComponent(ModelComponent).material = this.recoverMatSellect
    }


    playPaintAnim(indiesIndex: number, normal: Vec3) {
        indiesIndex *= 3
        let positions = []
        let color = []
        let indicesArray = [this.trangleModelAttr.indices[indiesIndex], this.trangleModelAttr.indices[indiesIndex + 1], this.trangleModelAttr.indices[indiesIndex + 2]]
        for (let i = 0; i < 3; i++) {
            positions.push(this.trangleModelAttr.positions[indicesArray[i] * 3 + 0])
            positions.push(this.trangleModelAttr.positions[indicesArray[i] * 3 + 1])
            positions.push(this.trangleModelAttr.positions[indicesArray[i] * 3 + 2])
            color.push(this.trangleModelAttr.vecColor[indicesArray[i] * 4 + 0])
            color.push(this.trangleModelAttr.vecColor[indicesArray[i] * 4 + 1])
            color.push(this.trangleModelAttr.vecColor[indicesArray[i] * 4 + 2])
            color.push(this.trangleModelAttr.vecColor[indicesArray[i] * 4 + 3])
        }
        let indices = [0, 1, 2]
        let uvs = [0, 0, 0.5, 1, 1, 0]
        let mesh = utils.createMesh({
            positions: positions,
            colors: color,
            primitiveMode: this.trangleModelAttr.primitiveMode,
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
        node.setWorldPosition(this.node.worldPosition)
        node.setWorldRotation(this.node.worldRotation)
        node.setWorldScale(this.node.worldScale)
        let startPos = node.getWorldPosition()
        let endPos = node.getWorldPosition().add(normal.multiplyScalar(0.005 * node.worldScale.x))
        tween(node)
            .call(() => {
                node.setWorldPosition(startPos)
            })
            .to(0.25, { worldPosition: endPos }, { easing: "circIn" })
            .to(0.25, { worldPosition: startPos }, { easing: "circInOut" })
            .call(() => {
                node.destroy()
            })
            .start()
    }
}
