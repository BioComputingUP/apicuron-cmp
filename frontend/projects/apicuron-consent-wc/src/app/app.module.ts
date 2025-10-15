import { NgModule, DoBootstrap, Injector, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ApicuronConsentModule,
  ApicuronConsentComponent,
} from '../../../apicuron-consent/src/public-api';
import { createCustomElement } from '@angular/elements';

@NgModule({
  imports: [BrowserModule, ApicuronConsentModule],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(appRef: ApplicationRef): void {
    customElements.define(
      'ac-apicuron-consent',
      createCustomElement(ApicuronConsentComponent, { injector: this.injector })
    );
  }
}
