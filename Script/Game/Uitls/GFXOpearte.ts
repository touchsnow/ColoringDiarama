import { _decorator, Component, Node, Material, ModelComponent, utils, find, Vec3, GFXPrimitiveMode, Mat4 } from 'cc';
import { ColoringDioramaModel } from '../../Data/ColoringDioramaModel';
import { ModelAttr } from '../../Data/ModelAttr';
const { ccclass, property } = _decorator;
const v3_1 = new Vec3();
const v3_2 = new Vec3();
@ccclass('GFXOpearte')
export class GFXOpearte extends Component {

    /**
     * 生成模型
     * @param transitionNode 模型的点
     * @param modelAttr 模型属性
     * @param mat 材质
     */
    public static generateModel(transitionNode: Node, modelAttr: ModelAttr, mat: Material) {
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
        node.setParent(transitionNode)
        node.setPosition(0, 0, 0)
        node.setWorldScale(transitionNode.worldScale)
        node.setWorldRotation(transitionNode.worldRotation)
        return node
    }

    /**
     * 根据法线扩大顶点数据
     * @param positions 顶点数据
     * @param normals 法线法线
     * @param extrude 扩大范围
     */
    public static generateExtendVB(positions: Float32Array, normals: Float32Array, extrude: number) {
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

    /**
     * 生成线框的索引
     * @param src 模型索引
     */
    public static generateWireframeIB(src: number[]) {
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

    /**
     * 创造一个Mesh
     * @param modelAttr 模型属性
     */
    public static createMesh(modelAttr: ModelAttr) {
        return utils.createMesh({
            positions: modelAttr.positions,
            normals: modelAttr.normals,
            colors: modelAttr.vecColor,
            primitiveMode: modelAttr.primitiveMode,
            indices: modelAttr.indices,
            minPos: modelAttr.minPos,
            maxPos: modelAttr.maxPos,
        })
    }

    public static generateTrangleAttr(positions: Float32Array, indices: number[], normals: Float32Array, color: Float32Array, mixPos, maxPos) {

        let newpositions = []
        let newnormals = []
        let newindices = []
        let newcolor = []
        for (let i = 0; i < indices.length; i++) {
            newpositions.push(positions[indices[i] * 3 + 0])
            newpositions.push(positions[indices[i] * 3 + 1])
            newpositions.push(positions[indices[i] * 3 + 2])
            newnormals.push(normals[indices[i] * 3 + 0])
            newnormals.push(normals[indices[i] * 3 + 1])
            newnormals.push(normals[indices[i] * 3 + 2])
            newcolor.push(color[indices[i] * 4 + 0])
            newcolor.push(color[indices[i] * 4 + 1])
            newcolor.push(color[indices[i] * 4 + 2])
            newcolor.push(color[indices[i] * 4 + 3])
            newindices.push(newindices.length)
        }
        return new ModelAttr(
            newpositions,
            newnormals,
            newcolor,
            newindices,
            GFXPrimitiveMode.TRIANGLE_LIST,
            mixPos,
            maxPos
        )
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 获取三角形的法线
     * @param indicesIndex 三角形的索引
     */
    public static getNormalByIndices(indicesIndex: number, model: ColoringDioramaModel) {
        let modelPos = model.originalModelAttr.positions
        let indies = model.originalModelAttr.indices
        let mat4: Mat4 = model.node.getWorldMatrix()

        let point1_1 = modelPos[(indicesIndex + 0) * 3 + 0]
        let point2_1 = modelPos[(indicesIndex + 0) * 3 + 1]
        let point3_1 = modelPos[(indicesIndex + 0) * 3 + 2]
        let pos1 = new Vec3(point1_1, point2_1, point3_1)

        let point1_2 = modelPos[(indicesIndex + 1) * 3 + 0]
        let point2_2 = modelPos[(indicesIndex + 1) * 3 + 1]
        let point3_2 = modelPos[(indicesIndex + 1) * 3 + 2]
        let pos2 = new Vec3(point1_2, point2_2, point3_2)

        let point1_3 = modelPos[(indicesIndex + 2) * 3 + 0]
        let point2_3 = modelPos[(indicesIndex + 2) * 3 + 1]
        let point3_3 = modelPos[(indicesIndex + 2) * 3 + 2]
        let pos3 = new Vec3(point1_3, point2_3, point3_3)

        let wordlPos1 = pos1.transformMat4(mat4)
        let wordlPos2 = pos2.transformMat4(mat4)
        let wordlPos3 = pos3.transformMat4(mat4)

        let v1 = wordlPos1.clone().subtract(wordlPos2)
        let v2 = wordlPos2.clone().subtract(wordlPos3)
        let normal: Vec3 = new Vec3()
        Vec3.cross(normal, v1, v2)
        return normal.normalize()
    }

    //  /**
    //  * 获取三角形的法线
    //  * @param indicesIndex 三角形的索引
    //  */
    // public static getNormal(indicesIndex: number, model: ColoringDioramaModel) {
    //     let modelPos = model.trangleModelAttr.positions
    //     let indies = model.trangleModelAttr.indices
    //     let mat4: Mat4 = model.node.getWorldMatrix()

    //     let point1_1 = modelPos[(indicesIndex + 0) * 3 + 0]
    //     let point2_1 = modelPos[(indicesIndex + 0) * 3 + 1]
    //     let point3_1 = modelPos[(indicesIndex + 0) * 3 + 2]
    //     let pos1 = new Vec3(point1_1, point2_1, point3_1)

    //     let point1_2 = modelPos[(indicesIndex + 1) * 3 + 0]
    //     let point2_2 = modelPos[(indicesIndex + 1) * 3 + 1]
    //     let point3_2 = modelPos[(indicesIndex + 1) * 3 + 2]
    //     let pos2 = new Vec3(point1_2, point2_2, point3_2)

    //     let point1_3 = modelPos[(indicesIndex + 2) * 3 + 0]
    //     let point2_3 = modelPos[(indicesIndex + 2) * 3 + 1]
    //     let point3_3 = modelPos[(indicesIndex + 2) * 3 + 2]
    //     let pos3 = new Vec3(point1_3, point2_3, point3_3)

    //     // let wordlPos1 = pos1.transformMat4(mat4)
    //     // let wordlPos2 = pos2.transformMat4(mat4)
    //     // let wordlPos3 = pos3.transformMat4(mat4)

    //     let v1 = pos1.clone().subtract(pos2)
    //     let v2 = pos2.clone().subtract(pos3)
    //     let normal: Vec3 = new Vec3()
    //     Vec3.cross(normal, v1, v2)
    //     return normal.normalize()
    // }

    /**
     * 获取三角形的最短长度
     * @param indicesIndex 三角形索引
     * @param model 模型属性
     */
    public static getMinDisByIndices(indicesIndex: number, model: ColoringDioramaModel) {
        let modelPos = model.originalModelAttr.positions
        //let indies = this.model.trangleScrIndices
        let mat4: Mat4 = model.node.getWorldMatrix()

        let point1_1 = modelPos[(indicesIndex + 0) * 3 + 0]
        let point2_1 = modelPos[(indicesIndex + 0) * 3 + 1]
        let point3_1 = modelPos[(indicesIndex + 0) * 3 + 2]
        let pos1 = new Vec3(point1_1, point2_1, point3_1)

        let point1_2 = modelPos[(indicesIndex + 1) * 3 + 0]
        let point2_2 = modelPos[(indicesIndex + 1) * 3 + 1]
        let point3_2 = modelPos[(indicesIndex + 1) * 3 + 2]
        let pos2 = new Vec3(point1_2, point2_2, point3_2)

        let point1_3 = modelPos[(indicesIndex + 2) * 3 + 0]
        let point2_3 = modelPos[(indicesIndex + 2) * 3 + 1]
        let point3_3 = modelPos[(indicesIndex + 2) * 3 + 2]
        let pos3 = new Vec3(point1_3, point2_3, point3_3)

        let wordlPos1 = pos1.transformMat4(mat4)
        let wordlPos2 = pos2.transformMat4(mat4)
        let wordlPos3 = pos3.transformMat4(mat4)

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

        let lessEdge = edge1
        if (lessEdge >= edge2)
            lessEdge = edge2
        if (lessEdge >= edge3)
            lessEdge = edge3
        return lessEdge
    }

    /**
     * 获取三角形的中心位置
     * @param indicesIndex 三角形的索引
     * @param model 模型
     */
    public static getCenterByIndices(indicesIndex: number, model: ColoringDioramaModel) {
        let modelPos = model.originalModelAttr.positions
        let mat4: Mat4 = model.node.getWorldMatrix()

        let point1_1 = modelPos[(indicesIndex + 0) * 3 + 0]
        let point2_1 = modelPos[(indicesIndex + 0) * 3 + 1]
        let point3_1 = modelPos[(indicesIndex + 0) * 3 + 2]
        let pos1 = new Vec3(point1_1, point2_1, point3_1)

        let point1_2 = modelPos[(indicesIndex + 1) * 3 + 0]
        let point2_2 = modelPos[(indicesIndex + 1) * 3 + 1]
        let point3_2 = modelPos[(indicesIndex + 1) * 3 + 2]
        let pos2 = new Vec3(point1_2, point2_2, point3_2)

        let point1_3 = modelPos[(indicesIndex + 2) * 3 + 0]
        let point2_3 = modelPos[(indicesIndex + 2) * 3 + 1]
        let point3_3 = modelPos[(indicesIndex + 2) * 3 + 2]
        let pos3 = new Vec3(point1_3, point2_3, point3_3)

        let wordlPos1 = pos1.transformMat4(mat4)
        let wordlPos2 = pos2.transformMat4(mat4)
        let wordlPos3 = pos3.transformMat4(mat4)

        let worldCenterPos = new Vec3((wordlPos1.x + wordlPos2.x + wordlPos3.x) / 3, (wordlPos1.y + wordlPos2.y + wordlPos3.y) / 3, (wordlPos1.z + wordlPos2.z + wordlPos3.z) / 3)
        return worldCenterPos
    }
}
