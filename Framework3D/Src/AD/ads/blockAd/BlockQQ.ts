import SdkTools from "../../tools/SdkTools"

class BlockQQ {
    private static instance: BlockQQ

    /**
     * 积木广告ID
     */
    public ID_BlockID = "";

    /**
     * 积木广告对象
     */
    public blockAd: any = null;

    /**
     * 是否加载到积木广告
     */
    public isLoadBlock: boolean = false;

    /**
     * 积木广告展示方向
     */
    public blockOrientation: string = "landscape";

    /**
     * 积木广告左上角横坐标
     */
    public blockX: number = 32;

    /**
     * 积木广告左上角纵坐标
     */
    public blockY: number = 32;

    /**
     * 积木广告数量
     */
    public blockSize: number = 1;

    /**
     * 积木广告刷新定时器
     */
    public updateBlock: any = null;

    /**
    * BlockQQ 单例
    */
    public static getInstance(): BlockQQ {
        if (!BlockQQ.instance) {
            BlockQQ.instance = new BlockQQ()
        }
        return BlockQQ.instance
    }


    /**
     * 创建积木广告
     */
    public createBlock(ID) {

        if (!SdkTools.getInstance().isversionNewThanEngineVersion("1.15.0")) {
            console.log("ASCSDK", "QQ 平台版本过低,不能创建积木广告");
            return;
        }

        this.ID_BlockID = ID;

        console.log('ASCSDK', 'QQ 积木广告初始化', ID);

        let self = this;

        this.blockAd = qq.createBlockAd({
            adUnitId: ID,
            size: self.blockSize,
            orientation: self.blockOrientation,
            style: {
                left: self.blockX,
                top: self.blockY
            },
        });

        // 监听积木广告加载
        this.blockAd.onLoad(function () {
            console.log("ASCSDK", "QQ 积木广告加载成功");
            self.isLoadBlock = true;
        })

        // 监听积木广告错误
        this.blockAd.onError(function (err) {
            console.log("ASCSDK", "QQ 积木广告加载失败:" + JSON.stringify(err));
            if (err.errCode == 1004) {
                console.log("ASCSDK", "QQ 积木广告列表为空");
            }
        })

    }

    /**
     * 获取积木是否可以展示标志
     */
    public getBlockFlag() {
        return this.isLoadBlock;
    }

    /**
     * 展示积木广告
     */
    public showBlock(type: string, x: number, y: number, blockSize: number) {

        if (this.updateBlock) {
            clearInterval(this.updateBlock);
        }

        let self = this;

        let windowWidth = Number(qq.getSystemInfoSync().windowWidth);
        let windowHeight = Number(qq.getSystemInfoSync().windowHeight);

        // 存放一开始传入的参数y
        let tempY = y;

        // 版本为8.3.6则不展示积木广告
        if (qq.getSystemInfoSync().version == "8.3.6") {
            console.log("ASCSDK", "QQ 平台版本过低,不展示积木广告==============");
            return;
        }
        else {
            // cocos以左下角为(0,0) 转换为qq的以左上角为(0,0)
            y = cc.winSize.height - y;
            this.blockX = x * (windowWidth / cc.winSize.width)
            this.blockY = y * (windowHeight / cc.winSize.height)
            this.blockOrientation = type;
            this.blockSize = blockSize;
        }

        this.createBlock(this.ID_BlockID);

        setTimeout(() => {
            console.log('ASCSDK', 'QQ showBlock===============================');
            this.blockAd.show();
        }, 500);

        this.updateBlock =
            setInterval(() => {
                console.log("ASCSDK", "QQ 刷新积木广告================");
                self.blockAd.offLoad();
                self.blockAd.offError();
                self.blockAd.destroy();
                self.showBlock(self.blockOrientation, x, tempY, self.blockSize);
            }, 30 * 1000)
    }

    /**
     * 关闭积木广告
     */
    public hideBlock() {
        if (this.updateBlock) {
            clearInterval(this.updateBlock);
        }
        if (this.blockAd) {
            console.log("ASCSDK", "QQ hideBlock==========================");
            this.blockAd.destroy();
        } else {
            console.log("ASCSDK", "QQ 不存在积木广告");
            return;
        }
    }

}
export default BlockQQ