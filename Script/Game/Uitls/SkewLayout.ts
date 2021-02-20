import { _decorator, Component, Node, CCInteger, ButtonComponent, UITransformComponent, CCBoolean } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('SkewLayout')
export class SkewLayout extends Component {

    @property(CCInteger)
    spacingX: number = 0

    @property(CCInteger)
    spacingY: number = 0
    @property(CCInteger)
    paddingTop: number = 0

    @property(CCInteger)
    itemSize: number = 0

    @property(CCBoolean)
    magnify: boolean = false

    public minPosY: number = 0

    public maxPosY: number = 0

    public contentSize: number = 0

    init() {
        this.itemSize = this.itemSize * Math.sqrt(2)
        this.updateList()
        this.minPosY = this.node.getPosition().y * cc.view.getVisibleSize().height / 1920
        this.maxPosY = (this.node.getPosition().y + 240) * cc.view.getVisibleSize().height / 1920 + this.contentSize - cc.view.getVisibleSize().height//* cc.view.getVisibleSize().height / 1920
        this.node.getComponent(UITransformComponent).height = this.contentSize
        //if (this.magnify) this.paddingTop += this.itemSize
        //this.paddingTop += this.itemSize
    }

    updateList() {
        this.contentSize += this.paddingTop + this.itemSize / 2
        for (let i = 0; i < this.node.children.length; i++) {
            if (i % 3 == 0) {
                let x = 0, y = -(this.itemSize + this.spacingY) * (Math.ceil(i / 3) + 0.5) - this.paddingTop, z = 0
                if (this.magnify) { y -= this.itemSize * 3 / 10 }
                if (i !== 0 && this.magnify) { y -= this.itemSize * 3 / 10 }
                this.node.children[i].setPosition(x, y, z)
                this.contentSize += this.itemSize / 2 + this.spacingY / 2
                if (i == 0 && this.magnify) {
                    this.contentSize += this.itemSize * 3 / 5
                    this.node.children[0].setScale(3 / 2, 3 / 2, 3 / 2)
                }
            }
            if ((i - 1) % 3 == 0) {
                let x = -0.5 * (this.itemSize + this.spacingX), y = -(this.itemSize + this.spacingY) * (Math.ceil(i / 3)) - this.paddingTop, z = 0
                if (this.magnify) { y -= this.itemSize * 3 / 10, y -= this.itemSize * 3 / 10 }

                this.contentSize += this.itemSize / 2 + this.spacingY / 2
                this.node.children[i].setPosition(x, y, z)
            }
            if ((i - 2) % 3 == 0) {
                let x = 0.5 * (this.itemSize + this.spacingX), y = -(this.itemSize + this.spacingY) * (Math.ceil(i / 3)) - this.paddingTop, z = 0
                if (this.magnify) { y -= this.itemSize * 3 / 10, y -= this.itemSize * 3 / 10 }

                this.node.children[i].setPosition(x, y, z)
            }
        }
    }
}
