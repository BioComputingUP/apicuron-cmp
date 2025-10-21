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
  AConsentProviders
} from '../../apicuron-consent/src/public-api';
import { createCustomElement } from '@angular/elements';
import { CommonModule } from '@angular/common';
import { WIDGET_SELECTOR } from './constants';

// This is a wrapper component
// It just sets encapsulation:ShadowDom & binds prebuilt styles to the component
// This allows for the web component to have its own styles isolated from the host page
@Component({
  templateUrl: '../../apicuron-consent/src/lib/apicuron-consent.component.html',
  styleUrls: ['../../apicuron-consent/styles.css'],
  providers: [...AConsentProviders],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WrapperComponent extends ApicuronConsentComponent {}

@NgModule({
  imports: [BrowserModule, CommonModule, ApicuronConsentModule],
  declarations: [WrapperComponent],
  exports: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(appRef: ApplicationRef): void {
    customElements.define(
      WIDGET_SELECTOR,
      createCustomElement(WrapperComponent, { injector: this.injector })
    );
  }
}
