import { ValueProvider } from '@angular/core';
import { ConfigInput } from '../services/config.service';
import { ACONSENT_CONFIG } from '../constants';

export function provideAConsentConfig(config: ConfigInput): ValueProvider {
  return {
    provide: ACONSENT_CONFIG,
    useValue: config,
  };
}
