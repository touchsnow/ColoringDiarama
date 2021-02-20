import SdkTools from "../../tools/SdkTools";
import IntersController from "./IntersController";

class IntersVivo {
    private static instance: IntersVivo

    /**
     * 插屏是否在展示中
     */
    public SW_OnIntersShow = false;

    /**
     * 插屏广告对象
     */
    public systemIntersAd = null;

    /**
     * 是否加载到了插屏广告
     */
    private isLoadSystemInter = false;

    /**
     * 系统插屏加载失败次数
     */
    private sysLoadErrNum = 0;


    /**
     * IntersVivo 单例
     */
    public static getInstance(): IntersVivo {
        if (!IntersVivo.instance) {
            IntersVivo.instance = new IntersVivo()
        }
        return IntersVivo.instance
    }

    /**
     * 创建VIVO系统插屏
     */
    public createSystemInters(INTER_ID) {

        console.log('ASCSDK', 'VIVO 系统插屏广告初始化', INTER_ID)
        let id = INTER_ID;

        this.systemIntersAd = qg.createInterstitialAd({
            posId: INTER_ID
        })

        //监听插屏加载完成
        this.systemIntersAd.onLoad(() => {
            console.log('ASCSDK', 'VIVO 系统插屏广告加载完成')
            this.isLoadSystemInter = true;
        })

        //监听插屏广告错误
        this.systemIntersAd.onError(err => {
            console.log('ASCSDK', 'VIVO 系统插屏加载失败：' + JSON.stringify(err))
            this.isLoadSystemInter = false;
            if (err.errCode != 1008) {
                this.sysLoadErrNum++;
                console.log("ASCSDK", "VIVO 系统插屏加载错误次数:" + this.sysLoadErrNum);
                if (this.sysLoadErrNum < 5) {
                    setTimeout(() => {
                        this.createSystemInters(id);
                    }, 10 * 1000);
                }
            }
        })

        //监听插屏广告关闭
        this.systemIntersAd.onClose(() => {
            console.log('ASCSDK', 'VIVO 系统插屏广告关闭');
            IntersController.getInstance().intersNowTime = 0;
            this.isLoadSystemInter = false;
            // 系统插屏关闭后10s后再次load
            setTimeout(() => {
                this.createSystemInters(id);
            }, 10 * 1000);
        })

    }
    /**
     * 获取插屏是否可以展示
     */
    public getSystemIntersFlag() {
        return this.isLoadSystemInter;
    }
    /**
     * 展示系统插屏
    */
    public showSystemInters() {
        if (this.systemIntersAd) {
            console.log("ASCSDK", "VIVO showSystemInters==================");
            this.systemIntersAd.show().then(() => {
                console.log("ASCSDK", "VIVO 系统插屏广告展示成功==================");
            }).catch((err) => {
                console.log("ASCSDK", "VIVO 系统插屏展示错误:" + JSON.stringify(err));
                IntersController.getInstance().intersNowTime = 0;
            })
        } else {
            console.log("ASCSDK", "VIVO 未创建系统插屏广告");
            return;
        }
    }
}

export default IntersVivo 