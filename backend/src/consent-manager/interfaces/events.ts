import {
  EventTypeToRecordedEvent,
  JSONEventType,
  JSONType,
} from '@kurrent/kurrentdb-client';

export interface EventClassInstance<
  RawEvent extends JSONType = JSONType,
  EventName extends string = string,
> {
  type: EventName;
  event$: EventTypeToRecordedEvent<JSONEventType<EventName, RawEvent>>;
}
