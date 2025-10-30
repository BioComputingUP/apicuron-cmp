import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrcidProfile } from './model/orcid-profile.model';
import { ComponentConf, ConfigService } from './services/config.service';
import {
  combineLatest,
  EMPTY,
  lastValueFrom,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  ConsentClientService,
  UserConsentState,
} from './services/consent-client.service';
import { OrcidService } from './services/orcid.service';
import { isValidOrcid } from './util/orcid-checksum';

type ConsentPayload = {
  orcidId: string;
  permission: {
    name: string;
    description: string;
    identifier: string;
  };
};

export type ConsentValue = {
  orcidId: string;
  consent: boolean;
};
@Injectable()
export class ApicuronConsentService {
  consentGiven$ = new FormControl<boolean>(false, { nonNullable: true });
  selectedProfile$ = new FormControl<OrcidProfile | null>(null);
  private config$: Observable<ComponentConf>;
  constructor(
    protected consentClient: ConsentClientService,
    protected orcidService: OrcidService,
    protected config: ConfigService
  ) {
    this.config$ = this.config.config$;
  }

  setValue(value: ConsentValue) {
    this.setConsentGiven(value.consent);
    this.setSelectedProfile(value.orcidId);
  }

  setConsentGiven(value: boolean) {
    console.log('Setting consent given to:', value);
    this.consentGiven$.setValue(value);
  }

  /**
   * This is just a utility method to set the selected profile by ORCID ID.
   * it fetches the profile and sets it to the selectedProfile$ FormControl.
   * @param orcidId The ORCID ID of the profile
   */
  async setSelectedProfile(orcidId: string) {
    if (!orcidId || !isValidOrcid(orcidId)) {
      this.selectedProfile$.setValue(null);
      console.error('null-ish or Invalid ORCID ID provided:', orcidId);
      return;
    }
    const fetchUser$ = this.orcidService.getOrcidProfile(orcidId);
    const fetchPermission$ = this.consentClient.fetchConsentState(orcidId);

    combineLatest([fetchUser$, fetchPermission$])
      .pipe(
        take(1),
        tap(
          ([fetchedProfile, consentState]: [
            OrcidProfile,
            UserConsentState
          ]) => {
            this.selectedProfile$.setValue(fetchedProfile);
            this.setConsentGiven(consentState.hasPermission);
          }
        )
      )
      .subscribe();
  }

  async submitConsent() {
    if (!this.consentGiven$.valid || !this.selectedProfile$.valid) {
      return;
    }
    const consentGiven = this.consentGiven$.value;
    const selectedProfile = this.selectedProfile$.value;

    const obs$ = this.config$.pipe(
      switchMap((conf) => {
        if (!consentGiven || !selectedProfile) {
          return of(null);
        }
        const reqObs$ = this.consentClient.grantConsent(
          selectedProfile.orcid_id,
          {
            name: conf.permission_name,
            description: conf.permission_description,
            identifier: conf.permission_identifier,
          }
        );
        return reqObs$;
      }),
      take(1)
    );
    return lastValueFrom(obs$);
  }
}
