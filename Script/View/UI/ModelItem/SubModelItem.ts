import { _decorator, Component, Node, instantiate, MeshColliderComponent, UITransformComponent, UIModelComponent, Vec3, ModelComponent, tween, ColliderComponent } from 'cc';
import AudioManager from '../../../../Framework3D/Src/Base/AudioManager';
import { ColoringDioramaModel } from '../../../Data/ColoringDioramaModel';
import { GameMgr } from '../../../Game/Managers/GameMgr';
import { PaintSceneState } from '../../../Game/SceneState/PaintSceneState';
import { SubScrollViewMgr } from '../SubScrollViewMgr';
import { ModelItemBase } from './ModelItemBase';
const { ccclass, property } = _decorator;

@ccclass('SubModelItem')
export class SubModelItem extends ModelItemBase {

    private models: ColoringDioramaModel[] = []
    public model: ColoringDioramaModel = null
    private manager: SubScrollViewMgr = null
    public finished: boolean = false
    private progress: number = 0

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    init(...args) {
        super.init(...args)
        this.models = args[1]
        this.model = this.models[0]
        this.manager = args[2]
        let modelUI = instantiate(this.model.node)
        modelUI.removeComponent(ColoringDioramaModel)
        //modelUI.removeComponent(ColliderComponent)
        //this.model.addMeshCollider()
        modelUI.getComponent(ModelComponent).setMaterial(this.uiMat, 0)
        modelUI.addComponent(UITransformComponent)
        modelUI.addComponent(UIModelComponent)
        modelUI.setParent(this.node)
        modelUI.setPosition(cc.v3(0, 0, 0))
        let size = 14000 / this.model.modelSize
        modelUI.setWorldScale(modelUI.getScale().multiplyScalar(size).multiplyScalar(this.model.node.parent.getScale().x))
        modelUI.setWorldRotation(this.model.node.worldRotation)
        let worldEuler: Vec3 = new Vec3()
        modelUI.getWorldRotation().getEulerAngles(worldEuler)
        modelUI.setWorldRotationFromEuler(worldEuler.x, worldEuler.y + 180, worldEuler.z)
        this.scheduleOnce(() => {
            let modelWorldPos = modelUI.getWorldPosition()
            let modelBoxPos = modelUI.getComponent(ModelComponent).model.worldBounds.center
            let moveVec = modelBoxPos.subtract(modelWorldPos)
            modelUI.setWorldPosition(modelUI.worldPosition.subtract(moveVec))
        }, 0)
    }

    sellect() {
        let finishCount = this.model.paintedIndex.length
        let totalCount = this.model.trangleScrIndices.length / 3
        this.progress = finishCount / totalCount
        tween(this.node)
            .to(0.2, { scale: cc.v3(1.2, 1.2, 1.2) }, { easing: "circOut" })
            .to(0.2, { scale: cc.v3(1, 1, 1) }, { easing: "circOutIn" })
            .start()
        let sellectUI = GameMgr.getInstance().gameUIMgr.sellectUI
        if (this.progress >= 1) {
            sellectUI.paintButton.active = false
        }
        else {
            sellectUI.paintButton.active = true
            sellectUI.adPaintButton.active = false
            sellectUI.paintButtons.active = true
            sellectUI.playPaintButtonAnim()
        }
        this.sellectBg.active = true
        GameMgr.getInstance().modelMgr.sellectModel = this.model
        var callBack = function () {
            AudioManager.getInstance().playEffectByPath("Click01")
            sellectUI.loadNode.active = true
            this.scheduleOnce(() => {
                GameMgr.getInstance().switchSceneState(new PaintSceneState())
            }, 0.5)
        }.bind(this)

        sellectUI.registerPaintButtonCB(callBack)
    }

    cancleSellect(item) {
        this.sellectBg.active = false
        this.manager.disable(item)
    }

    onTouch(lock = true) {
        super.onTouch()
        this.sellectUI.selectItem(this)
    }

    updateDisplay() {
        let finishCount = this.model.paintedIndex.length
        let totalCount = this.model.trangleScrIndices.length / 3
        if (finishCount == totalCount) {
            this.checkNode.active = true
            this.finished = true
        }
        this.progress = finishCount / totalCount
        //(this.progress)
    }

}
