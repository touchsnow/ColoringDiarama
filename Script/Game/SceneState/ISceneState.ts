import { _decorator, Component, Node, Vec2, CCObject } from 'cc';
import { CameraMgr } from '../Managers/CameraMgr';
import { EffectMgr } from '../Managers/EffectMgr';
import { GameMgr } from '../Managers/GameMgr';
import { GameUIMgr } from '../Managers/GameUIMgr';
import { ModelMgr } from '../Managers/ModelMgr';
const { ccclass, property } = _decorator;

@ccclass('ISceneState')
export class ISceneState extends Component {
    public init(gameMgr: GameMgr) {
        this.gameMgr = gameMgr
        this.cameraMgr = gameMgr.cameraMgr
        this.modelMgr = gameMgr.modelMgr
        this.gameUIMgr = gameMgr.gameUIMgr
        this.effectMgr = gameMgr.effectMgr
    }
    protected gameMgr: GameMgr = null
    protected cameraMgr: CameraMgr = null
    protected modelMgr: ModelMgr = null
    protected gameUIMgr: GameUIMgr = null
    protected effectMgr: EffectMgr = null
    public screenTouchStart(e: Touch) { }
    public screenTouchMove(e: Touch) { }
    public screenTouchEnd(e: Touch) { }
    public release(callBack = null) { }
    public update(dt) { }
}
