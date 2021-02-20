import { _decorator, Component, Node } from 'cc';
import NativeController from '../../Framework3D/Src/AD/ads/nativeAd/NativeController';
const { ccclass, property } = _decorator;

@ccclass('StaticModel')
export class StaticModel extends Component {


    @property([Node])
    staticModel = []

    // start () {
    //     // Your initialization goes here.
    // }

    // // update (deltaTime: number) {
    // //     // Your update function goes here.
    // // }
}
