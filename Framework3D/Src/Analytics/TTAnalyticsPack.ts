import AnalyticsParent from "./AnalyticsParent";
import { EAnalyticsEvent, EAnalyticsEventType } from "./AnalyticsManager";
import EventResolve from "./EventResolve";

interface IAnalyticsParam {
  channel: string,
  userId: string,
  appID: string,
  appSecret: string,
  version: string,
  storeID: string,
  engine: string,
  callNumber: string,
}

export default class TTAnalyticsPack extends AnalyticsParent {
  private initParams: IAnalyticsParam = null;
  private initSuccess: boolean = false;
  private eventResolve: EventResolve = null;

  constructor() {
    super();
    let type = typeof tt;
    this.initSuccess = type != "undefined";
  }

  init(param: IAnalyticsParam, eventResolve: EventResolve) {
    this.initParams = param;
    this.eventResolve = eventResolve;
  }

  login(event: EAnalyticsEvent, param: any) {
    if (!this.initSuccess) return;
  }

  enableDebug(debug: boolean) {
    if (!this.initSuccess) return;
  }

  raiseEvent(eventType: EAnalyticsEventType, event: EAnalyticsEvent, id: string, param: any) {
    if (!this.initSuccess) return;
    if (this.eventResolve) {
      // id转换
      id = this.eventResolve.onResolve(id);
    }
    if (eventType == EAnalyticsEventType.Custom) {
      this._raiseCustomEvent(event, id, param);
    }
    else if (eventType == EAnalyticsEventType.Level) {
      this._raiseLevelEvent(event, id, param)
    }
  }

  private _raiseCustomEvent(event: EAnalyticsEvent, id: string, param: any) {
    tt.reportAnalytics(id, param);
  }

  private _raiseLevelEvent(event: EAnalyticsEvent, id: string, param: any) {
    tt.reportAnalytics(id, param);
  }
}