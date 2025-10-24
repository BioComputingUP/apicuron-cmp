import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrcidProfile } from './model/orcid-profile.model';
import { ComponentConf, ConfigService } from './services/config.service';
import { lastValueFrom, map, Observable, take, tap } from 'rxjs';
import { ConsentClientService } from './services/consent-client.service';
import { OrcidService } from './services/orcid.service';

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
  config$: Observable<ComponentConf>;
  constructor(
    protected consentClient: ConsentClientService,
    protected orcidService: OrcidService,
    protected config: ConfigService
  ) {
    this.config$ = this.config.config$;
  }

  
  setValue(value: ConsentValue) {
    this.consentGiven$.setValue(value.consent);
    this.setSelectedProfile(value.orcidId);
  }
  
  /**
   * This is just a utility method to set the selected profile by ORCID ID.
   * it fetches the profile and sets it to the selectedProfile$ FormControl.
   * @param orcidId The ORCID ID of the profile
   */
  async setSelectedProfile(orcidId: string) {
    this.orcidService.getOrcidProfile(orcidId).pipe(
      take(1),
      tap((fetchedProfile: OrcidProfile) =>
        this.selectedProfile$.setValue(fetchedProfile)
      )
    ).subscribe();
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
