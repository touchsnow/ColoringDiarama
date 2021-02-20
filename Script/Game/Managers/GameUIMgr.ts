import { _decorator, Component, Node } from 'cc';
import { BackGroundUI } from '../../View/UI/BackGroundUI';
import { PaintUI } from '../../View/UI/PaintUI';
import { SellectUI } from '../../View/UI/SellectUI';
const { ccclass, property } = _decorator;

@ccclass('GameUIMgr')
export class GameUIMgr extends Component {

    @property(PaintUI)
    paintUI: PaintUI = null

    @property(SellectUI)
    sellectUI: SellectUI = null

    @property(BackGroundUI)
    backGroundUI: BackGroundUI = null

}
