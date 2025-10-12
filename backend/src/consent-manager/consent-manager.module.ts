import { Module } from '@nestjs/common';
import { ConsentManagerService } from './services/consent-manager.service';
import { ConsentManagerController } from './consent-manager.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GrantConsentCommandHandler } from './command-handlers/grant-consent.command-handler';
import { OrcidPermissionGrantedHandler } from './event-handlers';
import { SubscriptionService } from './services/subscription.service';
import { HandlerManagerService } from './services/event-handler-manager.service';

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [ConsentManagerController],
  providers: [
    GrantConsentCommandHandler,
    ConsentManagerService,
    OrcidPermissionGrantedHandler,
    HandlerManagerService,
    SubscriptionService,
  ],
  exports: [],
})
export class ConsentManagerModule {}
