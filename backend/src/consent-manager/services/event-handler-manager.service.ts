import { Injectable, Logger, OnModuleInit, Type } from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';
import { IEventHandler } from '@nestjs/cqrs/dist/interfaces/events/event-handler.interface';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { EVENTS_HANDLER_METADATA } from '@nestjs/cqrs/dist/decorators/constants';
import { StreamEventsList } from '../events/events';
import { ModulesContainer } from '@nestjs/core';
import { StreamEvent } from '../events/stream-event';

@Injectable()
export class HandlerManagerService implements OnModuleInit {
  explorer: ExplorerService;
  logger = new Logger(HandlerManagerService.name);
  constructor(protected modulesContainer: ModulesContainer) {
    this.explorer = new ExplorerService(modulesContainer);
  }

  eventMap = new Map<
    string,
    {
      streamEvent: StreamEvent;
      handlers: IEventHandler<IEvent>[];
    }
  >();
  onModuleInit() {
    this.loadEventHandlers();
  }

  getStreamEventByClass(eventClass: Type<IEvent>) {
    return StreamEventsList.find((se) => se.eventClass === eventClass);
  }
  getEventMapByType(eventType: string) {
    return this.eventMap.get(eventType);
  }

  getHandlersByEventType(eventType: string): IEventHandler<IEvent>[] {
    const entry = this.eventMap.get(eventType);
    return entry?.handlers ?? [];
  }
  bind(handler: IEventHandler<IEvent>, streamEvent: StreamEvent) {
    const entry = this.eventMap.get(streamEvent.type);
    if (!entry) {
      this.eventMap.set(streamEvent.type, { streamEvent, handlers: [handler] });
    } else {
      entry.handlers.push(handler);
    }
  }
  loadEventHandlers() {
    const { events } = this.explorer.explore();
    const eventHandlers = events;
    if (!eventHandlers) {
      return;
    }
    for (const handlerWrapper of eventHandlers) {
      const typeRef = (
        handlerWrapper.metatype || handlerWrapper.inject
          ? handlerWrapper.instance?.constructor
          : handlerWrapper.metatype
      ) as Type<IEventHandler<IEvent>>;

      const eventTypes: Type<IEvent>[] = Reflect.getMetadata(
        EVENTS_HANDLER_METADATA,
        typeRef,
      ) as Type<IEvent>[]; // Cast the metadata to the expected type
      if (eventTypes === undefined) {
        continue;
      }
      for (const eventType of eventTypes) {
        const streamEvent = this.getStreamEventByClass(eventType);
        if (!streamEvent) {
          continue;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.bind(handlerWrapper.instance, streamEvent);
        console.log(
          `Registering handler ${typeRef.name} for event type ${eventType.name}`,
        );
      }
    }
  }
}
