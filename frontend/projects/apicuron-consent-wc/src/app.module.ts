import {
  NgModule,
  DoBootstrap,
  ApplicationRef,
  Component,
  ViewEncapsulation,
  Injector,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  ApicuronConsentModule,
  ApicuronConsentComponent,
  AConsentProviders,
  ApicuronConsentService,
} from '../../apicuron-consent/src/public-api';
import { createCustomElement } from '@angular/elements';
import { CommonModule } from '@angular/common';
import { WIDGET_SELECTOR } from './constants';

declare global {
  interface Window {
    AConsentService: ApicuronConsentService;
  }
}

@NgModule({
  imports: [BrowserModule, CommonModule, ApicuronConsentModule],
  // declarations: [WrapperComponent],
  exports: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(appRef: ApplicationRef): void {
    console.log('Defining custom element', WIDGET_SELECTOR);
    customElements.define(
      WIDGET_SELECTOR,
      createCustomElement(ApicuronConsentComponent, {
        injector: appRef.injector,
      })
    );

    const consentService: ApicuronConsentService = appRef.injector.get(
      ApicuronConsentService
    );
    window.AConsentService = consentService;
  }
}
