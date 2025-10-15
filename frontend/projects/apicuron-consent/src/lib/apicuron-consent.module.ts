import { Component, NgModule } from '@angular/core';
import { ApicuronConsentService } from './apicuron-consent.service';
import { OrcidInputComponent } from './components/orcid-input/orcid-input.component';
import { ApicuronConsentComponent } from './apicuron-consent.component';

@NgModule({
  declarations: [OrcidInputComponent, ApicuronConsentComponent],
  imports: [],
  providers: [ApicuronConsentService],
  exports: [ApicuronConsentComponent],
})
export class ApicuronConsentModule {}
