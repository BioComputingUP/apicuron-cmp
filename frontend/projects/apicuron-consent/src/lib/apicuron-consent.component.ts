import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
  styleUrls: ['../../styles.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
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
    console.log(
      'Apicuron Consent Component initialized',
      this.consentService.consentGiven$.value
    );
  }

  @Input('value') set initialValues(value: ConsentValue | undefined | null) {
    if (!value) {
      return;
    }
    console.log('Setting initial values', value);
    this.consentService.setValue(value);
  }

  @Input('value-orcid') set initialOrcid(value: string | undefined | null) {
    if (!value) {
      return;
    }
    this.consentService.setSelectedProfile(value);
  }

  @Input('value-consent') set initialConsent(
    value: 'true' | 'false' | undefined | null
  ) {
    if (!value || value == null) {
      return;
    }
    console.log('Setting initial consent', value);
    this.consentService.setConsentGiven(value == 'true');
  }

  @Input('disabled') set disabled(value: string | boolean | undefined | null) {
    if(typeof value == 'string' && value == 'true'){
      this.disabled$.next(true);
    }
    if(typeof value == 'boolean'){
      this.disabled$.next(value);
    }
  }
}
