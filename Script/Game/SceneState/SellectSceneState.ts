import { _decorator, Component, Node, Vec2, PhysicsSystem, PhysicsRayResult, Quat, Enum, geometry, CCInteger, Vec3, math, find, instantiate, profiler, loader } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import { StaticModel } from '../../Data/StaticModel';
import { GuideUI } from '../../View/UI/GuideUI';
import { ModelItemBase } from '../../View/UI/ModelItem/ModelItemBase';
import { ConfigManager } from '../Managers/ConfigManager';
import { GameMgr } from '../Managers/GameMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
import { ISceneState } from './ISceneState';
import { LevelFinishAnimState } from './LevelFinishAnimState';
import { SettlePageAnimState } from './SettlePageAnimState';
import { SwitchBGState } from './SwitchBGState';
const { ccclass, property } = _decorator;
enum TouchState {
    NONE,
    MOVE
}
@ccclass('SellectSceneState')
export class SellectSceneState extends ISceneState {
    /**触摸状态 */
    protected touchState = null
    /**相机根节点 */
    rotateAxis: Node = null
    /**模型节点 */
    modelAxis: Node = null
    /**旋转速度 */
    rotateSpeed = 5;

    protected v2_1 = new Vec2()
    protected v2_2 = new Vec2()
    protected qt_1 = new Quat()
    protected TouchStates = Enum(TouchState);

    /**双指触摸距离 */
    private touchDis: number = 0

    /**相机射线 */
    protected ray: geometry.ray = new geometry.ray()

    init(gameMgr: GameMgr) {
        super.init(gameMgr)
        AudioManager.getInstance().playMusicByPath("BGM_Sellect")
        this.gameUIMgr.sellectUI.loadNode.active = false
        let progress = this.modelMgr.getAllProgress()
        this.touchState = this.TouchStates.NONE
        this.rotateAxis = this.cameraMgr.mainCamera.node.parent
        this.modelAxis = find("ModelPoint/ModelPoint")
        this.rotateAxis.setWorldPosition(0, 0, 0)
        this.rotateAxis.setWorldRotationFromEuler(0, 0, 0)
        this.cameraMgr.resetCamera()
        let staticModel = this.modelMgr.modelPoint.getComponent(StaticModel)
        if (staticModel) {
            this.cameraMgr.effectCamera.node.active = true
            staticModel.staticModel.forEach(element => {
                element.active = false
            })
        }
        this.scheduleOnce(() => {
            this.cameraMgr.effectCamera.node.active = false
            if (staticModel) {
                staticModel.staticModel.forEach(element => {
                    element.active = true
                })
            }
        }, 0)

        let modelEffect = this.modelMgr.middleEffect
        if (modelEffect &&
            StorgeMgr.getInstance().getLevelInfo(ConfigManager.getInstance().currentLevel.levelName).swichBg) {
            modelEffect.active = true
        }

        let levelName = ConfigManager.getInstance().currentLevel.levelName
        let levelInfo = StorgeMgr.getInstance().getLevelInfo(levelName)

        //console.log(progress)
        //console.log(levelInfo.showSettlePage)
        console.log("progress:" + progress)
        console.log("showSettlePage:" + levelInfo.showSettlePage)
        if (levelInfo.swichBg) {
            this.gameUIMgr.backGroundUI.normalBg.node.active = false
            this.gameUIMgr.backGroundUI.specialBg.node.active = true
        }
        if (progress > 0.5 && !levelInfo.swichBg) {
            //if (true) {
            if (!levelInfo.swichBg) {
                levelInfo.swichBg = true
                StorgeMgr.getInstance().setLevelInfo(levelName, levelInfo)
                this.gameMgr.switchSceneState(new SwitchBGState())
            }
        }
        else if (progress >= 1 && !levelInfo.finishedAnim) {
            levelInfo.finishedAnim = true
            StorgeMgr.getInstance().setLevelInfo(levelName, levelInfo)
            this.gameMgr.switchSceneState(new LevelFinishAnimState())
        }
        else if (levelInfo.finishedAnim && !levelInfo.showSettlePage) {
            console.log("进入settlepage")
            this.gameMgr.switchSceneState(new SettlePageAnimState())
        }
        else if (!StorgeMgr.getInstance().guidance) {
            let guideUI = instantiate(loader.getRes("UI/GuideUI"))
            guideUI.setParent(find("Canvas"))
            guideUI.getComponent(GuideUI).init(this.gameMgr)
            StorgeMgr.getInstance().guidance = true
            StorgeMgr.getInstance().update()
            this.gameMgr.gameMode = this.gameMgr.GameMode.Guide
        }
        else {
            this.gameUIMgr.sellectUI.setTrue()
            this.gameUIMgr.sellectUI.updateDisplay()
            this.gameUIMgr.sellectUI.sellectAItem()
            this.gameUIMgr.sellectUI.setProgress(this.modelMgr.getAllProgress())
            let allProgress = this.modelMgr.getAllProgress()
            if (allProgress >= 1) {
                this.gameUIMgr.sellectUI.paintButtons.active = false
            }
            if (!this.gameMgr.hadShowWelfale && !levelInfo.finished
                && ConfigManager.getInstance().currentLevel.levelName !== "00202_CuteHamsterEatingCarrot") {
                this.gameMgr.hadShowWelfale = true
                var callback = function () {
                    this.gameUIMgr.sellectUI.updateDisplay()
                }.bind(this)
                let data = {
                    acceptCallback: callback,
                    cancleCallback: callback
                }
                if (!levelInfo.hadRecieveWelfare) {
                    levelInfo.hadRecieveWelfare = true
                    StorgeMgr.getInstance().setLevelInfo(levelName, levelInfo)
                    DialogManager.getInstance().showDlg("UnlockWelfareDialog", data)
                }
            }
        }
    }

    release() {
        this.gameUIMgr.sellectUI.setFalse()
    }

    screenTouchStart(e) {

    }

    screenTouchMove(e) {
        if (e.getTouches().length === 1) {
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
        // if (e.getTouches().length === 2) {
        //     let touch1 = e.getTouches()[0]
        //     let touch2 = e.getTouches()[1]
        //     let pos1 = touch1.getLocation()
        //     let pos2 = touch2.getLocation()
        //     let newTouchDis = Vec2.distance(pos1, pos2)
        //     if (this.touchDis !== 0) {
        //         this.gameMgr.cameraMgr.setCameraDistant((newTouchDis - this.touchDis) * 0.0005)
        //     }
        //     this.touchDis = newTouchDis
        //     let v2_1 = new Vec2()
        //     let v2_2 = new Vec2()
        //     touch1.getDelta(v2_1)
        //     touch2.getDelta(v2_2)
        //     if (v2_1.x > 0 && v2_2.x > 0) {
        //         const result = new Vec3(1, 0, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.x + v2_2.x)
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.00005 * moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        //     if (v2_1.x < 0 && v2_2.x < 0) {
        //         const result = new Vec3(-1, 0, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.x + v2_2.x)
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.00005 * moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        //     if (v2_1.y > 0 && v2_2.y > 0) {
        //         const result = new Vec3(0, -1, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.y + v2_2.y)
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.00005 * moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        //     if (v2_1.y < 0 && v2_2.y < 0) {
        //         const result = new Vec3(0, 1, 0)
        //         math.Vec3.transformQuat(result, result, this.rotateAxis.getRotation())
        //         let moveDelta = Math.abs(v2_1.y + v2_2.y)
        //         let pos = this.rotateAxis.getPosition()
        //         pos.add(result.multiplyScalar(0.00005 * moveDelta))
        //         this.rotateAxis.setPosition(pos)
        //     }
        //     this.touchState = this.TouchStates.MOVE
        // }
    }

    screenTouchEnd(e) {
        this.touchDis = 0
        if (this.touchState === this.TouchStates.NONE) {
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
                //.log(NearestNode.collider.node)
                let model = this.modelMgr.getSellectModelByNode(NearestNode.collider.node)
                //console.log(model)
                let modelItem = this.gameUIMgr.sellectUI.getItem(model)
                if (modelItem) {
                    modelItem.onTouch()
                }
            }
        }
        this.touchState = this.TouchStates.NONE
    }
}
