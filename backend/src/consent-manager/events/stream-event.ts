import { JSONEventType, JSONType } from '@kurrent/kurrentdb-client';
import { EventClassInstance } from '../interfaces/events';
export type StreamEvent<
  EventType extends string = string,
  SerializedEvent extends JSONType = JSONType,
> = {
  type: EventType;
  eventClass: new (...args: any[]) => EventClassInstance<SerializedEvent>;
  factory: (
    input: JSONEventType<EventType, SerializedEvent>,
  ) => EventClassInstance<SerializedEvent>;
};

export function StreamEvent<
  SerializedEvent extends JSONType,
  TypeString extends string,
  EventClass extends new (
    ...args: any[]
  ) => EventClassInstance<SerializedEvent>,
  Factory extends (
    input: JSONEventType<TypeString, SerializedEvent>,
  ) => EventClassInstance<SerializedEvent, string> = (
    input: JSONEventType<TypeString, SerializedEvent>,
  ) => EventClassInstance<SerializedEvent>,
>(
  type: TypeString,
  eventClass: EventClass,
  factory: Factory,
): StreamEvent<TypeString, SerializedEvent> {
  return {
    type,
    eventClass,
    factory,
  };
}
