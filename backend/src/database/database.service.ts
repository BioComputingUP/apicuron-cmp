import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { DatabaseConnectionToken } from './database.providers';
import * as schema from './schema/schema';
@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @Inject(DatabaseConnectionToken)
    private dbClient: LibSQLDatabase<typeof schema>,
  ) {}
  logger = new Logger(DatabaseService.name);
  onModuleInit() {
    this.logger.log('DatabaseService has been initialized.');
    // await this.dbClient
    //   .insert(schema.permissions)
    //   .values({
    //     orcidId: '0000-0002-1825-0097',
    //     permission_name: 'read',
    //     permission_description: 'Read access to resources',
    //   })
    //   .run();
    // const rows = await this.dbClient.query.consentEvents.findMany();
    // this.logger.log(`Found ${rows.length} permissions in the database.`);
    // rows.forEach((row) => {
    //   this.logger.log(
    //     `Permission from orcidId ${row.user_orcidId}: ${row.permission_name} - ${row.permission_description}`,
    //   );
    // });
  }
}
