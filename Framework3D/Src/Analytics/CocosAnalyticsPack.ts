/**
 * cocos 统计sdk的封装
 * 操作文档: https://n-analytics.cocos.com/docs/quick_start.html
 * 
 * 2020-4-11 by zhibin
 */

import AnalyticsParent from "./AnalyticsParent";
import { EAnalyticsEvent, EAnalyticsEventType } from "./AnalyticsManager";
import './cocosAnalytics.min.js';

interface IAnalyticsParam{
    channel: string,
    userId: string,
    appID: string ,
    appSecret: string,
    version: string,
    storeID: string,
    engine: string,
    callNumber: string,
}

export default class CocosAnalyticsPack extends AnalyticsParent{
    private initParams: IAnalyticsParam = null;
    private initSuccess: boolean = false;

    constructor(){
        super();
        let type = typeof cocosAnalytics;
        this.initSuccess = type != "undefined";
    }

    init(param: IAnalyticsParam){
        this.initParams = param;
        cocosAnalytics.init({
            appID: param.appID,
            appSecret: '',
            channel: param.channel,
            version: '1.0.0',
            storeID: param.channel,
            engine: 'cocos',
            callNumber: '',
        });
    }

    login(event: EAnalyticsEvent , param: any){
        if(!this.initSuccess) return;
        if(event == EAnalyticsEvent.Start){
            cocosAnalytics.CAAccount.loginStart({
                channel: this.initParams.channel
            });
        }
        else if(event == EAnalyticsEvent.Success){
            cocosAnalytics.CAAccount.loginSuccess({
                userID: this.initParams.userId,
                //userID: 'dddddddd',
                age: 1,
                sex: 0,
                channel: this.initParams.channel
            });            
        }
        else if (event == EAnalyticsEvent.Fail) {
            cocosAnalytics.CAAccount.loginFailed({
                channel: this.initParams.channel,
                reason: '登录失败' // 失败原因
            })
        }
        else if(event == EAnalyticsEvent.Cancel){
            cocosAnalytics.CAAccount.logout();
        }
    }

    enableDebug(debug: boolean){
        if(!this.initSuccess) return;
        cocosAnalytics.enableDebug(debug);
    }

    raiseEvent(eventType: EAnalyticsEventType , event: EAnalyticsEvent , id: string , param: any){
        if(!this.initSuccess) return;
        if(eventType == EAnalyticsEventType.Custom){
            this._raiseCustomEvent(event , id , param);
        }
        else if(eventType == EAnalyticsEventType.Level){
            this._raiseLevelEvent(event , id , param)
        }
    }

    private _raiseCustomEvent(event: EAnalyticsEvent , id: string ,param: any){
        if(event == EAnalyticsEvent.Start){
            cocosAnalytics.CACustomEvent.onStarted(id , param);
        }
        else if(event == EAnalyticsEvent.Success){
            cocosAnalytics.CACustomEvent.onSuccess(id , param);
        }
        else if(event == EAnalyticsEvent.Fail){
            cocosAnalytics.CACustomEvent.onFailed(id , param , param.failresult);
        }
        else if(event == EAnalyticsEvent.Cancel){
            cocosAnalytics.CACustomEvent.onCancelled(id , param);
        }
    }

    private _raiseLevelEvent(event: EAnalyticsEvent , id: string ,param: any){
        if(event == EAnalyticsEvent.Start){
            cocosAnalytics.CALevels.begin({
                level: id
            })
        }
        else if (event == EAnalyticsEvent.Success) {
            cocosAnalytics.CALevels.complete({
                level: id
            })
        }
        else if (event == EAnalyticsEvent.Fail) {
            cocosAnalytics.CALevels.failed({
                level: id,
                reason: param.reason
            })
        }
    }
}