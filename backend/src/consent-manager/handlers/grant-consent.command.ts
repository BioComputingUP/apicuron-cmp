import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GrantConsentCommand } from '../commands/grant-consent.command';
import {
  getLastRevision,
  NestjsKurrentService,
} from '@biocomputingup/nestjs-kurrent';
import { jsonEvent, StreamState } from '@kurrent/kurrentdb-client';
import { UserConsent } from '../user-consent.aggregate';
import {
  OrcidPermissionGrantedJSON,
  OrcidPermissionGrantedType,
} from '../consent-event';

@CommandHandler(GrantConsentCommand)
export class GrantConsentCommandHandler
  implements ICommandHandler<GrantConsentCommand>
{
  logger = new Logger(GrantConsentCommandHandler.name);
  constructor(private readonly eventdb: NestjsKurrentService) {}
  async execute(command: GrantConsentCommand): Promise<any> {
    // Ensuring optimistic concurrency by checking the last event
    // https://docs.kurrent.io/clients/node/v1.0/appending-events.html#handling-concurrency
    const { orcidId, permission, timestamp } = command;
    const revision: StreamState = await getLastRevision(
      this.eventdb.client,
      UserConsent.getStream(orcidId),
    );

    const eventObj: OrcidPermissionGrantedJSON = {
      type: OrcidPermissionGrantedType,
      data: {
        orcidId,
        permission,
        timestamp,
      },
    };
    const event = jsonEvent(eventObj);

    await this.eventdb.client.appendToStream(
      UserConsent.getStream(orcidId),
      event,
      {
        streamState: revision,
      },
    );
  }
}
