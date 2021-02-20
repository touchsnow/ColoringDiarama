import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelStorgeInfo')
export class LevelStorgeInfo {

    finished: boolean = false
    swichBg: boolean = false
    finishedAnim: boolean = false
    played: boolean = false
    showSettlePage = false
    paintedModelName: string[] = []
    hadRecieveWelfare:boolean = false

    resetStorge() {
        this.swichBg = false
    }

}
