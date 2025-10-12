import { NestjsKurrentService } from '@biocomputingup/nestjs-kurrent';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { type DBClient, InjectDBClient } from 'src/database';
import { UserConsent } from '../user-consent.aggregate';
import { concatMap, from, Observable, Subject, takeUntil, tap } from 'rxjs';
import {
  BinaryEventType,
  JSONEventType,
  ResolvedEvent,
  START,
} from '@kurrent/kurrentdb-client';
import { HandlerManagerService } from './event-handler-manager.service';
import { permissions, userConsents } from 'src/database/schema/schema';

@Injectable()
export class SubscriptionService implements OnModuleDestroy, OnModuleInit {
  obs$: Observable<void>;
  destroy$ = new Subject<void>();
  logger = new Logger(SubscriptionService.name);
  constructor(
    protected kurrentClient: NestjsKurrentService,
    @InjectDBClient() protected dbClient: DBClient,
    protected handlerManager: HandlerManagerService,
  ) {}
  async onModuleInit() {
    await this.setup();
    this.start();
  }
  onModuleDestroy() {
    this.destroy$.next();
  }

  async cleanupReadModel() {
    await this.dbClient.delete(userConsents).run();
    await this.dbClient.delete(permissions).run();
  }

  async setup() {
    const subscription = this.kurrentClient.client.subscribeToStream(
      '$ce-' + UserConsent.baseStream,
      {
        fromRevision: START,
        resolveLinkTos: true,
      },
    );

    await Promise.resolve();
    // Clear existing data
    await this.cleanupReadModel();

    this.obs$ = from(subscription).pipe(
      tap((event) => {
        this.logger.verbose('Subscription to UserConsent stream established');
        this.logger.verbose(event?.event?.type);
      }),
      concatMap(
        async (event: ResolvedEvent<JSONEventType | BinaryEventType>) => {
          await this.handleEvent(event);
        },
      ),
      takeUntil(this.destroy$),
    );
  }
  async handleEvent(event: ResolvedEvent<JSONEventType>) {
    if (!event?.event) {
      this.logger.warn(
        'Received event is undefined or null, cannot handle event',
      );
      return;
    }

    const eventType = event.event.type;
    const eventMap = this.handlerManager.getEventMapByType(eventType);
    if (!eventMap) {
      this.logger.warn(
        `No event map found for event type ${eventType}. Skipping event.`,
      );
      return;
    }
    const { handlers, streamEvent } = eventMap;
    if (handlers.length === 0) {
      this.logger.warn(
        `No handlers found for event type ${eventType}. Skipping event.`,
      );
      return;
    }
    for (const handler of handlers) {
      try {
        const eventInstance = streamEvent.factory(event.event);
        await handler.handle(eventInstance);
      } catch (err) {
        this.logger.error(
          `Error occurred when handling event (${event?.event?.type}): on Handler ${handler.constructor.name}`,
        );
        throw err;
      }
    }
  }
  start() {
    this.obs$.subscribe();
  }
}
