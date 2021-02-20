import { _decorator, Component, Node, ScrollViewComponent, Prefab, NodePool, WidgetComponent, v2, Vec3 } from 'cc';
const { ccclass, property, menu } = _decorator;

const DIRECTION_POSITIVE = 1;
const DIRECTION_NEGATIVE = -1;

@ccclass('ListViewComponet')
export class ListViewComponet extends ScrollViewComponent {
    @property({
        type: Prefab,
        tooltip: 'item的预制体',
    })
    itemPrefab: Prefab = null;

    @property
    spacing: number = 0;

    @property
    paddingTop: number = 0;

    @property
    paddingBottom: number = 0;

    @property
    paddingLeft: number = 0;

    @property
    paddingRight: number = 0;

    /**
     * @en
     * Enable horizontal scroll.
     *
     * @zh
     * 是否开启水平滚动。
     */
    @property({
        tooltip: '是否开启水平滚动',
        displayOrder: 5,
        override: true
    })
    public horizontal = false;

    /**
     * @en
     * Enable vertical scroll.
     *
     * @zh
     * 是否开启垂直滚动。
     */
    @property({
        tooltip: '是否开启垂直滚动',
        displayOrder: 7,
        override: true
    })
    public vertical = true;
    
    private itemPool: NodePool = new NodePool();

    private itemBinder: any = null;
    private dataSource: any = null;
    private initialOffsetX: number = 0;
    private initialOffsetY: number = 0;
    private dataLength: number = 0;

    private adapter: any = null;

    private recycleThreshold: number = 0;

    private items: Node[] = [];
    private recycleItems: Node[] = [];
    private firstItem: number = 0;
    private lastItem: number = 0;
    private layoutIndex: number = 0;
    private itemWidth: number = 0;
    private itemHeight: number = 0;
    private visibleWidth: number = 0;
    private visibleHeight: number = 0;
    private contentWidth: number = 0;
    private contentHeight: number = 0;
    private inLayout: boolean = false;

    _updateAlignment () {
        let widget = this.getComponent(WidgetComponent);
        if (!!widget && widget.enabled) widget.updateAlignment();
    }

    setup (dataSource:any, itemBinder:Function, initialOffsetX: number = 0, initialOffsetY: number = 0) {
        this.itemBinder = itemBinder;
        this.dataSource = dataSource;
        this.initialOffsetX = initialOffsetX;
        this.initialOffsetY = initialOffsetY;
        this.dataLength = !!dataSource ? dataSource.length : 0;
        this._updateAlignment();
        this._measure();
        this._layout();
        this.scheduleOnce(() => this._moveContent(v2(this.getScrollOffset().x - this.initialOffsetX, this.initialOffsetY - this.getScrollOffset().y), false, false));
    }

    setAdapter (adapter: any) {
        if (!adapter || this.adapter == adapter) return;
        this.adapter = adapter;
        this.itemBinder = adapter.itemBinder;
        this.dataSource = adapter.dataSource;
        this.dataLength = !!this.dataSource ? this.dataSource.length : 0;
        this.initialOffsetX = adapter.initialOffsetX || 0;
        this.initialOffsetY = adapter.initialOffsetY || 0;
        this._updateAlignment();
        this._measure();
        this._layout();
        this.scheduleOnce(() => this._moveContent(v2(this.getScrollOffset().x - this.initialOffsetX, this.initialOffsetY - this.getScrollOffset().y), false, false));
    }

    _moveContent (deltaMove, canStartBounceBack, needRecycle = true) {
        super._moveContent(deltaMove, canStartBounceBack);
        if (!needRecycle) return;
        if (this.horizontal) {
            var deltaX = deltaMove.x;
            while (Math.abs(deltaX) > this.recycleThreshold) {
                if (deltaX < 0) {
                    this._recycle(DIRECTION_POSITIVE);
                    deltaX += this.recycleThreshold;
                } else {
                    this._recycle(DIRECTION_NEGATIVE);
                    deltaX -= this.recycleThreshold;
                }
            }
            if (deltaX < 0) {
                this._recycle(DIRECTION_POSITIVE);
            } else if (deltaX > 0) {
                this._recycle(DIRECTION_NEGATIVE);
            }
        } else {
            var deltaY = deltaMove.y;
            while (Math.abs(deltaY) > this.recycleThreshold) {
                if (deltaY > 0) {
                    this._recycle(DIRECTION_POSITIVE);
                    deltaY -= this.recycleThreshold;
                } else {
                    this._recycle(DIRECTION_NEGATIVE);
                    deltaY += this.recycleThreshold;
                }
            }
            if (deltaY > 0) {
                this._recycle(DIRECTION_POSITIVE);
            } else if (deltaY < 0) {
                this._recycle(DIRECTION_NEGATIVE);
            }
        }
    }

    _getInvisibleHeight (direction) {
        if (!!this.items) {
            var position, scrollOffset, height, width;
            if (direction == DIRECTION_POSITIVE) {
                position = this.items[this.items.length - 1].getPosition();
                scrollOffset = this.getScrollOffset();
                if (this.horizontal) {
                    width = position.x + scrollOffset.x - this.visibleWidth - this.itemWidth / 2;
                    if (width > 0) return width;
                } else {
                    height = position.y + scrollOffset.y + this.visibleHeight + this.itemHeight / 2;
                    if (height < 0) return -height;
                }
            } else if (direction == DIRECTION_NEGATIVE) {
                position = this.items[0].getPosition();
                scrollOffset = this.getScrollOffset();
                if (this.horizontal) {
                    width = position.x + scrollOffset.x + this.itemWidth / 2;
                    if (width < 0) return -width;
                } else {
                    height = position.y + scrollOffset.y - this.itemHeight / 2;
                    if (height > 0) return height;
                }
            }
        }
        return 0;
    }

    _bindItem (child, index) {
        if (!child || index < 0 || index >= this.dataLength) return;
        child.attachIndex = index;
        !!this.itemBinder && this.itemBinder(child, index, this.dataSource[index]);
    }

    _recycle (direction) {
        if (!this.items) return;
        var negativeHeight, positiveHeight, index, child:Node;
        let pos: Vec3 = null;
        if (direction == DIRECTION_POSITIVE) {
            if (this.lastItem >= this.dataLength - 1) return;
            negativeHeight = this._getInvisibleHeight(DIRECTION_NEGATIVE);
            positiveHeight = this._getInvisibleHeight(DIRECTION_POSITIVE);
            if (negativeHeight < positiveHeight) return;
            index = this.lastItem + 1;
            child = this.items[0];
            pos = child.getPosition();
            if (this.horizontal) {
                pos.x = this.paddingLeft + this.itemWidth / 2 + index * this.itemWidth + index * this.spacing;
            } else {
                pos.y = -this.paddingTop - this.itemHeight / 2 - index * this.itemHeight - index * this.spacing;
            }
            child.setPosition(pos);
            if (index >= this.dataLength) {
                child.active && (child.active = false);
            } else {
                this._bindItem(child, index);
            }
            this.items.splice(0, 1);
            this.items.push(child);
            this.firstItem++;
            this.lastItem++;
        } else if (direction == DIRECTION_NEGATIVE) {
            if (this.firstItem <= 0) return;
            negativeHeight = this._getInvisibleHeight(DIRECTION_NEGATIVE);
            positiveHeight = this._getInvisibleHeight(DIRECTION_POSITIVE);
            if (negativeHeight > positiveHeight) return;
            index = this.firstItem - 1;
            child = this.items[this.items.length - 1];
            pos = child.getPosition();
            if (this.horizontal) {
                pos.x = this.paddingLeft + this.itemWidth / 2 + index * this.itemWidth + index * this.spacing;
            } else {
                pos.y = -this.paddingTop - this.itemHeight / 2 - index * this.itemHeight - index * this.spacing;
            }
            child.setPosition(pos);
            !child.active && (child.active = true);
            this._bindItem(child, index);
            this.items.splice(this.items.length - 1, 1);
            this.items.unshift(child);
            this.firstItem--;
            this.lastItem--;
        }
    }

    _measure () {
        if (this.horizontal) {
            this.visibleWidth = this.node.width;
            this.itemWidth = this.itemPrefab.data.width;
            this.contentWidth = this.paddingLeft + this.paddingRight + this.dataLength * this.itemWidth + (this.dataLength - 1) * this.spacing;
            this.content.width = this.contentWidth;
            this.recycleThreshold = this.itemWidth + this.spacing;
            this.initialOffsetX = Math.max(Math.min(this.contentWidth - this.visibleWidth, this.initialOffsetX), 0);
        } else {
            this.visibleHeight = this.node.height;
            this.itemHeight = this.itemPrefab.data.height;
            this.contentHeight = this.paddingTop + this.paddingBottom + this.dataLength * this.itemHeight + (this.dataLength - 1) * this.spacing;
            this.content.height = this.contentHeight;
            this.recycleThreshold = this.itemHeight + this.spacing;
            this.initialOffsetY = Math.max(Math.min(this.contentHeight - this.visibleHeight, this.initialOffsetY), 0);
        }
    }

    _layout () {
        if (!this.content) return;
        if (this.inLayout && !!this.recycleItems) {
            this.recycleItems.forEach(item => this.itemPool.put(item));
        }
        this.inLayout = true;
        this.recycleItems = this.items || [];
        this.items = [];
        var renderCount;
        if (this.horizontal) {
            renderCount = Math.ceil(this.visibleWidth / this.recycleThreshold) + 2;
        } else {
            renderCount = Math.ceil(this.visibleHeight / this.recycleThreshold) + 2;
        }
        if (renderCount > this.dataLength) {
            this.firstItem = 0;
            this.lastItem = this.dataLength - 1;
        } else {
            var skipCount
            if (this.horizontal) {
                var skipWidth = Math.max(0, this.initialOffsetX - this.paddingLeft);
                skipCount = Math.floor(skipWidth / this.recycleThreshold);
            } else {
                var skipHeight = Math.max(0, this.initialOffsetY - this.paddingTop);
                skipCount = Math.floor(skipHeight / this.recycleThreshold);
            }
            var remainCount = this.dataLength - skipCount;
            if (remainCount >= renderCount) {
                this.firstItem = skipCount;
                this.lastItem = this.firstItem + renderCount - 1;
            } else {
                this.firstItem = this.dataLength - renderCount;
                this.lastItem = this.dataLength - 1;
            }
        }
        this.layoutIndex = this.firstItem;
        this._unregisterEvent();
    }

    _layoutItem () {
        if (this.layoutIndex > this.lastItem) {
            this._onLayoutCompleted();
            return;
        }
        var child:Node = this.recycleItems.shift() || this.itemPool.get() || cc.instantiate(this.itemPrefab);
        let pos: Vec3 = child.getPosition();
        if (this.horizontal) {
            pos.x = this.paddingLeft + this.itemWidth / 2 + this.layoutIndex * this.itemWidth + this.layoutIndex * this.spacing;
        } else {
            pos.y = -this.paddingTop - this.itemHeight / 2 - this.layoutIndex * this.itemHeight - this.layoutIndex * this.spacing;
        }
        child.setPosition(pos);
        this._bindItem(child, this.layoutIndex);
        !child.active && (child.active = true);
        !child.parent && this.content.addChild(child);
        this.items.push(child);
        this.layoutIndex++;
    }

    _onLayoutCompleted () {
        this.inLayout = false;
        this.recycleItems.forEach(item => this.itemPool.put(item));
        this._registerEvent();
    }

    update (dt) {
        if (this.inLayout) {
            this._layoutItem();
        } else {
            super.update(dt);
        }
    }

    notifyDataSetChanged () {
        this.dataLength = !!this.dataSource ? this.dataSource.length : 0;
        this._measure();
        this._layout();
    }

    notifyItemChanged (index) {
        if (index < this.firstItem || index > this.lastItem) {
            console.log('ListView notifyItemChanged out of range!');
            return;
        }
        this._bindItem(this.items[index - this.firstItem], index);
    }

}
