import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KurrentModule } from '@biocomputingup/nestjs-kurrent';
import { ConsentManagerModule } from './consent-manager/consent-manager.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KurrentModule.forRoot({
      connectionString: 'kurrentdb://kurrentdb:2113?tls=false',
    }),
    ConsentManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
