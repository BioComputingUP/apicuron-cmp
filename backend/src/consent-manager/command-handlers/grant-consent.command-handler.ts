import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GrantConsentCommand } from '../commands/grant-consent.command';
import {
  getLastRevision,
  NestjsKurrentService,
} from '@biocomputingup/nestjs-kurrent';
import { EventData, jsonEvent, StreamState } from '@kurrent/kurrentdb-client';
import { UserConsent } from '../user-consent.aggregate';
import {
  OrcidPermissionGrantedEventType,
  OrcidPermissionGrantedType,
} from '../events';

@CommandHandler(GrantConsentCommand)
export class GrantConsentCommandHandler
  implements ICommandHandler<GrantConsentCommand>
{
  logger = new Logger(GrantConsentCommandHandler.name);
  constructor(private readonly eventdb: NestjsKurrentService) {}
  async execute(
    command: GrantConsentCommand,
  ): Promise<EventData<OrcidPermissionGrantedEventType>> {
    this.logger.debug(`received command: ${JSON.stringify(command)}`);
    // Ensuring optimistic concurrency by checking the last event
    // https://docs.kurrent.io/clients/node/v1.0/appending-events.html#handling-concurrency
    const { orcidId, permission, timestamp } = command;
    const revision: StreamState = await getLastRevision(
      this.eventdb.client,
      UserConsent.getStream(orcidId),
    );

    const eventObj: OrcidPermissionGrantedEventType = {
      type: OrcidPermissionGrantedType,
      data: {
        orcidId,
        permission,
        timestamp,
      },
    };
    const event = jsonEvent<OrcidPermissionGrantedEventType>(eventObj);

    const streamId = UserConsent.getStream(orcidId);

    this.logger.debug(
      `Event ${JSON.stringify(event)} created and will be appended to stream ${streamId}`,
    );

    await this.eventdb.client.appendToStream(streamId, event, {
      streamState: revision,
    });

    this.logger.debug(`Event appended to stream ${streamId} successfully`);

    return event;
  }
}
