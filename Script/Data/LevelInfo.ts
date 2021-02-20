import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelInfo')
export class LevelInfo{
    levelName:string = null
    spritePath:string = null
    modelPath:string = null
    cameraDis:number = 0
    ModelPointRotate:number[] = []
    star:number = 0
    cnName:string = null
    specialBg:string = null
    totalEnergy:number = 0
    effectPath:string = ""
    effectParent:string = ""
}
