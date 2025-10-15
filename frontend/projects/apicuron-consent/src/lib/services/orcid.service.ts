import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { OrcidProfile } from '../model/orcid-profile.model';

@Injectable()
export class OrcidService {
  constructor(protected http: HttpClient) {}

  private orcid_url = 'https://pub.orcid.org/v3.0/';
  private base_headers = {
    Accept: 'application/json',
  };

  searchOrcidProfile(term: string): Observable<OrcidProfile[]> {
    const searchUrl = `${this.orcid_url}expanded-search`;
    const query = `given-and-family-names:${term} OR credit-name: ${term}`;

    return this.http
      .get(searchUrl, {
        headers: {
          version: '2',
          Accept: 'application/json',
        },
        params: {
          q: query,
          rows: '20',
        },
      })
      .pipe(
        shareReplay(),
        map((response: any) => {
          if (!response['expanded-result']) {
            return [];
          }
          return response['expanded-result'];
        }),
        map((results: any[]): OrcidProfile[] => {
          return results.map((result) =>
            new OrcidProfile().deserialize(result)
          );
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
