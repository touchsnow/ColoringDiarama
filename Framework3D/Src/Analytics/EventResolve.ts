export default abstract class EventResolve {
  abstract init(array:any): void;
  abstract onResolve(id: string): string;
}