import { _decorator, Component, Node, Vec2, PhysicsSystem, PhysicsRayResult, geometry, instantiate, loader, find } from 'cc';
import { GuideUI } from '../../View/UI/GuideUI';
import { ISceneState } from '../SceneState/ISceneState';
import { SellectSceneState } from '../SceneState/SellectSceneState';
import { CameraMgr } from './CameraMgr';
import { ConfigManager } from './ConfigManager';
import { EffectMgr } from './EffectMgr';
import { GameUIMgr } from './GameUIMgr';
import { ModelMgr } from './ModelMgr';
import { StorgeMgr } from './StorgeMgr';
const { ccclass, property } = _decorator;

enum GameMode {
    Guide = "guide",
    Normal = "normal"
}

@ccclass('GameMgr')
export class GameMgr extends Component {

    private static Instance: GameMgr = null
    public static getInstance(): GameMgr {
        return GameMgr.Instance
    }
    onLoad() {
        if (GameMgr.Instance === null) {
            GameMgr.Instance = this
        }
        else {
            return
        }
    }

    /**相机射线 */
    public ray: geometry.ray = new geometry.ray()
    /**当前场景状态 */
    public sceneState: ISceneState = null

    @property(CameraMgr)
    cameraMgr: CameraMgr = null

    @property(ModelMgr)
    modelMgr: ModelMgr = null

    @property(GameUIMgr)
    gameUIMgr: GameUIMgr = null

    @property(EffectMgr)
    effectMgr: EffectMgr = null

    totalCost: number = 0

    public gameMode: GameMode = GameMode.Normal

    public GameMode = GameMode

    public hadShowWelfale: boolean = false

    start() {
        let level = ConfigManager.getInstance().currentLevel
        let levelMdoel = instantiate(loader.getRes(level.modelPath)) as Node
        this.cameraMgr.init(level.cameraDis)
        this.modelMgr.init(levelMdoel, level)
        if(level.effectPath!==""){
            let levelModelEffect = instantiate(loader.getRes(level.effectPath)) as Node
            levelModelEffect.setParent(find(level.effectParent))
            this.modelMgr.middleEffect = levelModelEffect
            levelModelEffect.active = false
        }
        this.scheduleOnce(() => {
            this.modelMgr.fatchModelInfo(this.modelMgr.modelPoint)
            this.scheduleOnce(() => {
                this.gameUIMgr.sellectUI.initScrollView()
                this.modelMgr.initModel()
                this.scheduleOnce(() => {
                    find("Canvas/Loading").active = false
                    this.sceneState = new SellectSceneState()
                    this.sceneState.init(this)
                }, 0)
            }, 0)
        }, 0)
        this.effectMgr.init()
        // this.scheduleOnce(() => {
        //     //console.log("需要水晶：" + this.totalCost)
        // }, 4)
    }
    update(dt) {
        if (this.sceneState) {
            this.sceneState.update(dt)
        }
    }

    public screenTouchStart(e) {
        if (this.sceneState) {
            this.sceneState.screenTouchStart(e)
        }
    }
    public screenTouchMove(e) {
        if (this.sceneState) {
            this.sceneState.screenTouchMove(e)
        }
    }
    public screenTouchEnd(e) {
        if (this.sceneState) {
            this.sceneState.screenTouchEnd(e)
        }
    }
    public switchSceneState(state: ISceneState, release: boolean = true) {
        if (this.sceneState && release) {
            this.sceneState.release()
        }
        this.sceneState = state
        this.sceneState.init(this)
    }

    paintAllByOneTouch() {
        this.sceneState.paintAllByOneTouch()
    }

    oneButtonFinishLevel() {
        for (let dic of this.modelMgr.motherModelDic.values()) {
            for (let modelList of dic.values()) {
                for (let model of modelList) {
                    model.setFinish()
                }
            }
        }
        for (let dic of this.modelMgr.modelDic.values()) {
            for (let model of dic.values()) {
                model.setFinish()
            }
        }
        this.scheduleOnce(() => {
            this.switchSceneState(new SellectSceneState())
        }, 0)
    }

    onDestroy() {
        GameMgr.Instance = null
    }

}
