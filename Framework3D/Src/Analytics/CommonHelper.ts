
/**
 ** 创建人: zhibin
 ** 日  期: 2019.11.19
 ** 版  本: 1.0
 ** 描  述: 静态函数
        通用辅助类：
        通用的静态方法, 不涉及到引擎
*/


export default class CommonHelper {
    
    /** 计算文字长度 */
    public static getWordCount(str: string) {
        let len = 0;
        for (let i = 0; i < str.length; ++i) {
            if (this.isChWord(str.charCodeAt(i))) {
                len += 2;
            } else {
                ++len;
            }
        }
        return len;
    }

    /** 判断某个字符是否是汉字 */
    public static isChWord(charCode: number) {
        if (charCode > 255 || charCode < 0) {
            return true;
        } else {
            return false;
        }
    }

    /** 从[min,max]里随机一个整数 */
    public static getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /** 随机范围 [min , max] */
    public getRandom(min: number, max: number){
        let range = Math.random() * (max - min);
        return min + range;
    }

    //生成一个随机的字符串，字符串内容为小写字母和数字
    public static randomStr(len: number) {
        let str = "";
        for (let i = 0; i < len; i++) {
            let num = CommonHelper.getRandomInt(0, 35)
            if (num <= 9) {
                str += num;
            } else {
                str += String.fromCharCode('a'.charCodeAt(0) + num - 10);
            }
        }
        return str;
    }

    //在数字面前填充0
    //例如传出 12，5返回 00012
    public static fixNumByZero(num: number, cnt: number): string {
        let str = num.toString();
        for (let index = str.length; index < cnt; index++) {
            str = "0" + str;
        }
        return str
    }

    // -- 获得数字的逗号版（如1234567->1,234,567）
    public static getCommaNumString(num: number, sepNum = 3, sep = ",") {
        //cc.log(num.toLocaleString());
        let positive = (num >= 0);
        num = num >= 0 ? num : -num;

        let divisor = 1;
        for (let index = 0; index < sepNum; index++) {
            divisor *= 10;
        }
        let nums = [];

        do {
            nums.push(num % divisor);
            num = Math.floor(num / divisor);
        } while (num > 0);

        let str = positive ? "" : "-";
        for (let i = nums.length - 1; i >= 0; i--) {
            if (i == nums.length - 1) {
                str += nums[i];
            } else {
                str += sep + CommonHelper.fixNumByZero(nums[i], sepNum);
            }

        }

        return str;
    }

    /** 转变成一个带有省略号的字符串 */
    public static convertStrEllipsis(str:string , maxLen: number, ellipsis:string = "..."){
        let len = 0;
        let convertStr = str;
        for (let i = 0; i < str.length; ++i) {
            if(len >= maxLen){
                convertStr = str.slice(0 , len) + ellipsis;
                break;
            }
            if (this.isChWord(str.charCodeAt(i))) {
                len += 2;
            } else {
                ++len;
            }
        }
        return convertStr;
    }

    /**获得时间的h:m:s */
    static getTimeStrByNum(uTime: number, bStr: boolean = false) {
        let h = Math.floor(uTime / 3600);
        let min = Math.floor((uTime - h * 3600) / 60);
        let sec = Math.floor((uTime - h * 3600 - min * 60));
        let timeStr = "";
        timeStr = timeStr + (h < 10 ? '0' + h.toString() : h.toString()) + (bStr ? ' H ' : ":");
        timeStr = timeStr + (min < 10 ? '0' + min.toString() : min.toString()) + (bStr ? ' MIN ' : ":");
        timeStr = timeStr + (sec < 10 ? '0' + sec.toString() : sec.toString()) + (bStr ? ' SEC ' : "");
        return timeStr
    }
}
