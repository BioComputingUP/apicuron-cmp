import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { OrcidGrantConsentDto } from './dto/grant-consent.dto';
import { GrantConsentCommand } from './commands/grant-consent.command';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrcidPermissionGrantedEventType } from './events';
import { EventData } from '@kurrent/kurrentdb-client/dist/types/events';
import { type DBClient, InjectDBClient } from 'src/database/';
import {
  UserIdentifierDto,
  UserPermissionsDto,
} from './dto/user-permissions.dto';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { permissions } from 'src/database/schema/schema';

@Controller('consent')
export class ConsentManagerController {
  logger = new Logger(ConsentManagerController.name);
  constructor(
    protected commandBus: CommandBus,
    @InjectDBClient() protected dbClient: DBClient,
  ) {}

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

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'List of users and their granted permissions.',
  })
  async getConsentStatus() {
    const response = { data: [] as UserPermissionsDto[] };
    const data = await this.dbClient.query.userConsents.findMany({
      with: {
        permissions: true,
      },
    });

    for (const userConsent of data) {
      if (!userConsent.user_orcidId) continue;
      console.log(
        `user ${userConsent.user_orcidId} has consented to: ${userConsent.permissions.length} permissions`,
      );
      const entry: UserPermissionsDto = {
        user: { orcid: userConsent.user_orcidId },
        permissions: userConsent.permissions.map((perm) => ({
          identifier: perm.identifier,
          name: perm.name,
          description: perm.description,
        })),
      };
      const userPermissionsDto = plainToInstance(UserPermissionsDto, entry);
      response.data.push(userPermissionsDto);
    }
    return response;
  }

  @Get(':permission_id')
  async getUsersByPermission(@Param('permission_id') permission_id: string) {
    const response = { data: [] as UserIdentifierDto[] };
    const permissionsData = await this.dbClient.query.permissions.findMany({
      where: eq(permissions.identifier, permission_id),
      with: {
        user: true,
      },
    });

    response.data = permissionsData.map((permission) =>
      plainToInstance(UserIdentifierDto, {
        orcid: permission.user.user_orcidId,
      }),
    );

    return response;
  }
}
