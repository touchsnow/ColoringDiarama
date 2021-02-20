import { _decorator, Component, Node, Vec4, utils, ModelComponent, loader, Material, find, tween, Mat4, Vec3, random, instantiate, ParticleSystemComponent, Color } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { ColoringDioramaModel } from '../../Data/ColoringDioramaModel';
import { ExpandPaintRange } from '../../ExpandPaintRange';
import { GameMgr } from '../Managers/GameMgr';
import { GFXOpearte } from '../Uitls/GFXOpearte';
import { ISceneState } from './ISceneState';
import { SellectSceneState } from './SellectSceneState';
const { ccclass, property } = _decorator;

@ccclass('LevelFinishAnimState')
export class LevelFinishAnimState extends ISceneState {


    private particleList: Node[] = []

    init(gameMgr: GameMgr) {
        super.init(gameMgr)
        AudioManager.getInstance().playEffectByPath("ColoringCompleteAll")
        AudioManager.getInstance().playMusicByPath("BGM_Sellect")
        this.gameUIMgr.sellectUI.paintButtons.active = false
        let modelList: ColoringDioramaModel[] = []
        for (let i of this.modelMgr.modelDic.values()) {
            for (let j of i) {
                modelList.push(j)
            }
        }
        for (let i of this.modelMgr.motherModelDic.values()) {
            for (let j of i) {
                for (let k of j) {
                    modelList.push(k)
                }
            }
        }
        let time = 0
        let trangleCount = 0

        for (let i of modelList) {
            trangleCount += i.paintedIndex.length
            let initIndex = i
            this.scheduleOnce(() => {
                this.initMesh(initIndex)
            },0)
        }

        let singleLength = Math.floor(trangleCount / 50)

        for (let i of modelList) {
            time += 0.15
            this.scheduleOnce(() => {
                this.startPlayAnim(i, singleLength)
            }, time)
        }

        this.scheduleOnce(() => {
            gameMgr.switchSceneState(new SellectSceneState())
        }, 12.5 + time)

        // this.scheduleOnce(() => {
        //     gameMgr.switchSceneState(new SellectSceneState())
        // }, 5 + time)

        let startEulers = this.modelMgr.modelPoint.eulerAngles.clone()
        this.modelMgr.modelPoint.setRotationFromEuler(startEulers.x, startEulers.y - 60, startEulers.z)
        tween(this.modelMgr.modelPoint)
            .to(9 + time, { eulerAngles: startEulers })
            .start()
    }

    public screenTouchStart(e: Touch) { }
    public screenTouchMove(e: Touch) { }
    public screenTouchEnd(e: Touch) { }

    public release(callBack = null) {
        this.particleList.forEach(element => {
            element.children.forEach(subElement => {
                subElement.getComponent(ParticleSystemComponent).stop()
            })
        })
    }

    initMesh(model: ColoringDioramaModel) {
        //console.log(model)
        let newColor: number[] = []
        for (let i = 0; i < model.trangleScrIndices.length / 3; i++) {
            let index = model.trangleScrIndices[i * 3]
            let color = model.getColorByIndex(index)
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
        model.originalModelAttr.vecColor = newColor
        for(let index of model.paintedIndex){
            model.allIndex.push(index)
        }
        model.paintedIndex = []
        model.updateMeshData()
        model.updateMesh()
    }

    startPlayAnim(model: ColoringDioramaModel, singleLength) {

        let paintIndexList = []
        let length = Math.floor(model.allIndex.length / singleLength)
        for (let i = 0; i <= length; i++) {
            let subList = []
            if (i == length) {
                for (let j = 0; j < model.allIndex.length - i * singleLength; j++) {
                    subList.push(model.allIndex[i * singleLength + j])
                }
            }
            else {
                for (let j = 0; j < singleLength; j++) {
                    subList.push(model.allIndex[i * singleLength + j])
                }
            }
            paintIndexList.push(subList)
        }
        let timeDt = 6 / paintIndexList.length
        let delayTime = 0

        paintIndexList.forEach(element => {
            delayTime += timeDt + 1 - random() * 2
            this.scheduleOnce(() => {
                this.playParticle(element[0], model)
                for (let index of element) {
                    model.paintedIndex.push(index)
                }
                model.updateMeshData()
                model.updateMesh()
            }, delayTime)
        })
    }

    playTrangleFinishAnim(model: ColoringDioramaModel, indiesIndex: number, color: Vec4) {
        let positions = []
        let colorList = []
        let indicesArray = [indiesIndex, indiesIndex + 1, indiesIndex + 2]
        for (let i = 0; i < 3; i++) {
            positions.push(model.originalModelAttr.positions[indicesArray[i] * 3 + 0])
            positions.push(model.originalModelAttr.positions[indicesArray[i] * 3 + 1])
            positions.push(model.originalModelAttr.positions[indicesArray[i] * 3 + 2])
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
            primitiveMode: model.originalModelAttr.primitiveMode,
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
        node.setWorldPosition(model.node.worldPosition)
        node.setWorldRotation(model.node.worldRotation)
        node.setWorldScale(model.node.worldScale)
        let startPos = node.getWorldPosition()
        let normal = GFXOpearte.getNormalByIndices(indiesIndex, model)
        let scale = GFXOpearte.getMinDisByIndices(indiesIndex, model)
        let endPos = node.getWorldPosition().add(normal.multiplyScalar(scale * 0.2))
        tween(node)
            .call(() => {
                node.setWorldPosition(startPos)
            })
            .to(0.25, { worldPosition: endPos }, { easing: "circIn" })
            .to(0.25, { worldPosition: startPos }, { easing: "circInOut" })
            .call(() => {
                if (node) {
                    node.destroy()
                }
            })
            .start()
    }

    getColorByIndex(index: number, model: ColoringDioramaModel) {
        for (let i = 0; i < model.sameColorList.length; i++) {
            let subList = model.sameColorList[i]
            if (subList.includes(index)) {
                return model.colorIndexDic.get(i)
            }
        }
        return new Vec4(1, 1, 1, 1)
    }

    playParticle(index: number, model: ColoringDioramaModel) {
        let color = this.getColorByIndex(index, model)
        let worldPos = GFXOpearte.getCenterByIndices(index, model)
        let worldScale = GFXOpearte.getMinDisByIndices(index, model)
        let parent = this.modelMgr.modelPoint
        this.effectMgr.playPaintEffect(worldPos, worldScale, parent, color)
        let paintEffectNode = instantiate(loader.getRes("Effect/FinishTouch")) as Node
        paintEffectNode.setParent(parent)
        paintEffectNode.setWorldPosition(worldPos)
        worldScale *= 10
        paintEffectNode.setWorldScale(worldScale, worldScale, worldScale)
        let paintEffect1 = paintEffectNode.children[0].getComponent(ParticleSystemComponent)
        paintEffect1.startColor.color = new Color(color.x * 255, color.y * 255, color.z * 255, color.w * 255)
        paintEffectNode.children.forEach(element => {
            element.getComponent(ParticleSystemComponent).play()
        })
        this.particleList.push(paintEffectNode)
    }
}
