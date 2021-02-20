import { _decorator, Component, Node, ModelComponent, GFXAttributeName, CCInteger, utils, Material, Mesh, Vec3, math, absMax, tween, Vec4, TERRAIN_HEIGHT_BASE, Color } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;


let posx1: number = 0
let posx2: number = 0
let posx3: number = 0

let posy1: number = 0
let posy2: number = 0
let posy3: number = 0

let posz1: number = 0
let posz2: number = 0
let posz3: number = 0

let point1: Vec3 = new Vec3()
let point2: Vec3 = new Vec3()
let point3: Vec3 = new Vec3()

let normal: Vec3 = new Vec3()

@ccclass('Water')
//@executeInEditMode
export class Water extends Component {

    @property({
        type: CCInteger,
        displayName: '水波运动高度',
    })
    waveY: number = 0.00001

    @property({
        type: CCInteger,
        displayName: '水波运动速度',
    })
    waveSpeed: number = 3

    @property({
        type: CCInteger,
        displayName: '水波横向运动频率',
    })
    freqX: number = 200

    @property({
        type: CCInteger,
        displayName: '水波纵向运动频率',
    })
    freqZ: number = 800

    @property({
        type: Material,
        displayName: '水的材质',
    })
    mat: Material = null

    @property({
        type: CCInteger,
        displayName: '水波开始可以运动的高度点',
    })
    yMaxMovePos = 0.003

    @property({
        type: CCInteger,
        displayName: '水波运动的轴向，0:x,1:y,2:z',
    })
    moveAxis: number = 0

    @property({
        type: Vec4,
        displayName: '泡沫法线剔除',
    })
    boamCutNormal: Vec4 = new Vec4()

    @property({
        type: CCInteger,
        displayName: '泡沫密度',
    })
    faomDensity: number = 2.0

    @property({
        type: CCInteger,
        displayName: '出现泡沫高度',
    })
    faomDisplayDis: number = 1.0

    @property({
        type: CCInteger,
        displayName: '水与深度的透明系数',
    })
    waterTransDis: number = 1.5

    @property({
        type: Color,
        displayName: '水的颜色',
    })
    waterColor: Color = null

    @property({
        type: Vec4,
        displayName: '泡沫采样缩放',
    })
    tillOffset: Vec4 = new Vec4(1, 1, 0, 0)

    private timer: number = 0

    mesh: Mesh = null

    positions: number[] = []
    indices: number[] = []
    normals: number[] = []
    texCoord: number[] = []

    minPos: Vec3 = new Vec3()
    maxPos: Vec3 = new Vec3()

    start() {
        let modelComt = this.node.getComponent(ModelComponent).mesh

        for (let i = 0; i < modelComt.subMeshCount; i++) {
            const positions = modelComt.readAttribute(i, GFXAttributeName.ATTR_POSITION)
            const normals = modelComt.readAttribute(i, GFXAttributeName.ATTR_NORMAL)
            const vecColor = modelComt.readAttribute(i, GFXAttributeName.ATTR_COLOR)
            const tangent = modelComt.readAttribute(i, GFXAttributeName.ATTR_TANGENT)
            const bitangent = modelComt.readAttribute(i, GFXAttributeName.ATTR_BITANGENT)
            let texCoord = modelComt.readAttribute(i, GFXAttributeName.ATTR_TEX_COORD)
            const indices = modelComt.readIndices(i)
            this.generateTrangleModel(positions, indices, normals, texCoord)
        }
        this.node.getComponent(ModelComponent).setMaterial(this.mat, 0)
        let mat = this.node.getComponent(ModelComponent).material
        mat.setProperty("faomCutNormal", this.boamCutNormal)
        let waterParams: Vec4 = new Vec4(this.faomDensity, this.faomDisplayDis, this.waterTransDis, 0)
        mat.setProperty("waterParams", waterParams)
        mat.setProperty("albedo", this.waterColor)
        mat.setProperty("tilingOffset", this.tillOffset)
    }

    update(deltaTime: number) {
        this.timer += deltaTime
        this.waterWave(this.timer)

    }


    generateTrangleModel(positions: Float32Array, indices: number[], normals: Float32Array, texCoord: Float32Array) {

        for (let i = 0; i < indices.length; i++) {
            this.positions.push(positions[indices[i] * 3 + 0])
            this.positions.push(positions[indices[i] * 3 + 1])
            this.positions.push(positions[indices[i] * 3 + 2])
            this.normals.push(normals[indices[i] * 3 + 0])
            this.normals.push(normals[indices[i] * 3 + 1])
            this.normals.push(normals[indices[i] * 3 + 2])
            this.texCoord.push(texCoord[indices[i] * 2 + 0])
            this.texCoord.push(texCoord[indices[i] * 2 + 1])
            this.indices.push(this.indices.length)
        }

        this.mesh = utils.createMesh({
            positions: this.positions,
            indices: this.indices,
            normals: this.normals,
            uvs: this.texCoord,
            minPos: this.minPos,
            maxPos: this.maxPos
        })

        this.node.getComponent(ModelComponent).mesh = this.mesh
        //this.node.getComponent(ModelComponent).setMaterial(this.mat, 0)
    }

    waterWave(timer: number) {

        for (let i = 0; i < this.indices.length / 3; i++) {
            //点1
            posx1 = this.positions[this.indices[i * 3 + 0] * 3 + 0]
            posy1 = this.positions[this.indices[i * 3 + 0] * 3 + 1]
            posz1 = this.positions[this.indices[i * 3 + 0] * 3 + 2]

            this.positions[this.indices[i * 3 + 0] * 3 + this.moveAxis] = this.waveMove(posx1, posy1, posz1)

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //点2
            posx2 = this.positions[this.indices[i * 3 + 1] * 3 + 0]
            posy2 = this.positions[this.indices[i * 3 + 1] * 3 + 1]
            posz2 = this.positions[this.indices[i * 3 + 1] * 3 + 2]
            this.positions[this.indices[i * 3 + 1] * 3 + this.moveAxis] = this.waveMove(posx2, posy2, posz2)

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //点3
            posx3 = this.positions[this.indices[i * 3 + 2] * 3 + 0]
            posy3 = this.positions[this.indices[i * 3 + 2] * 3 + 1]
            posz3 = this.positions[this.indices[i * 3 + 2] * 3 + 2]
            this.positions[this.indices[i * 3 + 2] * 3 + this.moveAxis] = this.waveMove(posx3, posy3, posz3)
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            point1 = new Vec3(posx1, posy1, posz1)
            point2 = new Vec3(posx2, posy2, posz2)
            point3 = new Vec3(posx3, posy3, posz3)

            let v1 = point1.subtract(point2)
            let v2 = point2.clone().subtract(point3)
            let normal: Vec3 = new Vec3()
            Vec3.cross(normal, v1, v2)

            this.normals[this.indices[i * 3 + 0] * 3 + 0] = normal.x
            this.normals[this.indices[i * 3 + 0] * 3 + 1] = normal.y
            this.normals[this.indices[i * 3 + 0] * 3 + 2] = normal.z

            this.normals[this.indices[i * 3 + 1] * 3 + 0] = normal.x
            this.normals[this.indices[i * 3 + 1] * 3 + 1] = normal.y
            this.normals[this.indices[i * 3 + 1] * 3 + 2] = normal.z

            this.normals[this.indices[i * 3 + 2] * 3 + 0] = normal.x
            this.normals[this.indices[i * 3 + 2] * 3 + 1] = normal.y
            this.normals[this.indices[i * 3 + 2] * 3 + 2] = normal.z

            // this.positions[this.indices[i * 3 + 0] * 3 + 1] += Math.sin(timer)*this.waveY
            // this.positions[this.indices[i * 3 + 1] * 3 + 1] += Math.sin(timer)*this.waveY
            // this.positions[this.indices[i * 3 + 2] * 3 + 1] += Math.sin(timer)*this.waveY

        }
        this.mesh.destroyRenderingMesh()
        this.mesh = utils.createMesh({
            positions: this.positions,
            indices: this.indices,
            normals: this.normals,
            uvs: this.texCoord,
            minPos: this.minPos,
            maxPos: this.maxPos
        })
        this.node.getComponent(ModelComponent).mesh = this.mesh
    }


    waveMove(posx, posy, posz) {
        let pos = null
        let pos1 = null
        let pos2 = null
        if (this.moveAxis === 0) {
            pos = posx
            pos1 = posy
            pos2 = posz
        }
        if (this.moveAxis === 1) {
            pos = posy
            pos1 = posx
            pos2 = posz
        }
        if (this.moveAxis === 2) {
            pos = posz
            pos1 = posx
            pos2 = posy
        }
        if (pos <= this.yMaxMovePos) return pos
        pos += Math.sin(this.freqX * pos1 / 10.0 + this.timer * this.waveSpeed / 5) * this.waveY / 5
        pos += Math.sin(this.freqX * pos1 / 80.0 + this.timer * this.waveSpeed / 10) * this.waveY / 10

        pos += Math.sin(-this.freqX * pos1 / 2 + this.timer * this.waveSpeed / -3) * this.waveY
        pos += Math.sin(-this.freqX * pos1 / 8 + this.timer * this.waveSpeed / -5) * this.waveY / 10

        pos += Math.sin(this.freqZ * pos2 / 10.0 + this.timer * this.waveSpeed / 5) * this.waveY / 5
        pos += Math.sin(-this.freqZ * pos2 / 20.0 + this.timer * this.waveSpeed / 10) * this.waveY / 10

        pos += Math.sin(-this.freqZ * pos2 / 14 + this.timer * this.waveSpeed / 6) * this.waveY / 5
        pos += Math.sin(-this.freqZ * pos2 / 8 + this.timer * this.waveSpeed / -10) * this.waveY / 10

        pos += Math.sin(-this.freqX * (pos2 + pos1) + this.timer * this.waveSpeed / 2) * this.waveY * 0.5
        pos += Math.sin(this.freqZ * (pos2 + pos1) + this.timer * this.waveSpeed) * this.waveY
        pos += Math.sin(this.freqZ * this.freqX * (pos2 - pos1) + this.timer * this.waveSpeed) * this.waveY

        return pos
    }
}
