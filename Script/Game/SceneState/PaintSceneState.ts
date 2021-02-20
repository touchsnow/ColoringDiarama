import { _decorator, Component, Node, Vec2, geometry, Quat, Vec3, math, Enum, tween, find } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import { DepthBufferComponent } from '../../../shader-lib/depth-buffer/depth-buffer-component';
import { StaticModel } from '../../Data/StaticModel';
import { GuideUI } from '../../View/UI/GuideUI';
import { ConfigManager } from '../Managers/ConfigManager';
import { GameMgr } from '../Managers/GameMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
import { GFXOpearte } from '../Uitls/GFXOpearte';
import { ISceneState } from './ISceneState';
const { ccclass, property } = _decorator;
enum TouchState {
    NONE,
    MOVE,
    PAINT
}
@ccclass('PaintSceneState')
export class PaintSceneState extends ISceneState {
    /**触摸状态 */
    protected touchState = null
    /**相机根节点 */
    rotateAxis: Node = null
    /**模型节点 */
    modelAxis: Node = null
    /**旋转速度 */
    rotateSpeed = 5;
    /**拼涂音效的点 */
    private musicPoint: number = 1
    /**拼涂音效是否在播放 */
    private musicPlaying: boolean = false

    protected v2_1 = new Vec2()
    protected v2_2 = new Vec2()
    protected qt_1 = new Quat()
    protected TouchStates = Enum(TouchState);

    /**双指触摸距离 */
    private touchDis: number = 0

    /**相机射线 */
    protected ray: geometry.ray = new geometry.ray()

    private paintedList: Node[] = []

    init(gameMgr: GameMgr) {
        super.init(gameMgr)
        AudioManager.getInstance().playMusicByPath("BGM_Paint")
        this.touchState = this.TouchStates.NONE
        this.rotateAxis = this.cameraMgr.mainCamera.node.parent
        this.modelAxis = this.modelMgr.paintingRotatePoint
        this.modelAxis.setWorldPosition(0, 0, 0)
        //设置为modelPoint的初始角度
        this.modelAxis.setWorldRotationFromEuler(-20, 0, 0)
        //初始化相机位置
        this.rotateAxis.setWorldPosition(0, 0, 0)
        this.rotateAxis.setWorldRotationFromEuler(0, 0, 0)
        this.cameraMgr.resetCamera()
        this.cameraMgr.mainCamera.node.getComponent(DepthBufferComponent).enabled = false
        this.cameraMgr.effectCamera.node.active = true
        this.modelMgr.initPaintingModel()
        let staticModel = this.modelMgr.modelPoint.getComponent(StaticModel)
        if (staticModel) {
            staticModel.staticModel.forEach(element => {
                element.active = false
            })
        }
        let modelEffect = this.modelMgr.middleEffect
        if (modelEffect && StorgeMgr.getInstance().getLevelInfo(ConfigManager.getInstance().currentLevel.levelName).swichBg) {
            modelEffect.active = false
        }
        let paintingModel = this.modelMgr.paintingModel
        let finishCount = paintingModel.model.paintedIndex.length
        let totalCount = paintingModel.model.trangleScrIndices.length / 3
        let progress = finishCount / totalCount
        this.gameUIMgr.paintUI.playProgressAnim(progress)
        //console.log(progress)
        if (progress >= 1) {
            this.playFinishAnim()
            this.gameUIMgr.paintUI.setFalse()
            paintingModel.model.lineModel.active = false
        }
        //判断是否为引导模式
        if (this.gameMgr.gameMode == this.gameMgr.GameMode.Guide) {
            this.scheduleOnce(() => {
                find("Canvas/GuideUI").getComponent(GuideUI).setNextProgress()
            })
        }
    }

    release() {
        this.gameUIMgr.paintUI.setFalse()
        this.cameraMgr.mainCamera.node.getComponent(DepthBufferComponent).enabled = true
        this.cameraMgr.effectCamera.node.active = false
        if (this.modelMgr.paintingModel) {
            this.modelMgr.relseasePaintingModel()
        }
    }

    screenTouchStart(e) {
        this.touchState = this.TouchStates.NONE
        var pos: Vec2 = new Vec2()
        e.getLocation(pos)
        let index = this.modelMgr.paintingModel.getTrangelIndexByPos(pos)
        if (index != null) {
            this.touchState = this.TouchStates.PAINT
            this.paint(index)
        }
    }

    screenTouchMove(e) {
        if (this.touchState == this.TouchStates.PAINT) {
            var pos: Vec2 = new Vec2()
            e.getLocation(pos)
            let index = this.modelMgr.paintingModel.getTrangelIndexByPos(pos)
            if (index != null) {
                this.paint(index)
            }
        }
        else if (e.getTouches().length === 1) {
            e.getStartLocation(this.v2_1)
            e.getDelta(this.v2_2)
            Quat.fromEuler(this.qt_1, 0, this.v2_2.x * this.rotateSpeed * 0.1, 0)
            this.modelAxis.rotate(this.qt_1, Node.NodeSpace.LOCAL)
            Quat.fromEuler(this.qt_1, this.v2_2.y * this.rotateSpeed * 0.1, 0, 0)
            this.modelAxis.rotate(this.qt_1, Node.NodeSpace.WORLD)
            if (this.modelAxis.eulerAngles.x >= 90 || this.modelAxis.eulerAngles.x <= -90) {
                Quat.fromEuler(this.qt_1, -this.v2_2.y * this.rotateSpeed * 0.1, 0, 0)
                this.modelAxis.rotate(this.qt_1, Node.NodeSpace.WORLD)
            }
            if (this.v2_2.x !== 0 && this.v2_2.y !== 0) {
                this.touchState = this.TouchStates.MOVE
            }
        }
        if (e.getTouches().length === 2) {
            let touch1 = e.getTouches()[0]
            let touch2 = e.getTouches()[1]
            let pos1 = touch1.getLocation()
            let pos2 = touch2.getLocation()
            let newTouchDis = Vec2.distance(pos1, pos2)
            if (this.touchDis !== 0) {
                this.gameMgr.cameraMgr.setCameraDisByTouch((newTouchDis - this.touchDis))
            }
            this.touchDis = newTouchDis
            let v2_1 = new Vec2()
            let v2_2 = new Vec2()
            touch1.getDelta(v2_1)
            touch2.getDelta(v2_2)
            let cameraDis = this.cameraMgr.currentSettingDis
            if (v2_1.x > 0 && v2_2.x > 0) {
                const result = new Vec3(1, 0, 0)
                math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
                let moveDelta = Math.abs(v2_1.x + v2_2.x)
                let pos = this.rotateAxis.getPosition()
                pos.add(result.multiplyScalar(0.00005 * moveDelta * -cameraDis))
                this.rotateAxis.setPosition(pos)
            }
            if (v2_1.x < 0 && v2_2.x < 0) {
                const result = new Vec3(-1, 0, 0)
                math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
                let moveDelta = Math.abs(v2_1.x + v2_2.x)
                let pos = this.rotateAxis.getPosition()
                pos.add(result.multiplyScalar(0.00005 * moveDelta * -cameraDis))
                this.rotateAxis.setPosition(pos)
            }
            if (v2_1.y > 0 && v2_2.y > 0) {
                const result = new Vec3(0, -1, 0)
                math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
                let moveDelta = Math.abs(v2_1.y + v2_2.y)
                let pos = this.rotateAxis.getPosition()
                pos.add(result.multiplyScalar(0.00005 * moveDelta * -cameraDis))
                this.rotateAxis.setPosition(pos)
            }
            if (v2_1.y < 0 && v2_2.y < 0) {
                const result = new Vec3(0, 1, 0)
                math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
                let moveDelta = Math.abs(v2_1.y + v2_2.y)
                let pos = this.rotateAxis.getPosition()
                pos.add(result.multiplyScalar(0.00005 * moveDelta * -cameraDis))
                this.rotateAxis.setPosition(pos)
            }
            this.touchState = this.TouchStates.MOVE
        }
    }

    screenTouchEnd(e) {
        if (this.touchState == this.TouchStates.NONE) {
        }
        this.touchDis = 0
        this.touchState = this.TouchStates.NONE
        this.modelMgr.paintingModel.updateScreenPos()
        for (let node of this.paintedList) {
            if (node) node.destroy()
        }
        this.paintedList = []
        this.modelMgr.paintingModel.model.updateMeshData()
        this.modelMgr.paintingModel.model.updateMesh()
    }

    /**填涂一个三角形 */
    paint(index: number, playMusic: boolean = true) {
        //播放音乐
        if (playMusic) {
            this.playMusicPoint()
        }
        //增加星星技能的进度
        this.gameUIMgr.paintUI.addStarFill()
        //恢复一个三角形
        let paintingModel = this.modelMgr.paintingModel
        paintingModel.destoryTrangle(index, false)
        paintingModel.disableSingleNum(index)
        let color = paintingModel.currentColor
        //播放填涂动画 
        let node = paintingModel.playPaintAnim(index, color, false)
        this.paintedList.push(node)
        let worldPos = GFXOpearte.getCenterByIndices(index, paintingModel.model)
        let worldScale = GFXOpearte.getMinDisByIndices(index, paintingModel.model)
        paintingModel.scrollView.currentItem.paint()
        let parent = this.modelMgr.paintingRotatePoint
        //播放粒子特效
        this.effectMgr.playPaintEffect(worldPos, worldScale, parent, color)
        //计算进度
        let progress = paintingModel.model.paintedIndex.length / (paintingModel.model.trangleScrIndices.length / 3)
        this.gameUIMgr.paintUI.setProgress(progress)
        if (progress == 1) {
            this.playFinishAnim()
            paintingModel.model.lineModel.active = false
        }
    }

    playFinishAnim(callBack = null) {
        AudioManager.getInstance().stopMusic()
        this.gameUIMgr.paintUI.setFalse()
        let dis = this.modelMgr.paintingModel.cameraDis
        let targerPos = cc.v3(0, 0, 2 * dis)
        let camera = this.cameraMgr.mainCamera.node
        tween(camera)
            .to(2, { position: targerPos }, { easing: "circOut" })
            .start()
        let paintPoint = this.modelMgr.paintingRotatePoint
        let pointEuler: Vec3 = new Vec3()
        this.modelMgr.originalPaintingRotate.getEulerAngles(pointEuler)
        tween(paintPoint)
            .to(2, { eulerAngles: pointEuler }, { easing: "circOut" })
            .call(() => {
                DialogManager.getInstance().showDlg("PaintingFinishedDialog")
            })
            .start()
    }

    playBackToSellectStateAnim(callBack = null) {
        this.gameUIMgr.paintUI.setFalse()
        let paintingModel = this.modelMgr.paintingModel
        if (paintingModel) {
            AudioManager.getInstance().playEffectByPath("ColoringComplete")
            this.modelMgr.relseasePaintingModel()
            //播放完成动画
            let playIndexList = []
            let paintIndex = paintingModel.currentpaintIndex
            for (let i = 0; i < paintIndex.length; i++) {
                let random = (math.random() * paintIndex.length).toFixed(0)
                let index = paintIndex[random]
                if (!playIndexList.includes(index)) {
                    playIndexList.push(index)
                }
                if (playIndexList.length >= 10) {
                    break
                }
            }
            for (let i = 0; i < playIndexList.length; i++) {
                let index = playIndexList[i]
                let color = paintingModel.getColorByIndex(index)
                paintingModel.playPaintAnim(index, color)
                let worldPos = GFXOpearte.getCenterByIndices(index, paintingModel.model)
                let worldScale = GFXOpearte.getMinDisByIndices(index, paintingModel.model)
                let parent = this.modelMgr.paintingRotatePoint
                this.effectMgr.playPaintEffect(worldPos, worldScale, parent, color)
            }
            //播放相机动画
            this.cameraMgr.resetCamera()
            this.cameraMgr.setCenterTarget(paintingModel.model.node)
            let startDis = (-0.01843351 * paintingModel.model.modelSize - 0.015411)
            startDis += startDis * 0.4
            this.cameraMgr.setCameraDis(startDis)
            this.cameraMgr.playCameraAnim(this.cameraMgr.orinigalPos, callBack)
        }
    }

    //一键涂色
    paintAllByOneTouch() {
        for (let i of this.modelMgr.paintingModel.currentColorIdices) {
            if (!this.modelMgr.paintingModel.model.paintedIndex.includes(i)) {
                this.paint(i, false)
            }
        }
    }

    playMusicPoint() {
        if (!this.musicPlaying) {
            this.musicPlaying = true
            AudioManager.getInstance().playEffectByPath("MusicPoint/v13_" + this.musicPoint.toString())
            this.musicPoint += 1
            if (this.musicPoint == 41) {
                this.musicPoint = 1
            }
            this.scheduleOnce(() => {
                this.musicPlaying = false
            }, 0.17)
        }
    }
}
