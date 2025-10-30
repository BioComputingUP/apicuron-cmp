import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { InjectDBClient } from 'src/database';
import type { DBClient } from 'src/database';
import { eq } from 'drizzle-orm';
import { permissions, userConsents } from 'src/database/schema/schema';
import { PermissionsJson, permissionsSchema } from '../util/permissions-json';
import { OrcidPermissionGrantedEvent, Permission } from '../events';

@EventsHandler(OrcidPermissionGrantedEvent)
export class OrcidPermissionGrantedHandler
  implements IEventHandler<OrcidPermissionGrantedEvent>
{
  logger = new Logger(OrcidPermissionGrantedHandler.name);
  constructor(@InjectDBClient() protected dbClient: DBClient) {}
  async handle(event: OrcidPermissionGrantedEvent) {
    this.logger.log(
      `Handling OrcidPermissionGrantedEvent event for orcidId: ${event.orcidId}, permission: ${event.permission?.name}, revision: ${event.revision} ${typeof event.timestamp}`,
    );
    const foundUser = await this.dbClient.query.userConsents
      .findFirst({
        where: (fields) => eq(fields.user_orcidId, event.orcidId),
        with: {
          permissions: true,
        },
      })
      .catch((err) => {
        this.logger.error('Error querying userConsents table:', err);
        throw err;
      });

    if (!foundUser) {
      await this.createNewUserConsent(event);
      return;
    }
    if (foundUser.revision >= Number(event.revision)) {
      // Already processed
      this.logger.warn(
        `Event with revision ${event.revision} has already been processed, found stored revision is ${foundUser.revision}`,
      );
      return;
    }
    // Check if the user already has the permission
    this.logger.log(
      `User found with ID ${foundUser.id}, checking permissions...`,
    );
    for (const perm of foundUser.permissions) {
      this.logger.log(
        `User has permission: ${perm.identifier}: ${perm.name} "${perm.description}" `,
      );
    }
    await this.assignPermissionToUser(foundUser.id, event.permission);
  }

  async assignPermissionToUser(userId: number, permission: Permission) {
    await this.dbClient.insert(permissions).values({
      identifier: permission.identifier,
      name: permission.name,
      description: permission.description,
      user_id: userId,
    });
    this.logger.log(
      `Assigned permission ${permission.name} to user with ID ${userId}`,
    );
    return;
  }

  async createNewUserConsent(event: OrcidPermissionGrantedEvent) {
    const newUser: typeof userConsents.$inferInsert = {
      user_orcidId: event.orcidId,
      revision: Number(event.revision),
      last_update: new Date(event.timestamp),
      first_declared: new Date(event.timestamp),
    };

    await this.dbClient.transaction(async (tx) => {
      const userResult = await tx
        .insert(userConsents)
        .values(newUser)
        .returning()
        .catch((err) => {
          this.logger.error('Error inserting into userConsents table:', err);
          throw err;
        });
      const userId = userResult[0].id;

      const permission: typeof permissions.$inferInsert = {
        identifier: event.permission.identifier,
        name: event.permission.name,
        description: event.permission.description,
        user_id: userId,
      };

      await tx.insert(permissions).values(permission);
    });

    this.logger.log('New user consent record created successfully.');
    return;
  }

  parsePermissionsJson(permissionsJson: string): PermissionsJson {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const unclean = JSON.parse(permissionsJson);
    const validPermissions: PermissionsJson = permissionsSchema.parse(unclean);
    return validPermissions;
  }
}
