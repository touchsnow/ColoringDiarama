import { _decorator, Node, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass
export default class DialogRootNode extends Component {
    @property(Node)
    blockInputNode: Node = null;

    isBlockInputShow(): boolean {
        return this.blockInputNode.active;
    }

    showBlockInput(isShow: boolean): void {
        if (typeof isShow != 'boolean') {
            this.blockInputNode.active = false;
            return;
        }
        this.blockInputNode.active = isShow;
    }

    getBlockInputZOrder(): number {
        return this.blockInputNode.getSiblingIndex();
    }

    setBlockInputZOrder(zOrder): void {
        this.blockInputNode.setSiblingIndex(zOrder);
    }
}
