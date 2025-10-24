import { Component, Input, OnInit } from '@angular/core';
import {
  ComponentConf,
  ConfigInput,
  ConfigService,
} from './services/config.service';
import {
  ApicuronConsentService,
  ConsentValue,
} from './apicuron-consent.service';
import { OrcidService } from './services/orcid.service';
import { ConsentClientService } from './services/consent-client.service';
import { BehaviorSubject, Observable } from 'rxjs';
export const AConsentProviders = [
  ConfigService,
  ConsentClientService,
  ApicuronConsentService,
  OrcidService,
];

@Component({
  selector: 'apicuron-consent',
  templateUrl: `./apicuron-consent.component.html`,
  providers: AConsentProviders,
})
export class ApicuronConsentComponent implements OnInit {
  config$: Observable<ComponentConf>;
  disabled$ = new BehaviorSubject<boolean>(false);
  constructor(
    protected configService: ConfigService,
    protected orcidService: OrcidService,
    public consentService: ApicuronConsentService
  ) {
    this.config$ = this.configService.config$;
  }
  @Input() set config(value: ConfigInput) {
    this.configService.loadConfiguration(value);
  }
  ngOnInit(): void {
    if (this.configService.configValue === null) {
      throw new Error('Configuration is required for ApicuronConsentComponent');
    }
  }

  @Input('value') set initialValues(value: ConsentValue) {
    this.consentService.setValue(value);
  }

  @Input('disabled') set disabled(value: boolean) {
    this.disabled$.next(value);
  }
}
