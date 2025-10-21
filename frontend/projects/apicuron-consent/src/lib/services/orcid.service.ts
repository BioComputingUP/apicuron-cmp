import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { OrcidProfile } from '../model/orcid-profile.model';
import { ConfigService } from './config.service';

@Injectable()
export class OrcidService {
  private apiUrl$: Observable<string>;
  constructor(protected http: HttpClient, protected config: ConfigService) {
    this.apiUrl$ = this.config.get('apiUrl');
  }

  orcid_url = 'https://pub.orcid.org/v3.0/';

  private base_headers = {
    Accept: 'application/json',
  };
  searchOrcidProfile(query: string): Observable<OrcidProfile[]> {
    return this.apiUrl$.pipe(
      switchMap((apiUrl) =>
        this.http.get(`${apiUrl}orcid/search`, {
          headers: this.base_headers,
          params: {
            query,
          },
        })
      ),
      shareReplay(1),
      map((response: any) => {
        if (!response['expanded-result']) {
          return [];
        }
        return response['expanded-result'];
      }),
      map((results: any[]): OrcidProfile[] => {
        return results.map((result) => new OrcidProfile().deserialize(result));
      })
    );
  }

  getOrcidProfile(orcid_id: string): Observable<OrcidProfile> {
    return this.http
      .get(`${this.orcid_url}${orcid_id}`, {
        headers: {
          ...this.base_headers,
        },
      })
      .pipe(
        map((response: any) => {
          const name = response?.['person']['name'];
          const [given_names, family_name, credit_name] = [
            name?.['given-names']?.['value'],
            name?.['family-name']?.['value'],
            name?.['credit-name']?.['value'],
          ];

          const profileObj = {
            'orcid-id': orcid_id,
            'given-names': given_names,
            'family-name': family_name,
            'credit-name': credit_name,
          };

          return new OrcidProfile().deserialize(profileObj);
        })
      );
  }

  getOrcidProfiles(orcid_ids: string[]): Observable<OrcidProfile[]> {
    return of(orcid_ids).pipe(
      switchMap((ids: string[]) => {
        const profiles = ids.map((id) => this.getOrcidProfile(id));

        return combineLatest(profiles);
      })
    );
  }
}
