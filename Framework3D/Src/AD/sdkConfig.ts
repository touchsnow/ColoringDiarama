// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



class sdkConfig {
    private static instance: sdkConfig

    /**
     * sdkConfig单例
     */
    public static getInstance(): sdkConfig {
        if (!sdkConfig.instance) {
            sdkConfig.instance = new sdkConfig()
        }
        return sdkConfig.instance
    }

    // 渠道ID "0"为测试版(安卓和IOS没有测试)  "1234666"为安卓  "1234888"为IOS
    public channelId: string = "0";

    public configUrl: string = '';

}

export default sdkConfig