export class EventMapper {
  eventMap = new Map<string, () => unknown>();
  registerEvents<AppEvent>(cls: () => AppEvent, eventName: string) {
    this.eventMap.set(eventName, cls);
  }

  getEventClass(eventName: string): (() => unknown) | undefined {
    const eventClass = this.eventMap.get(eventName);
    if (!eventClass) {
      throw new Error(`Event class not found for event name: ${eventName}`);
    }
    return eventClass;
  }
}
