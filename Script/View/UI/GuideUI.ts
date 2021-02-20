import { _decorator, Component, Node, game, UITransformComponent, tween, Tween, BlockInputEventsComponent, LabelComponent, UIOpacityComponent } from 'cc';
import { GameMgr } from '../../Game/Managers/GameMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { PaintSceneState } from '../../Game/SceneState/PaintSceneState';
import { SellectSceneState } from '../../Game/SceneState/SellectSceneState';
import { ModelItemBase } from './ModelItem/ModelItemBase';
const { ccclass, property } = _decorator;

enum GuideProgress {
    TouchOneModel = "touchOneModel",
    TouchPaintButton = "touchPaintButton",
    TowPointMove = "towPointMove",
    TowPointMagnify = "towPointMagnify",
    MoveRotate = "moveRotate",
    SellectOneColor = "sellectOneColor",
    PaintModel = "paintModel",
    skillPromoty = "skillpromoty",
    SkillStar = "skillStar",
    SkillBomb = "skillBomb"
}

@ccclass('GuideUI')
export class GuideUI extends Component {

    private gameMgr: GameMgr = null

    private guideProgress = null
    private circleTween: Tween = null
    private circleTouchCallbak = null

    private touchStartCallback = null
    private touchMoveSingleCallBack = null
    private touchMoveDoubleCallBack = null
    private touchEndCallBack = null

    private singleMoveDelta: number = 0
    private doubleMoveDelta: number = 0
    private singleDeltaCallback = null
    private doubleDeltaCallback = null

    private hadGuidePrmoty: boolean = false
    private hadGuideStar: boolean = false
    private hadGuideBomb: boolean = false

    private fingerTween: Tween[] = []

    @property(Node)
    middleGuideTip: Node = null

    @property(Node)
    topGuideTip: Node = null

    @property(Node)
    guideCircle: Node = null

    @property(BlockInputEventsComponent)
    eventsBlock: BlockInputEventsComponent = null

    @property(Node)
    finger1: Node = null

    @property(Node)
    finger2: Node = null

    @property(Node)
    skipButton: Node = null

    private tweenList: Tween[] = []

    start() {
        //this.guideProgress = GuideProgress.TouchOneModel
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.skipButton.on(Node.EventType.TOUCH_END, this.onSkipButton, this)
    }

    init(gameMgr: GameMgr) {
        this.gameMgr = gameMgr
        this.setProgress(GuideProgress.TouchOneModel)
        this.guideCircle.on(Node.EventType.TOUCH_END, this.onGuideCircleTouch, this)
        //"进行了Init")
    }

    setProgress(progress: GuideProgress) {
        switch (progress) {
            case GuideProgress.TouchOneModel:
                this.touchOneModel()
                break
            case GuideProgress.TouchPaintButton:
                this.touchPaintButton()
                break
            case GuideProgress.TowPointMove:
                this.towPointMove()
                break
            case GuideProgress.TowPointMagnify:
                this.towPointMagnify()
                break
            case GuideProgress.MoveRotate:
                this.moveRotate()
                break
            case GuideProgress.SellectOneColor:
                this.sellectOneColor()
                break
            case GuideProgress.PaintModel:
                this.paintModel()
                break
            case GuideProgress.skillPromoty:
                this.skillPromory()
                break
            case GuideProgress.SkillStar:
                this.skillStar()
                break
            case GuideProgress.SkillBomb:
                this.skillBomb()
                break
            default:
                break
        }
    }

    onTouchStart(e) {
        // console.log("OnTouchStart")
        if (this.touchStartCallback) {
            this.touchStartCallback(e)
        }
    }

    onTouchMove(e) {
        // console.log("OnTouchMove")
        if (e.getTouches().length === 1) {
            if (this.touchMoveSingleCallBack) {
                this.touchMoveSingleCallBack(e)
                this.singleMoveDelta += 1
            }
        }
        if (e.getTouches().length === 2) {
            if (this.touchMoveDoubleCallBack) {
                this.touchMoveDoubleCallBack(e)
                this.doubleMoveDelta += 1
            }
        }
        if (this.singleMoveDelta >= 50 && this.singleDeltaCallback) {
            this.singleDeltaCallback()
            this.singleDeltaCallback = null
        }
        if (this.doubleMoveDelta >= 100 && this.doubleDeltaCallback) {
            this.doubleDeltaCallback()
            this.doubleDeltaCallback = null
        }
    }

    onTouchEnd(e) {
        if (this.touchEndCallBack) {
            this.touchEndCallBack(e)
        }
        this.singleMoveDelta = 0
        this.doubleMoveDelta = 0
    }

    //第一步：选择一个模型
    touchOneModel() {
        //  console.log("初始化")
        this.guideProgress = GuideProgress.TouchOneModel
        let sellectUI = this.gameMgr.gameUIMgr.sellectUI
        sellectUI.setTrue()
        sellectUI.backToMainButton.active = false
        sellectUI.node.getChildByName("ProgressBar").active = false
        sellectUI.gif.active = false
        sellectUI.paintButton.active = false
        this.showMiddleLabel("请选择欲涂色的模型")
        let firstItem = sellectUI.normalContent.children[0]
        this.guideCircle.active = true
        this.guideCircle.getComponent(UITransformComponent).setContentSize(firstItem.getContentSize())
        this.guideCircle.setWorldPosition(firstItem.getWorldPosition())
        this.eventsBlock.enabled = true
        this.playCircleAnim(4)
        var callBack = function () {
            firstItem.getComponent(ModelItemBase).onTouch()
            this.guideCircle.active = false
            this.stopCircleAnim()
            this.hideMidelLabel()
            this.setProgress(GuideProgress.TouchPaintButton)
        }.bind(this)
        this.circleTouchCallbak = callBack
    }

    //第二步：按涂色按钮
    touchPaintButton() {
        //  console.log("第二阶段，触摸paintButton")
        this.guideProgress = GuideProgress.TouchPaintButton
        this.showMiddleLabel("请按下涂色键")
        let paintButton = this.gameMgr.gameUIMgr.sellectUI.paintButton
        this.guideCircle.getComponent(UITransformComponent).setContentSize(paintButton.getContentSize())
        this.scheduleOnce(() => {
            this.guideCircle.setWorldPosition(paintButton.getWorldPosition())
        }, 0)
        this.guideCircle.active = true
        this.playCircleAnim(2.5)
        var callBack = function () {
            this.guideCircle.active = false
            this.stopCircleAnim()
            this.hideMidelLabel()
            this.gameMgr.gameUIMgr.sellectUI.onPaintButton()
            this.scheduleOnce(() => {
                this.setProgress(GuideProgress.TowPointMove)
            }, 0)
        }.bind(this)
        //  console.log("注册回调")
        this.circleTouchCallbak = callBack
    }

    //第三步：双指移动
    towPointMove() {
        this.guideProgress = GuideProgress.TowPointMove
        this.scheduleOnce(() => {
            this.scheduleOnce(() => { this.skipButton.active = true }, 3)
            this.showTopLabel("请用两只手指移动")
            this.fingerTouchMoveAnim()
            this.gameMgr.gameUIMgr.paintUI.fakeFalse()
            let paintingModel = this.gameMgr.modelMgr.paintingModel
            for (let i = 0; i < paintingModel.model.colorIndexDic.size; i++) {
                paintingModel.setColorByColorNum(i, cc.v4(1, 1, 1, 1))
                paintingModel.setNumState(i, false)
            }
        }, 2)

        var callback = function (e) {
            this.gameMgr.screenTouchMove(e)
        }.bind(this)
        this.touchMoveDoubleCallBack = callback
        var moveFinishCallback = function () {
            this.touchMoveDoubleCallBack = null
            this.hideTopLabel()
            this.showTopLabel("太棒了")
            let rotateAxis = this.gameMgr.cameraMgr.mainCamera.node.parent
            let t = tween(rotateAxis)
                .to(1, { position: cc.v3(0, 0, 0) })
                .call(() => {
                    if (this.node) {
                        for (let tween of this.fingerTween) {
                            tween.stop()
                        }
                        this.finger1.active = false
                        this.finger2.active = false
                        this.scheduleOnce(() => {
                            this.setProgress(GuideProgress.TowPointMagnify)
                        }, 1)
                    }
                })
                .start()
            this.tweenList.push(t)
        }.bind(this)
        this.doubleDeltaCallback = moveFinishCallback
    }

    //第四步：双指放大
    towPointMagnify() {
        this.guideProgress = GuideProgress.TowPointMagnify
        this.showTopLabel("请用2只手指放大")
        this.fingerMagnifyAnim()

        var callback = function (e) {
            this.gameMgr.screenTouchMove(e)
        }.bind(this)
        this.touchMoveDoubleCallBack = callback
        var moveFinishCallback = function () {
            this.touchMoveDoubleCallBack = null
            this.hideTopLabel()
            this.showTopLabel("非常好！")
            let camera = this.gameMgr.cameraMgr.mainCamera.node
            let dis = this.gameMgr.modelMgr.paintingModel.cameraDis
            let t = tween(camera)
                .to(1, { position: cc.v3(0, 0, dis) })
                .call(() => {
                    if (this.node) {
                        for (let tween of this.fingerTween) {
                            tween.stop()
                        }
                        this.finger1.active = false
                        this.finger2.active = false
                    }
                })
                .delay(1)
                .call(() => { if (this.node) this.setProgress(GuideProgress.MoveRotate) })
                .start()
            this.tweenList.push(t)
        }.bind(this)
        this.doubleDeltaCallback = moveFinishCallback
    }

    //第五步：单个手指旋转模型
    moveRotate() {
        this.guideProgress = GuideProgress.MoveRotate
        this.showTopLabel("请试着单个手指旋转模型")
        this.fingerRotateAnim()
        var callback = function (e) {
            this.gameMgr.screenTouchMove(e)
        }.bind(this)
        this.touchMoveSingleCallBack = callback
        var moveFinishCallback = function () {
            this.singleDeltaCallback = null
            this.showTopLabel("太棒了！")
            let rotatePoint = this.gameMgr.modelMgr.paintingRotatePoint
            let t = tween(rotatePoint)
                .delay(1)
                .call(() => {
                    if (this.node) {
                        this.touchMoveSingleCallBack = null
                        for (let tween of this.fingerTween) {
                            tween.stop()
                        }
                        this.finger1.active = false
                        this.setProgress(GuideProgress.SellectOneColor)
                    }
                })
                .to(1, { worldRotation: this.gameMgr.modelMgr.originalPaintingRotate })
                .start()
            this.tweenList.push(t)
        }.bind(this)
        this.singleDeltaCallback = moveFinishCallback
    }

    //选中一号颜色
    sellectOneColor() {
        this.showTopLabel("请选中1号颜色")
        this.gameMgr.gameUIMgr.paintUI.setTrue()
        let paintUI = this.gameMgr.gameUIMgr.paintUI
        paintUI.skillBomb.active = false
        paintUI.skillStar.active = false
        paintUI.promotyNode.active = false
        paintUI.backToSellectButton.active = false
        let item = this.gameMgr.modelMgr.paintingModel.scrollView.colorItem[0]
        item.cancle()
        this.guideCircle.getComponent(UITransformComponent).setContentSize(item.node.getContentSize())
        this.guideCircle.setWorldPosition(item.node.getWorldPosition())
        this.guideCircle.active = true
        this.playCircleAnim(4)
        var callback = function () {
            this.stopCircleAnim()
            this.guideCircle.active = false
            item.onTouchEnd()
            this.setProgress(GuideProgress.PaintModel)
        }.bind(this)
        this.circleTouchCallbak = callback
    }

    //填涂模式
    paintModel() {
        this.skipButton.active = false
        this.guideProgress = GuideProgress.PaintModel
        let sellectUI = this.gameMgr.gameUIMgr.sellectUI
        sellectUI.node.getChildByName("ProgressBar").active = true
        sellectUI.gif.active = true
        sellectUI.paintButton.active = true
        this.showTopLabel("请滑动黑色部分对模型进行涂色")
        this.fingerPaintModelAnim()
        this.eventsBlock.enabled = false
        this.scheduleOnce(() => {
            this.showTopLabel("请填涂所有颜色")
            this.scheduleOnce(() => {
                this.hideTopLabel()
                this.node.active = false
            }, 3)
        }, 4)
    }

    skillPromory() {
        this.guideProgress = GuideProgress.skillPromoty
        this.showMiddleLabel("可以使用放大镜功能，找到隐藏在角落的格子")
        let paintUI = this.gameMgr.gameUIMgr.paintUI
        paintUI.promotyNode.active = true
        this.guideCircle.setWorldPosition(paintUI.promotyNode.getWorldPosition())
        this.guideCircle.getComponent(UITransformComponent).setContentSize(paintUI.skillStar.getContentSize())
        this.guideCircle.active = true
        this.playCircleAnim(2.5)
        this.node.active = true
        this.eventsBlock.enabled = true
        var callBack = function () {
            this.hideMidelLabel()
            this.showTopLabel("闪烁的就是放大镜提示的方块，可以填涂它！")
            this.stopCircleAnim()
            this.guideCircle.active = false
            this.eventsBlock.enabled = false
            paintUI.onSkillPromoty()
            this.scheduleOnce(() => {
                this.hideTopLabel()
                this.node.active = false
            }, 4)
            // this.scheduleOnce(() => {
            //     this.node.active = false
            //     //this.setProgress(GuideProgress.SkillStar)
            // }, 10)
        }.bind(this)
        this.circleTouchCallbak = callBack
    }

    skillStar() {
        // console.log("设置星星技能")
        this.guideProgress = GuideProgress.SkillStar
        this.hadGuideStar = true
        this.showMiddleLabel("可以使用星星技能，对难以涂掉的进行填涂")
        let paintUI = this.gameMgr.gameUIMgr.paintUI

        this.guideCircle.setWorldPosition(paintUI.skillStar.getWorldPosition())
        this.guideCircle.getComponent(UITransformComponent).setContentSize(paintUI.skillStar.getContentSize())
        this.guideCircle.active = true
        this.playCircleAnim(2.5)
        paintUI.starFill.fillRange = 1
        paintUI.starProgress = 300
        paintUI.skillStar.active = true
        paintUI.playStarAnim()
        this.node.active = true
        this.eventsBlock.enabled = true
        var callBack = function () {
            this.showMiddleLabel("请快速点击屏幕")
            paintUI.onSkillStar()
            this.stopCircleAnim()
            this.guideCircle.active = false
            this.eventsBlock.enabled = false
            this.scheduleOnce(() => {
                this.hideMidelLabel()
                this.node.active = false
                //this.setProgress(GuideProgress.skillPromoty)
            }, 3)
        }.bind(this)
        this.circleTouchCallbak = callBack
    }

    skillBomb() {
        //  console.log("设置炸弹技能")
        this.guideProgress = GuideProgress.SkillStar
        this.showMiddleLabel("可以使用炸弹技能，对模型进行大面积填涂")
        let paintUI = this.gameMgr.gameUIMgr.paintUI
        this.guideCircle.setWorldPosition(paintUI.skillBomb.getWorldPosition())
        this.guideCircle.getComponent(UITransformComponent).setContentSize(paintUI.skillBomb.getContentSize())
        this.guideCircle.active = true
        this.playCircleAnim(2.5)
        paintUI.skillBomb.active = true
        paintUI.playStarAnim()
        this.node.active = true
        this.eventsBlock.enabled = true
        var callBack = function () {
            this.showMiddleLabel("请点击模型放置炸弹，可以放置五个")
            paintUI.onSkillBomb()
            this.stopCircleAnim()
            this.guideCircle.active = false
            this.eventsBlock.enabled = false
            this.scheduleOnce(() => {
                this.hideMidelLabel()
                this.node.active = false
            }, 3)
        }.bind(this)
        this.circleTouchCallbak = callBack
    }

    setNextProgress() {
        // console.log(this.gameMgr)
        if (this.gameMgr.modelMgr.paintingModel.model.modelName == "log" && !this.hadGuideStar) {
            this.hadGuideStar = true
            this.setProgress(GuideProgress.SkillStar)
        }
        else if (this.gameMgr.modelMgr.paintingModel.model.modelName == "log" && !this.hadGuidePrmoty) {
            this.hadGuidePrmoty = true
            this.setProgress(GuideProgress.skillPromoty)
        }


        if (this.gameMgr.modelMgr.paintingModel.model.modelName == "hamster" && !this.hadGuideBomb) {
            this.hadGuideBomb = true
            this.setProgress(GuideProgress.SkillBomb)
        }

    }

    onGuideCircleTouch() {
        // console.log("点击了GuideCircle")
        // console.log(this.circleTouchCallbak)
        if (this.circleTouchCallbak) {
            this.circleTouchCallbak()
        }
    }

    playCircleAnim(scale: number) {
        let circle = this.guideCircle.getChildByName("CircleSprite")
        circle.setScale(scale, scale, scale)
        circle.active = true
        // console.log(circle)
        this.circleTween = tween(circle).repeatForever(tween(circle)
            .to(1, { scale: cc.v3(0, 0, 0) })
            .call(() => {
                circle.setScale(scale, scale, scale)
            })
            .start()
        ).start()
    }

    stopCircleAnim() {
        let circle = this.guideCircle.getChildByName("CircleSprite")
        circle.active = false
        if (this.circleTween) {
            this.circleTween.stop()
        }
        this.circleTween = null
    }

    showMiddleLabel(label: string) {
        this.middleGuideTip.getChildByName("Label").getComponent(LabelComponent).string = label
        this.middleGuideTip.setScale(0, 0, 0)
        this.middleGuideTip.active = true
        tween(this.middleGuideTip)
            .to(0.2, { scale: cc.v3(1.15, 1.15, 1.15) }, { easing: "circOut" })
            .to(0.1, { scale: cc.v3(1, 1, 1) }, { easing: "circOutIn" })
            .start()
    }

    hideMidelLabel() {
        this.middleGuideTip.active = false
    }

    showTopLabel(label: string) {
        this.topGuideTip.getChildByName("Label").getComponent(LabelComponent).string = label
        this.topGuideTip.setScale(0, 0, 0)
        this.topGuideTip.active = true
        let t = tween(this.topGuideTip)
            .to(0.2, { scale: cc.v3(1.15, 1.15, 1.15) }, { easing: "circOut" })
            .to(0.1, { scale: cc.v3(1, 1, 1) }, { easing: "circOutIn" })
            .start()
        this.tweenList.push(t)
    }

    hideTopLabel() {
        this.topGuideTip.active = false
    }

    fingerTouchMoveAnim() {
        this.finger1.setPosition(cc.v3(-100, 0, 0,))
        this.finger2.setPosition(cc.v3(100, 0, 0,))
        this.finger1.active = true
        this.finger2.active = true
        let t1 = tween(this.finger1)
            .to(1, { position: cc.v3(-350, 0, 0) })
            .to(2, { position: cc.v3(150, 0, 0) })
            .to(1, { position: cc.v3(-100, 0, 0) })
            .start()
        let t2 = tween(this.finger2)
            .to(1, { position: cc.v3(-150, 0, 0) })
            .to(2, { position: cc.v3(350, 0, 0) })
            .to(1, { position: cc.v3(100, 0, 0) })
            .delay(1)
            .call(() => {
                this.finger1.active = false
                this.finger2.active = false
            })
            .start()
        this.fingerTween.push(t1, t2)
    }

    fingerMagnifyAnim() {
        this.finger1.setPosition(cc.v3(100, 50, 0,))
        this.finger2.setPosition(cc.v3(-50, -50, 0,))
        this.finger1.active = true
        this.finger2.active = true
        let t1 = tween(this.finger1)
            .to(1.5, { position: cc.v3(300, 250, 0) })
            .to(1.5, { position: cc.v3(100, 50, 0) })
            .start()
        let t2 = tween(this.finger2)
            .to(1.5, { position: cc.v3(-250, -250, 0) })
            .to(1.5, { position: cc.v3(-50, -50, 0) })
            .delay(1)
            .call(() => {
                this.finger1.active = false
                this.finger2.active = false
            })
            .start()
        this.fingerTween.push(t1, t2)
    }

    fingerRotateAnim() {
        this.finger1.setPosition(cc.v3(300, -200, 0,))
        this.finger1.active = true
        let t1 = tween(this.finger1)
            .to(1.5, { position: cc.v3(300, 400, 0) })
            .to(1.5, { position: cc.v3(300, -200, 0,) })
            .to(1.5, { position: cc.v3(300, 400, 0) })
            .delay(0.5)
            .call(() => {
                this.finger1.active = false
            })
            .start()
        this.fingerTween.push(t1)
    }

    onSkipButton() {
        this.hideTopLabel()
        this.hideMidelLabel()
        let sellectUI = this.gameMgr.gameUIMgr.sellectUI
        sellectUI.node.getChildByName("ProgressBar").active = true
        sellectUI.gif.active = true
        sellectUI.paintButton.active = true
        sellectUI.backToMainButton.active = true
        let paintUI = this.gameMgr.gameUIMgr.paintUI
        paintUI.skillStar.active = true
        paintUI.skillBomb.active = true
        paintUI.promotyNode.active = true
        paintUI.progress.node.active = true
        paintUI.backToSellectButton.active = true
        this.stopCircleAnim()
        this.gameMgr.gameMode = this.gameMgr.GameMode.Normal
        GameMgr.getInstance().switchSceneState(new PaintSceneState())
        this.node.destroy()
    }

    fingerPaintModelAnim() {
        this.finger1.setPosition(cc.v3())
    }

    onDestroy() {
        for (let i of this.fingerTween) {
            if (i && this.node) {
                i.stop()
            }
        }
        for (let i of this.tweenList) {
            if (i && this.node) {
                i.stop()
            }
        }
    }

}
