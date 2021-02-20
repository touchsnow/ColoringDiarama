import { _decorator, Component, Node } from 'cc';
import { SignMgr } from '../../../../Game/Managers/SignMgr';
import { IRecored } from './IRecored';
const { ccclass, property } = _decorator;

@ccclass('SignRecored')
export class SignRecored extends IRecored {

    start () {
        this.updateDisplay()
    }

    updateDisplay(){
        this.label.string = SignMgr.getInstance().getAccrueSign().toString()
    }
}
