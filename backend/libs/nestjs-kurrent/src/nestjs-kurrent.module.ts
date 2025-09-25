import { DynamicModule, Module } from '@nestjs/common';
import { NestjsKurrentService as KurrentService } from './nestjs-kurrent.service';
import {
  ConfigurableModuleClass,
  KurrentDBClientProvider,
  NestjsKurrentModuleOptions,
} from './nestjs-kurrent.providers';

@Module({
  providers: [KurrentDBClientProvider, KurrentService],
  exports: [KurrentService],
})
export class KurrentModule extends ConfigurableModuleClass {
  static forRoot(options: NestjsKurrentModuleOptions): DynamicModule {
    return {
      ...super.forRoot(options),
      global: true,
    };
  }
}
