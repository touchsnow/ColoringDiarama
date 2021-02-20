import { EAnalyticsEvent, EAnalyticsEventType } from "./AnalyticsManager";
import EventResolve from "./EventResolve";

export default abstract class AnalyticsParent{
    abstract init(param: any, eventResolve:EventResolve);

    abstract login(event: EAnalyticsEvent , param: any);

    abstract raiseEvent(eventType: EAnalyticsEventType ,event: EAnalyticsEvent , id: string, param: any);

    enableDebug(debug: boolean){
        
    }
}