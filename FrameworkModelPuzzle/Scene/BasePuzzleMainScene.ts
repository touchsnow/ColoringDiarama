import { _decorator, Node } from 'cc';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
import BaseScene from '../../Framework3D/Src/Base/BaseScene';
import { MainSceneBasePage } from '../MainSceneBasePage';
const { ccclass, property } = _decorator;




@ccclass('BasePuzzleMainScene')
export class BasePuzzleMainScene extends BaseScene {

    protected currentPage: MainSceneBasePage = null;

    @property({
        type: Node,
        displayName: '列表按钮',
    })
    listButton: Node = null

    @property({
        type: Node,
        displayName: '成就按钮',
    })
    achieveButton: Node = null

    @property({
        type: Node,
        displayName: '展览按钮',
    })
    showButton: Node = null

    @property({
        type: MainSceneBasePage,
        displayName: '列表页',
    })
    listPage: MainSceneBasePage = null

    @property({
        type: MainSceneBasePage,
        displayName: '成就页',
    })
    achievePage: MainSceneBasePage = null

    @property({
        type: MainSceneBasePage,
        displayName: '成就页',
    })
    showPage: MainSceneBasePage = null

    start() {
        super.start()
        this.listButton.on(Node.EventType.TOUCH_END, this.onListButton, this)
        this.achieveButton.on(Node.EventType.TOUCH_END, this.onAchieveButton, this)
        this.showButton.on(Node.EventType.TOUCH_END, this.onShowButton, this)
        this.currentPage = this.listPage
    }

    /**列表按钮 */
    onListButton() {
        if (this.currentPage === this.listPage) return
        this.currentPage.setDisAble()
        this.currentPage = this.listPage
        this.currentPage.setEnAble()
    }

    /**成就按钮 */
    onAchieveButton() {
        if (this.currentPage === this.achievePage) return
        this.currentPage.setDisAble()
        this.currentPage = this.achievePage
        this.currentPage.setEnAble()
    }
    /**展览按钮 */
    onShowButton() {
        if (this.currentPage === this.showPage) return
        this.currentPage.setDisAble()
        let lastPage = this.currentPage
        this.currentPage = this.showPage
        this.currentPage.setEnAble(lastPage)
    }
    /**代码切换页面 */
    switchPage(page: MainSceneBasePage, ...args: any) {
        if (this.currentPage === page) return
        this.currentPage = page
        this.currentPage.setEnAble(args)
    }
}
