import { _decorator, Component, Node } from 'cc';
import { GameMgr } from '../Managers/GameMgr';
import { ISceneState } from './ISceneState';
import { SellectSceneState } from './SellectSceneState';
const { ccclass, property } = _decorator;

@ccclass('SwitchBGState')
export class SwitchBGState extends ISceneState {

    init(gameMgr:GameMgr){
        super.init(gameMgr)
        var callBack = function(){
            this.gameMgr.switchSceneState(new SellectSceneState())
        }.bind(this)
        
        this.cameraMgr.playSwitchBgAnim(callBack)
        this.gameUIMgr.backGroundUI.playSwitchBgAnim()
    }

    public screenTouchStart(e: Touch) { }

    public screenTouchMove(e: Touch) { }

    public screenTouchEnd(e: Touch) { }

    public release(callBack = null) { }
 
}
