import SdkTools from "../../tools/SdkTools";

class NativeWX {

    private static instance: NativeWX

    /**
     * WX原生广告ID
     */
    public NativeID: string = "";

    /**
     * WX原生广告对象
     */
    public nativeAd: any = null;

    /**
     * 是否加载到原生1:1图片/ICON
     */
    public isLoadIconNative: boolean = false;

    /**
     * 原生ICON监听关闭刷新
     */
    public iconCloseUpdate: any = null;

    /**
     * 原生ICON广告左上角横坐标
     */
    public iconX: number = 0;

    /**
     * 原生ICON广告左上角纵坐标
     */
    public iconY: number = 0;

    /**
     * 原生ICON广告刷新定时器
     */
    public updateICON: any = null;

    /**
    * NativeWX 单例
    */
    public static getInstance(): NativeWX {
        if (!NativeWX.instance) {
            NativeWX.instance = new NativeWX()
        }
        return NativeWX.instance
    }


    /**
     * 创建WX原生广告
     */
    public createNativeAd(ID) {

        if (!SdkTools.getInstance().isversionNewThanEngineVersion("2.11.1")) {
            console.log("ASCSDK", "WX 平台版本过低,不能创建原生广告");
            return;
        }

        this.NativeID = ID;

        console.log("ASCSDK", "WX 原生广告初始化", ID);

        this.nativeAd = wx.createCustomAd({
            adUnitId: ID,
            adIntervals: 30,
            style: {
                left: this.iconX,
                top: this.iconY,
                fixed: true
            }
        })

        // 监听原生广告加载
        this.nativeAd.onLoad(() => {
            console.log("ASCSDK", "WX 原生ICON加载成功");
            this.isLoadIconNative = true;
        });

        // 监听原生广告错误
        this.nativeAd.onError((err) => {
            console.log("ASCSDK", "WX 原生ICON加载失败:" + JSON.stringify(err));
            this.isLoadIconNative = false;
        });

        // 监听原生广告关闭
        this.nativeAd.onClose(() => {
            console.log("ASCSDK", "WX 手动关闭原生ICON 30s后再次刷新");
            this.iconCloseUpdate =
                setTimeout(() => {
                    this.nativeAd.createNativeAd(ID);
                    setTimeout(() => {
                        this.nativeAd.show();
                    }, 500);
                }, 30 * 1000);
        });
    }

    /**
     * 是否加载到原生1:1图片
     */
    public getIconNativeFlag(): boolean {
        return this.isLoadIconNative;
    }


    /**
     * 展示原生Icon
     */
    public showNativeIcon(x, y) {
        let self = this;

        let windowWidth = Number(wx.getSystemInfoSync().windowWidth);
        let windowHeight = Number(wx.getSystemInfoSync().windowHeight);

        // 存放一开始传入的参数y
        let tempY = y;

        // cocos以左下角为(0,0) 转换为WX的以左上角为(0,0)
        y = cc.winSize.height - y;
        this.iconX = x * (windowWidth / cc.winSize.width);
        this.iconY = y * (windowHeight / cc.winSize.height);

        this.createNativeAd(this.NativeID);

        setTimeout(() => {
            console.log('ASCSDK', 'WX showNativeIcon===============================');
            this.nativeAd.show();
        }, 500);

        this.updateICON =
            setInterval(() => {
                console.log("ASCSDK", "WX 刷新原生ICON广告================");
                // self.nativeAd.offLoad();
                // self.nativeAd.offError();
                self.nativeAd.destroy();
                self.showNativeIcon(x, tempY);
            }, 30 * 1000)

    }


    /**
     * 隐藏原生ICON
     */
    public hideNativeIcon() {
        if (this.iconCloseUpdate) {
            clearTimeout(this.iconCloseUpdate);
            this.iconCloseUpdate = null;
        }
        if (this.updateICON) {
            clearInterval(this.updateICON);
            this.updateICON = null;
        }
        if (this.nativeAd) {
            console.log("ASCSDK", "WX hideNativeIcon===============================');");
            // this.nativeAd.offLoad();
            // this.nativeAd.offError();
            this.nativeAd.destroy();
        } else {
            console.log("ASCSDK", "WX 不存在原生广告实例");
            return;
        }
    }
}

export default NativeWX 