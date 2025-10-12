import { Global, Module } from '@nestjs/common';
import {
  ConfigurableModuleClass,
  DatabaseConnectionToken,
  DBClientProvider,
} from './database.providers';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DBClientProvider, DatabaseService],
  exports: [DatabaseConnectionToken],
})
export class DatabaseModule extends ConfigurableModuleClass {}
