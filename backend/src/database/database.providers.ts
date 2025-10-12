import { Client, Config, createClient } from '@libsql/client';
import {
  ConfigurableModuleBuilder,
  FactoryProvider,
  Inject,
  Logger,
} from '@nestjs/common';
// import { DrizzleConfig } from 'drizzle-orm';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema/schema';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { MigrationConfig } from 'drizzle-orm/migrator';

export type DBConfigType = {
  connection: Config;
  migrationConfig: MigrationConfig;
};

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<DBConfigType>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('forRootAsync')
    .build();

export const DatabaseConnectionToken = 'DatabaseConnectionToken';
export const InjectDBClient = () => Inject(DatabaseConnectionToken);

async function connectionFactory(options: DBConfigType) {
  const logger = new Logger('ConnectionProvider');
  try {
    const libsqlClient = createClient(options.connection);
    const client = drizzle(libsqlClient, {
      schema,
    });
    await migrate(client, options.migrationConfig);
    logger.log('DB Client Instantiated and Schema Migrated');
    return client;
  } catch (error) {
    logger.error('Error Instantiating DB Client or Migrating Schema:');
    throw error;
  }
}
export type DBClient = Awaited<ReturnType<typeof connectionFactory>>;

export const DBClientProvider: FactoryProvider<
  LibSQLDatabase<typeof schema> & {
    $client: Client;
  }
> = {
  provide: DatabaseConnectionToken,
  inject: [MODULE_OPTIONS_TOKEN],
  useFactory: connectionFactory,
};
