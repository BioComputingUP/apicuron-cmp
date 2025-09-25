import { KurrentDBClient } from '@kurrent/kurrentdb-client';
import { ConfigurableModuleBuilder, FactoryProvider } from '@nestjs/common';

export type NestjsKurrentModuleOptions = {
  connectionString: string;
};
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<NestjsKurrentModuleOptions>()
    .setClassMethodName('forRoot')
    .setFactoryMethodName('forRootAsync')
    .build();

export const KurrentDBClientToken = Symbol('KurrentDBClientToken');
export const KurrentDBClientProvider: FactoryProvider<KurrentDBClient> = {
  provide: KurrentDBClientToken,
  inject: [MODULE_OPTIONS_TOKEN],
  useFactory: (options: NestjsKurrentModuleOptions) => {
    return KurrentDBClient.connectionString(options.connectionString);
  },
};
