import { _decorator, Component, Node, CameraComponent, Vec3, Quat, tween, mat4, math } from 'cc';
import { DepthBufferComponent } from '../../../shader-lib/depth-buffer/depth-buffer-component';
const { ccclass, property } = _decorator;

@ccclass('CameraMgr')
export class CameraMgr extends Component {

    @property({
        type: CameraComponent,
        displayName: '特效摄像机',
    })
    effectCamera: CameraComponent = null

    @property({
        type: CameraComponent,
        displayName: '主摄像机',
    })
    mainCamera: CameraComponent = null

    @property({
        type: CameraComponent,
        displayName: '天空盒摄像机',
    })
    skyBoxCamera: CameraComponent = null

    public orinigalPos: Vec3 = new Vec3()
    private orinigalRotate: Quat = new Quat()
    private targetPos: Vec3 = new Vec3()

    public currentSettingDis: number = 0

    init(cameraDis: number) {
        this.setCameraDis(cameraDis)
        this.orinigalPos = this.mainCamera.node.getWorldPosition()
        this.orinigalRotate = this.mainCamera.node.getWorldRotation()
        this.targetPos = new Vec3(0, 0, 0)
    }

    setCameraDisByTouch(delta: number) {
        let lastZ = this.mainCamera.node.position.z
        this.mainCamera.node.setPosition(cc.v3(0, 0, this.mainCamera.node.position.z + delta * Math.abs(this.currentSettingDis) * 0.001))
        if (this.mainCamera.node.position.z > (this.currentSettingDis + Math.abs(this.currentSettingDis * 0.5))) {
            this.mainCamera.node.setPosition(cc.v3(0, 0, lastZ))
        }
        if (this.mainCamera.node.position.z < (this.currentSettingDis - Math.abs(this.currentSettingDis * 0.5))) {
            this.mainCamera.node.setPosition(cc.v3(0, 0, lastZ))
        }
        // if (this.mainCamera.node.position.z > -0.1) {
        //     this.mainCamera.node.setPosition(cc.v3(0, 0, -0.1))
        // }
        // if (this.mainCamera.node.position.z < -0.9) {
        //     this.mainCamera.node.setPosition(cc.v3(0, 0, -0.9))
        // }
        //this.effectCamera.node.setPosition(cc.v3(0, 0, this.mainCamera.node.position.z + delta))
        // if (this.effectCamera.node.position.z > -0.1) {
        //     this.effectCamera.node.setPosition(cc.v3(0, 0, -0.1))
        // }
        // if (this.effectCamera.node.position.z < -0.9) {
        //     this.effectCamera.node.setPosition(cc.v3(0, 0, -0.9))
        // }
    }

    resetCamera(anim: boolean = false) {
        if (anim) {
            tween(this.mainCamera.node)
                .to(0.5, { worldPosition: this.orinigalPos })
                .start()
            tween(this.mainCamera.node)
                .to(0.5, { worldRotation: this.orinigalRotate })
                .start()
            this.mainCamera.node.setWorldPosition(this.orinigalPos)
            this.mainCamera.node.setWorldRotation(this.orinigalRotate)
        } else {
            this.mainCamera.node.setWorldPosition(this.orinigalPos)
            this.mainCamera.node.setWorldRotation(this.orinigalRotate)
        }
        this.targetPos = new Vec3(0, 0, 0)
    }

    /**
     * 播放相机动画
     * @param startDis 开始距离
     * @param endDis 结束距离
     */
    playCameraDisAnim(startDis: number, endDis: number, callBack = null) {
        this.mainCamera.node.setPosition(cc.v3(0, 0, startDis))
        this.effectCamera.node.setPosition(cc.v3(0, 0, startDis))
        this.skyBoxCamera.node.setPosition(cc.v3(0, 0, startDis))
        tween(this.mainCamera.node)
            .to(0.5, { position: cc.v3(0, 0, endDis) }, { easing: "circOut" })
            .call(() => {
                if (callBack) callBack()
            })
            .start()
    }

    setCameraDis(dis: number, callBack = null) {
        let cameraPos = cc.v3(this.mainCamera.node.position.x, this.mainCamera.node.position.y, dis)
        this.mainCamera.node.setPosition(cameraPos)
        this.currentSettingDis = dis
        if (callBack) callBack()
    }

    setCenterTarget(node: Node, isAnim = false) {
        let offset = node.getWorldPosition().subtract(this.targetPos)
        this.targetPos = node.getWorldPosition()
        let pos = this.mainCamera.node.getWorldPosition().add(offset)
        if (isAnim) {
            tween(this.mainCamera.node)
                .to(0.5, { worldPosition: pos }, { easing: "circOut" })
                .start()
        }
        else {
            this.mainCamera.node.setWorldPosition(pos)
        }
    }

    playCameraAnim(endPos: Vec3, callBack = null) {
        tween(this.mainCamera.node)
            .delay(0.5)
            .to(0.5, { worldPosition: endPos }, { easing: "circOut" })
            .call(() => {
                if (callBack) callBack()
            })
            .start()
    }

    playSwitchBgAnim(callBack) {
        let pos = this.mainCamera.node.getPosition()
        tween(this.mainCamera.node)
            .to(1.5, { position: cc.v3(pos.x, pos.y + 0.03, pos.z) }, { easing: "circOut" })
            .delay(2)
            .to(1.5, { position: cc.v3(pos.x, pos.y, pos.z) }, { easing: "circOut" })
            .call(() => {
                if (callBack) callBack()
            })
            .start()
    }

    playBombAinm(scale: number) {
        scale *= 12
        let pos = this.mainCamera.node.getPosition()
        tween(this.mainCamera.node)
            .to(0.05, { position: cc.v3(pos.x + 0.01 * scale, pos.y, pos.z) })
            .to(0.05, { position: cc.v3(pos.x - 0.01 * scale, pos.y, pos.z) })
            .to(0.05, { position: cc.v3(pos.x, pos.y + 0.01 * scale, pos.z) })
            .to(0.05, { position: cc.v3(pos.x, pos.y - 0.01 * scale, pos.z) })
            .to(0.02, { position: cc.v3(pos.x + 0.005 * scale, pos.y, pos.z) })
            .to(0.02, { position: cc.v3(pos.x - 0.005 * scale, pos.y, pos.z) })
            .to(0.02, { position: cc.v3(pos.x, pos.y + 0.005 * scale, pos.z) })
            .to(0.02, { position: cc.v3(pos.x, pos.y - 0.005 * scale, pos.z) })
            .to(0.03, { position: cc.v3(pos.x, pos.y, pos.z) })
            .start()
    }

    updateCamera() {
        this.effectCamera.node.setWorldPosition(this.mainCamera.node.getWorldPosition())
        this.effectCamera.node.setWorldRotation(this.mainCamera.node.getWorldRotation())
    }

}
