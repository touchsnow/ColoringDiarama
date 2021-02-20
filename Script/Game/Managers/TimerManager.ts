import { _decorator, Component, Node, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimerManager')
export class TimerManager extends Component {

    public static getInstance: TimerManager = null;

    onLoad() {
        if (TimerManager.getInstance === null) {
            TimerManager.getInstance = this;
            game.addPersistRootNode(this.node);
        }
        else {
            this.destroy();
            return;
        }
    }

    private currentTime: number = 0

    /**获取游戏时间 */
    getCurrentGameTime() {
        return this.currentTime
    }

    update(dt: number) {
        this.currentTime += dt
    }

}
