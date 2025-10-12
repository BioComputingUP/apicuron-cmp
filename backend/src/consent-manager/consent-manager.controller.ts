import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { OrcidGrantConsentDto } from './dto/grant-consent.dto';
import { GrantConsentCommand } from './commands/grant-consent.command';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';
import { OrcidPermissionGrantedEventType } from './events';
import { EventData } from '@kurrent/kurrentdb-client/dist/types/events';

@Controller('consent')
export class ConsentManagerController {
  logger = new Logger(ConsentManagerController.name);
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Grant consent for a user and a specific permission',
    description:
      'Grants consent for a user and a specific permission by appending a ConsentGranted event to the consent stream.',
    tags: ['Consent Management'],
  })
  @Post('grant')
  async grantConsent(@Body() grantConsent: OrcidGrantConsentDto) {
    // Build command to call service

    const command = new GrantConsentCommand(
      grantConsent.orcidId,
      grantConsent.permission,
    );

    try {
      const savedEvent: EventData<OrcidPermissionGrantedEventType> =
        await this.commandBus.execute(command);

      return savedEvent.data;
    } catch (error: any) {
      // Handle error
      if (error instanceof Error) {
        this.logger.error(error?.message, error?.stack, error?.name);
        this.logger.debug(error?.stack);
      }
      throw new InternalServerErrorException(
        `An internal Error occured when granting consent`,
      );
    }
  }
}
