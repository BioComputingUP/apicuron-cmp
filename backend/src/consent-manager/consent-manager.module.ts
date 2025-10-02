import { Module } from '@nestjs/common';
import { ConsentManagerService } from './consent-manager.service';
import { ConsentManagerController } from './consent-manager.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GrantConsentCommandHandler } from './handlers/grant-consent.command';

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [ConsentManagerController],
  providers: [GrantConsentCommandHandler, ConsentManagerService],
  exports: [],
})
export class ConsentManagerModule {}
