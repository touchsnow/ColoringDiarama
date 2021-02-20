import { _decorator, Component, Node } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import { MainSceneBasePage } from '../../../FrameworkModelPuzzle/MainSceneBasePage';
import { BasePuzzleMainScene } from '../../../FrameworkModelPuzzle/Scene/BasePuzzleMainScene';
import { AdManager } from '../AD/AdManager';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends BasePuzzleMainScene {

    @property({
        type: Node,
        displayName: '商店按钮',
    })
    storeButton: Node = null

    @property({
        type: MainSceneBasePage,
        displayName: '商店页',
    })
    storePage: MainSceneBasePage = null

    @property(Node)
    box: Node = null

    start() {
        super.start()
        ASCAd.getInstance().hideNativeIcon()
        //ASCAd.getInstance().hideBanner()
        AdManager.getInstance().hideBanner()
        AdManager.getInstance().showBanner()
        this.storeButton.on(Node.EventType.TOUCH_END, this.onStoreButton, this)
        this.box.on(Node.EventType.TOUCH_END, this.onBox, this)
        if (PlatformManager.getInstance().isVivo()) {
        }
        else if (PlatformManager.getInstance().isOppo()) {
            //@ts-ignore
            if (qg.getSystemInfoSync().platformVersionCode >= 1076) {
                this.box.active = true
            }
            else {
                //this.showNativeIcon()
            }
        }
        else {
            //this.showNativeIcon()
        }
    }

    onStoreButton() {
        if (this.currentPage === this.storePage) return
        this.currentPage.setDisAble()
        let lastPage = this.currentPage
        this.currentPage = this.storePage
        this.currentPage.setEnAble(lastPage)
    }

    onBox() {
        if (ASCAd.getInstance().getNavigateBoxPortalFlag()) {
            //展示互推盒子九宫格
            ASCAd.getInstance().showNavigateBoxPortal();
        }
    }
}
