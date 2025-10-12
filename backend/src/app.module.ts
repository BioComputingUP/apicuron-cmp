import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KurrentModule } from '@biocomputingup/nestjs-kurrent';
import { ConsentManagerModule } from './consent-manager/consent-manager.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KurrentModule.forRoot({
      connectionString: 'kurrentdb://kurrentdb:2113?tls=false',
    }),
    ConsentManagerModule,
    DatabaseModule.forRoot({
      connection: {
        url: 'file:data.sqlite',
        // encryptionKey: 'mysecretkey',
      },
      migrationConfig: { migrationsFolder: 'drizzle' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
