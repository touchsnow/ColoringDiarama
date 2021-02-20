import { _decorator, Component, Node, UIOpacityComponent, tween, Vec3, Quat, loader, instantiate, Vec2, PhysicsSystem, PhysicsRayResult, Prefab } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BackGroundUI } from '../../View/UI/BackGroundUI';
import { GameMgr } from '../Managers/GameMgr';
import { GFXOpearte } from '../Uitls/GFXOpearte';
import { SkillBomb } from '../Uitls/SkillBomb';
import { ISceneState } from './ISceneState';
import { PaintSceneState } from './PaintSceneState';
const { ccclass, property } = _decorator;

@ccclass('BombSkillState')
export class BombSkillState extends ISceneState {

    private specialBgOp = 0
    private normalBgOp = 0

    private modelAxis: Node = null
    private rotateAxis: Node = null

    private BgUI: BackGroundUI = null

    private specialBg: UIOpacityComponent = null
    private normalBg: UIOpacityComponent = null
    private starSkillBg: UIOpacityComponent = null

    private startFlag: boolean = false

    private remainingTime: number = 10

    private unpaintIndex: number[] = []

    private hadPush: number[] = []

    private bombCount: number = 5

    private qt_1: Quat = new Quat()

    init(gameMgr: GameMgr) {
        super.init(gameMgr)
        this.BgUI = this.gameUIMgr.backGroundUI
        this.gameUIMgr.paintUI.setFalse()
        let allIndex = this.modelMgr.paintingModel.model.trangleScrIndices
        for (let i = 0; i < allIndex.length / 3; i++) {
            let index = allIndex[i * 3]
            if (!this.modelMgr.paintingModel.model.paintedIndex.includes(index)) {
                this.unpaintIndex.push(index)
            }
        }
        AudioManager.getInstance().stopMusic()
        this.rotateAxis = this.cameraMgr.mainCamera.node.parent
        this.modelAxis = this.modelMgr.paintingRotatePoint
        this.modelAxis.setWorldPosition(0, 0, 0)
        this.modelAxis.setWorldRotationFromEuler(-20, 0, 0)
        this.rotateAxis.setWorldPosition(0, 0, 0)
        this.rotateAxis.setWorldRotationFromEuler(0, 0, 0)
        let modelMgr = this.modelMgr
        modelMgr.rotatePoint.setWorldRotation(modelMgr.originalRotate)
        //初始化涂色模型
        let paintedModel = modelMgr.paintedModelDic.get(modelMgr.sellectModel.uuid)
        modelMgr.paintingModel = paintedModel
        paintedModel.initForBombSkill()
        this.specialBg = this.BgUI.specialBg.node.getComponent(UIOpacityComponent)
        this.normalBg = this.BgUI.normalBg.node.getComponent(UIOpacityComponent)
        this.starSkillBg = this.BgUI.starSkillBg.node.getComponent(UIOpacityComponent)
        this.specialBgOp = this.specialBg.opacity
        this.normalBgOp = this.normalBg.opacity
        tween(this.specialBg)
            .to(0.5, { opacity: 0 })
            .start()
        tween(this.normalBg)
            .to(0.5, { opacity: 0 })
            .start()
        this.scheduleOnce(() => {
            this.starSkillBg.opacity = 0
            this.starSkillBg.node.active = true
            tween(this.starSkillBg)
                .to(0.5, { opacity: 255 })
                .call(() => {
                    AudioManager.getInstance().playMusicByPath("BGM_Star")
                    this.startFlag = true
                    this.BgUI.bombCount.active = true
                    this.BgUI.bombCountLabel.string = this.bombCount.toString()
                })
                .start()
        }, 1.5)
    }

    release() {
        tween(this.specialBg)
            .to(0.5, { opacity: this.specialBgOp })
            .start()
        tween(this.normalBg)
            .to(0.5, { opacity: this.normalBgOp })
            .start()
        tween(this.starSkillBg)
            .to(0.5, { opacity: 0 })
            .start()
        this.BgUI.starParticel.active = false
        this.BgUI.countDownLabel.node.active = false
    }

    screenTouchEnd(e) {
        if (!this.startFlag || this.bombCount <= 0) return
        var pos: Vec2 = new Vec2()
        e.getLocation(pos)
        this.cameraMgr.mainCamera.screenPointToRay(pos.x, pos.y, this.gameMgr.ray)
        if (PhysicsSystem.instance.raycast(this.gameMgr.ray)) {
            const r = PhysicsSystem.instance.raycastResults;
            let NearestNode: PhysicsRayResult = null
            for (let i = 0; i < r.length; i++) {
                if (NearestNode === null) {
                    NearestNode = r[i]
                }
                else {
                    if (NearestNode.distance > r[i].distance) {
                        NearestNode = r[i]
                    }
                }
            }
            this.spwnBomb(NearestNode.hitPoint)
        }
    }

    update(dt) {
        if (!this.startFlag) return
        Quat.fromEuler(this.qt_1, 0, 40 * dt, 0)
        this.modelAxis.rotate(this.qt_1, Node.NodeSpace.LOCAL)
    }

    spwnBomb(pos: Vec3) {
        if (this.bombCount <= 0) return
        loader.loadRes("DelayLoader/Bomb", Prefab, (err: any, prefab: Prefab) => {
            if (err)  return
            let bomb = instantiate(prefab)
            bomb.setParent(this.modelAxis)
            bomb.setWorldPosition(pos)
            let scale = Math.abs(this.modelMgr.paintingModel.cameraDis)
            scale *= 0.14
            bomb.setScale(cc.v3(scale, scale, scale))
            let worldScale = bomb.getWorldScale().x
            if (this.bombCount == 1) {
                worldScale *= 3
                bomb.setScale(cc.v3(scale * 2.5, scale * 2.5, scale * 2.5))
            } else {
                worldScale *= 1
            }

            let includeIndex = []
            for (let index of this.unpaintIndex) {
                let indexPos = GFXOpearte.getCenterByIndices(index, this.modelMgr.paintingModel.model)
                let distance = Vec3.distance(indexPos, pos)
                if (distance <= worldScale && !this.hadPush.includes(index)) {
                    includeIndex.push(index)
                    this.hadPush.push(index)
                }
            }
            let count = this.bombCount
            var callBack = function () {
                if (count == 1) {
                    this.scheduleOnce(() => {
                        GameMgr.getInstance().switchSceneState(new PaintSceneState())
                    }, 3)
                }
                this.cameraMgr.playBombAinm(scale)
                this.paint(includeIndex, bomb, worldScale)
            }.bind(this)
            bomb.getComponent(SkillBomb).init(callBack)
            this.bombCount -= 1
            this.BgUI.bombCountLabel.string = this.bombCount.toString()
            if (this.bombCount == 0) {
                this.BgUI.bombCount.active = false
            }
        })


    }

    paint(indexList: number[], boom: Node, scale: number) {
        if (indexList.length > 0) {
            //恢复一个三角形
            let paintingModel = this.modelMgr.paintingModel
            paintingModel.destoryTrangleList(indexList)
            for (let index of indexList) {
                paintingModel.disableSingleNum(index)
                paintingModel.currentpaintIndex.push(index)
            }
            let color = paintingModel.getColorByIndex(indexList[0])
            //播放填涂动画
            let parent = this.modelMgr.paintingRotatePoint
            //播放粒子特效
            this.effectMgr.playPaintEffect(boom.getWorldPosition(), scale / 6, parent, color)
        }
    }
}
