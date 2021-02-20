import { _decorator, Component, Node, Vec3, CCInteger, PrivateNode, Material, SpriteComponent, tween, UIOpacityComponent, loader, Asset } from 'cc';
import UIUtility from '../../Framework3D/Src/Base/UIUtility';
import { DepthBufferComponent } from '../../shader-lib/depth-buffer/depth-buffer-component';
import { ConfigManager } from '../Game/Managers/ConfigManager';
import { StorgeMgr } from '../Game/Managers/StorgeMgr';
import { OpeningCamera } from './OpeningCamera';
import { OpeningModel } from './OpeningModel';
const { ccclass, property } = _decorator;

@ccclass('Spirit')
export class Spirit extends Component {


    @property(Material)
    paintedMat: Material = null

    @property(Material)
    unPaintMat: Material = null

    @property(Node)
    targetPointList: Node[] = []

    @property(OpeningModel)
    modelList: OpeningModel[] = []

    @property(OpeningCamera)
    openingCamera: OpeningCamera = null

    @property(Node)
    realyParticle: Node = null

    @property(Node)
    sprite: Node = null

    @property(Node)
    skipNode: Node = null

    speedList: number[] = [
        15,
        10,
        2,
        10,
        10,
        2,
        10,
        5
    ]

    inertiaVec: Vec3 = new Vec3()

    inertiaForce: number = 0

    targetVec: Vec3 = new Vec3()

    moveFlag: boolean = false

    targetNode: Node = null

    currentPath: number = 0

    private moveSpeed: number = 0


    start() {
        this.setTarget()
        this.moveFlag = true
        this.scheduleOnce(() => {
            for (let model of this.modelList) {
                model.modelList.forEach(element => {
                    element.setMat(element.node, this.unPaintMat)
                })
            }
        }, 0)
        this.skipNode.on(Node.EventType.TOUCH_END, this.fakeOut, this)
    }

    update(dt) {
        if (this.moveFlag) {
            this.move(dt)
            this.checkState()
        }
    }

    setTarget() {
        if (this.currentPath < this.targetPointList.length) {
            this.moveFlag = true
            this.targetNode = this.targetPointList[this.currentPath]
            this.moveSpeed = this.speedList[this.currentPath]
            this.inertiaVec = this.targetVec.clone()
            this.inertiaForce = 1
            this.currentPath += 1
        }
    }

    moveStart() {
        this.moveFlag = true
        this.setTarget()
    }

    moveStop() {
        this.inertiaVec = cc.v3(0, 0, 0)
        this.moveFlag = false
    }

    move(dt) {
        this.targetVec = (this.targetNode.getWorldPosition().subtract(this.node.getWorldPosition())).normalize()
        this.inertiaForce -= dt / 3
        if (this.inertiaForce <= 0) {
            this.inertiaForce = 0
        }
        let moveVec = this.targetVec.clone().add(this.inertiaVec.clone().multiplyScalar(this.inertiaForce))
        this.node.setWorldPosition(this.node.getWorldPosition().add(moveVec.multiplyScalar(dt * this.moveSpeed)))
    }

    checkState() {
        let dis = Vec3.distance(this.node.worldPosition, this.targetNode.worldPosition)
        if (dis <= 0.5) {
            if (this.currentPath === 3) {
                this.moveStop()
                this.openingCamera.cameraShake(0.015)
                this.realyParticle.active = true
                this.scheduleOnce(() => {
                    this.openingCamera.cameraShake(0.001)
                    this.modelList[0].modelList.forEach(element => {
                        element.setMat(element.node, this.paintedMat)
                    })
                }, 1.8)
                this.scheduleOnce(() => {
                    this.openingCamera.cameraShake(1.5)
                }, 2)
                this.scheduleOnce(() => {
                    this.realyParticle.active = false
                    this.setTarget()
                }, 5.5)
                this.scheduleOnce(() => {
                    this.modelList[0].node.active = false
                    this.modelList[1].node.active = true
                }, 9)
                return
            }
            if (this.currentPath === 6) {
                this.moveStop()
                this.openingCamera.cameraShake(0.015)
                this.realyParticle.active = true
                this.scheduleOnce(() => {
                    this.openingCamera.cameraShake(0.001)
                    this.modelList[1].modelList.forEach(element => {
                        element.setMat(element.node, this.paintedMat)
                    })
                }, 1.8)
                this.scheduleOnce(() => {
                    this.openingCamera.cameraShake(1.5)
                    this.openingCamera.camera.node.getComponent(DepthBufferComponent).enabled = false
                    this.openingCamera.effectCamera.active = true
                    this.setLayer(this.node)
                }, 2)
                this.scheduleOnce(() => {
                    this.realyParticle.active = false
                    this.setTarget()
                }, 5.5)
                this.scheduleOnce(() => {
                    this.modelList[1].node.active = false
                    this.modelList[2].node.active = true
                }, 9)
                return
            }
            if (this.currentPath == 8) {
                this.moveFlag = false
                this.realyParticle.active = true
                this.scheduleOnce(() => {
                    this.fakeOut()
                }, 1.8)
            }
            this.setTarget()
        }
    }

    fakeOut() {
        this.sprite.active = true
        tween(this.sprite.getComponent(UIOpacityComponent))
            .to(0.5, { opacity: 255 })
            .call(() => {
                ConfigManager.getInstance().setCurrentLevel("00202_CuteHamsterEatingCarrot")
                let resArray = ["Model/00202_CuteHamsterEatingCarrot"]
                let effectPath = ConfigManager.getInstance().currentLevel.effectPath
                if (effectPath !== "") {
                    resArray.push(effectPath)
                }
                loader.loadResArray(resArray, Asset, () => {
                    StorgeMgr.getInstance().openingState = true
                    StorgeMgr.getInstance().update()
                    UIUtility.getInstance().loadScene("GameScene")
                })
            })
            .start()
    }

    setLayer(node: Node) {
        node.children.forEach(element => {
            element.layer = 524288
            this.setLayer(element)
        });
    }
}
