import EventResolve from "./EventResolve";

export default class BaseEventResolve extends EventResolve {
  private events = [
    ['Scene', '场景事件'],
    ['Button', '按钮事件'],
    ['Video', '广告事件'],
    ['Count', '计数事件'],
    ['Level', '战斗事件'],
    ['Level', '关卡事件'],
  ];
  private indexs = {};

  init(array:any): void {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      this.events.push(element);
    }
    for (let i = 0; i < this.events.length; i++) {
      const element = this.events[i];
      this.indexs[element[1]] = i;
    }
  }

  onResolve(id: string): string {
    let index = this.indexs[id];
    if (typeof index !== 'undefined') {
      return this.events[index][0];
    }
    return 'null';
  }
}