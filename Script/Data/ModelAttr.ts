import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ModelAttr')
export class ModelAttr {
    /**
     * 模型属性
     * @param positions 顶点数据
     * @param normals 法线
     * @param vecColor 顶点颜色
     * @param indices 索引
     * @param primitiveMode 绘制模式
     * @param minPos 最小点
     * @param maxPos 最大点
     */
    constructor(positions, normals, vecColor, indices, primitiveMode, minPos, maxPos) {
        this.positions = positions
        this.normals = normals
        this.vecColor = vecColor
        this.indices = indices
        this.primitiveMode = primitiveMode
        this.minPos = minPos
        this.maxPos = maxPos
    }
    public positions = null
    public normals = null
    public vecColor = null
    public indices = null
    public primitiveMode = null
    public minPos = null
    public maxPos = null
}
