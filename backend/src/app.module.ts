import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KurrentModule } from '@biocomputingup/nestjs-kurrent';
import { ConsentManagerModule } from './consent-manager/consent-manager.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { OrcidModule } from './orcid/orcid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    OrcidModule,
    KurrentModule.forRoot({
      connectionString: 'kurrentdb://kurrentdb:2113?tls=false',
    }),
    ConsentManagerModule,
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: 'file:' + config.getOrThrow<string>('DB_FILE_PATH'),
          // encryptionKey: 'mysecretkey',
        },
        migrationConfig: { migrationsFolder: 'drizzle' },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
