import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrcidProfile } from './model/orcid-profile.model';
import {
  ComponentConf,
  ConfigService,
  Permission,
} from './services/config.service';
import { lastValueFrom, map, Observable, switchMap, take } from 'rxjs';
import { ConsentClientService } from './services/consent-client.service';

type ConsentPayload = {
  orcidId: string;
  permission: {
    name: string;
    description: string;
    identifier: string;
  };
};
@Injectable()
export class ApicuronConsentService {
  consentGiven$ = new FormControl<boolean>(false, { nonNullable: true });
  selectedProfile$ = new FormControl<OrcidProfile | null>(null);
  config$: Observable<ComponentConf>;
  constructor(
    protected consentClient: ConsentClientService,
    protected config: ConfigService
  ) {
    this.config$ = this.config.config$;
  }
  async submitConsent() {
    const consentGiven = this.consentGiven$.value;
    const selectedProfile = this.selectedProfile$.value;

    const obs$ = this.config$.pipe(
      map((conf) => {
        if (!consentGiven || !selectedProfile) {
          return;
        }
        const obs$ = this.consentClient.grantConsent(selectedProfile.orcid_id, {
          name: conf.permission_name,
          description: conf.permission_description,
          identifier: conf.permission_identifier,
        });
        return obs$;
      }),
      take(1)
    );
    return lastValueFrom(obs$);
  }
}
