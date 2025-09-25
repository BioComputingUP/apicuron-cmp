import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KurrentModule } from '@biocomputingup/nestjs-kurrent';

@Module({
  imports: [
    KurrentModule.forRoot({
      connectionString: 'kurrentdb://kurrentdb:2113?tls=false',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
