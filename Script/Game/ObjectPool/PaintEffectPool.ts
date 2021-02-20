import { _decorator, Component, Node, Prefab, loader, instantiate, ParticleSystemComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PaintEffectPool')
export class PaintEffectPool extends Component {

    private effectPath: string = "Effect/Touch"
    private objectList: Node[] = []
    init() {
        for (let i = 0; i <= 100; i++) {
            let object = instantiate(loader.getRes(this.effectPath))
            object.setParent(this.node)
            this.objectList.push(object)
        }
    }

    putIn(node: Node) {
        node.children.forEach(element => {
            element.getComponent(ParticleSystemComponent).stop()
        });
        node.active = false
        this.objectList.push(node)
    }

    get(): any {
        let object = this.objectList.pop()
        if (!object) {
            object = instantiate(loader.getRes(this.effectPath))
            object.setParent(this.node)
        }
        object.active = true
        return object
    }
}
