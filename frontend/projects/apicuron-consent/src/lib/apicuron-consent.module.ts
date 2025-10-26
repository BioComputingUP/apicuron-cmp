import { NgModule } from '@angular/core';
import { OrcidInputComponent } from './components/orcid-input/orcid-input.component';
import { ApicuronConsentComponent } from './apicuron-consent.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsentCheckboxComponent } from './components/checkbox/checkbox.component';
import { AConsentProviders } from './apicuron-consent.component';

@NgModule({
  declarations: [
    OrcidInputComponent,
    ConsentCheckboxComponent,
    ApicuronConsentComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [...AConsentProviders],
  exports: [
    ApicuronConsentComponent,
    OrcidInputComponent,
    ConsentCheckboxComponent,
  ],
})
export class ApicuronConsentModule {}
