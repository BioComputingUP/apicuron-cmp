import {
  applyDecorators,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { OrcidGrantConsentDto } from './dto/grant-consent.dto';
import { GrantConsentCommand } from './commands/grant-consent.command';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { OrcidPermissionGrantedEventType } from './events';
import { EventData } from '@kurrent/kurrentdb-client/dist/types/events';
import { type DBClient, InjectDBClient } from 'src/database/';
import {
  PermissionIdDto,
  PermissionUserIdDto,
  UserHasPermissionDto,
  UserIdentifierDto,
  UserPermissionsDto,
} from './dto/user-permissions.dto';
import { plainToInstance } from 'class-transformer';
import { eq } from 'drizzle-orm';
import { permissions, userConsents } from 'src/database/schema/schema';
import { wrapApiResponse } from 'src/util';
import { HttpExceptionBody } from 'src/util/http-exception';

const GetAllConsentsOperation = () =>
  applyDecorators(
    ApiExtraModels(UserPermissionsDto),
    ApiOperation({
      summary: 'Get permissions consented status for all users recorded',
      description:
        'Retrieves a list of all users and the permissions they have consented to.',
      responses: {
        '200': {
          description: 'List of users and the permissions they consented to.',
          content: {
            'application/json': {
              schema: wrapApiResponse(UserPermissionsDto),
            },
          },
        },
      },
    }),
  );

const GetUsersByPermissionOperation = () =>
  applyDecorators(
    ApiExtraModels(UserIdentifierDto),
    ApiResponse({
      status: 200,
      description:
        'List of users that have consented to a specific permission.',
      schema: wrapApiResponse(UserIdentifierDto),
    }),
  );

const GetUserPermissionsOperation = () =>
  applyDecorators(
    ApiExtraModels(UserHasPermissionDto, HttpExceptionBody),
    ApiOperation({
      summary: 'Check if a user has consented to a specific permission',
      description:
        'Retrieves whether a user has consented to a specific permission based on their ORCID ID and the permission identifier.',
      responses: {
        '200': {
          description:
            'User found and their consent status for the specified permission.',
          content: {
            'application/json': {
              schema: {
                $ref: getSchemaPath(UserHasPermissionDto),
              },
            },
          },
        },
        '404': {
          description:
            'User with the given ORCID ID Not Found or no permissions at all found for the user.',
          content: {
            'application/json': {
              schema: {
                $ref: getSchemaPath(HttpExceptionBody),
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      type: NotFoundException,
    }),
  );
@Controller('consent')
@ApiTags('Consent Management')
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
    // tags: ['Consent Management'],
  })
  @Post('grant')
  async grantConsent(@Body() grantConsent: OrcidGrantConsentDto) {
    // Build command to call service

    const command = new GrantConsentCommand(
      grantConsent.orcidId,
      grantConsent.permission,
    );
    this.logger.debug(`Command built: ${JSON.stringify(command)}`);

    try {
      const savedEvent: EventData<OrcidPermissionGrantedEventType> =
        await this.commandBus.execute(command);

      this.logger.debug(
        `Command executed successfully: ${JSON.stringify(command)}`,
      );
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
  @GetAllConsentsOperation()
  async getAllUsersConsents() {
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
  @GetUsersByPermissionOperation()
  async getUsersByPermission(@Param() permissionDto: PermissionIdDto) {
    const { permission_id } = permissionDto;
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

  @Get(':permission_id/:orcid')
  @GetUserPermissionsOperation()
  async getUserPermissionStatus(
    @Param() userDto: PermissionUserIdDto,
  ): Promise<UserHasPermissionDto> {
    const { orcid, permission_id } = userDto;
    const user = await this.dbClient.query.userConsents.findFirst({
      where: eq(userConsents.user_orcidId, orcid),
      with: {
        permissions: {
          where: eq(permissions.identifier, permission_id),
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ORCID ID ${orcid} not found`);
    }
    if (!user.permissions) {
      throw new NotFoundException(
        `No permissions found for user with ORCID ID ${orcid}`,
      );
    }
    const userHasPermission = user.permissions.length > 0;
    const hasPermission = plainToInstance(UserHasPermissionDto, {
      user: {
        orcid: user?.user_orcidId,
      },
      permission: userHasPermission ? user?.permissions[0] : null,
      hasPermission: userHasPermission,
    });
    return hasPermission;
  }
}
