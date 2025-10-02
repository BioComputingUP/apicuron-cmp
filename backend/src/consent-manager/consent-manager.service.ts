import { NestjsKurrentService } from '@biocomputingup/nestjs-kurrent';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsentManagerService implements OnModuleInit {
  constructor(
    protected eventdb: NestjsKurrentService,
    protected config: ConfigService,
  ) {}
  onModuleInit() {
    // const val = this.config.get<string>('test_env');
    // this.logger.log(`The test_env value is: ${val}`);
  }

  logger = new Logger(ConsentManagerService.name);
}
