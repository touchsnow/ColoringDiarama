import SdkTools, { Game_Platform } from "../../tools/SdkTools"

class BlockWX {
    private static instance: BlockWX

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
    public type: string = "white";

    /**
     * 积木广告左上角横坐标
     */
    public blockX: number = 0;

    /**
     * 积木广告左上角纵坐标
     */
    public blockY: number = 0;

    /**
     * 积木广告数量
     */
    public blockSize: number = 5;

    /**
     * 积木广告刷新定时器
     */
    public updateBlock: any = null;

    /**
    * BlockWX 单例
    */
    public static getInstance(): BlockWX {
        if (!BlockWX.instance) {
            BlockWX.instance = new BlockWX()
        }
        return BlockWX.instance
    }


    /**
     * 创建积木广告
     */
    public createBlock(ID) {

        if (!SdkTools.getInstance().isversionNewThanEngineVersion("2.9.2")) {
            console.log("ASCSDK", "WX 平台版本过低,不能创建积木广告");
            console.log("ASCSDK", "当前版本：" + wx.getSystemInfoSync().SDKVersion);
            return;
        }

        this.ID_BlockID = ID;

        console.log('ASCSDK', 'WX 格子(积木)广告初始化', ID);

        let self = this;

        this.blockAd = wx.createGridAd({
            adUnitId: ID,
            adTheme: self.type,
            gridCount: self.blockSize,
            style: {
                left: self.blockX,
                top: self.blockY,
                width: 330,
                opacity: 0.8
            },
        });

        // 监听积木广告加载
        this.blockAd.onLoad(function () {
            console.log("ASCSDK", "WX 格子(积木)广告加载成功");
            self.isLoadBlock = true;
        })

        // 监听积木广告错误
        this.blockAd.onError(function (err) {
            console.log("ASCSDK", "WX 格子(积木)广告加载失败:" + JSON.stringify(err));
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

        let windowWidth = Number(wx.getSystemInfoSync().windowWidth);
        let windowHeight = Number(wx.getSystemInfoSync().windowHeight);

        // 存放一开始传入的参数y
        let tempY = y;

        // cocos以左下角为(0,0) 转换为WX的以左上角为(0,0)
        y = cc.winSize.height - y;
        this.blockX = x * (windowWidth / cc.winSize.width)
        this.blockY = y * (windowHeight / cc.winSize.height)
        this.type = type;
        this.blockSize = blockSize;

        this.createBlock(this.ID_BlockID);

        setTimeout(() => {
            console.log('ASCSDK', 'WX showBlock===============================');
            this.blockAd.show();
        }, 500);

        this.updateBlock =
            setInterval(() => {
                console.log("ASCSDK", "WX 刷新积木广告================");
                self.blockAd.offLoad();
                self.blockAd.offError();
                self.blockAd.destroy();
                self.showBlock(self.type, x, tempY, self.blockSize);
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
            console.log("ASCSDK", "WX hideBlock==========================");
            this.blockAd.destroy();
        } else {
            console.log("ASCSDK", "WX 不存在积木广告");
            return;
        }
    }

}
export default BlockWX