import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService, Permission } from './config.service';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Injectable } from '@angular/core';

export type UserConsentState = {
  user: {
    orcidId: string;
  };
  permission: Permission;
  hasPermission: boolean;
};

@Injectable()
export class ConsentClientService {
  private apiUrl$: Observable<URL>;
  constructor(protected http: HttpClient, protected config: ConfigService) {
    this.apiUrl$ = this.config.get('apiUrl').pipe(
      map((urlStr) => {
        const href = urlStr.endsWith('/') ? urlStr : urlStr + '/';
        return new URL(href);
      })
    );
  }

  grantConsent(orcidId: string, permission: Permission) {
    return this.apiUrl$.pipe(
      switchMap((apiUrl) =>
        this.http.post(new URL('consent/grant', apiUrl.href).href, {
          orcidId: orcidId,
          permission: {
            name: permission.name,
            description: permission.description,
            identifier: permission.identifier,
          },
        })
      )
    );
  }
  fetchConsentState(orcidId: string): Observable<UserConsentState> {
    return combineLatest([this.config.config$, this.apiUrl$]).pipe(
      map(([config, apiUrl]) => ({
        permission: {
          name: config.permission_name,
          description: config.permission_description,
          identifier: config.permission_identifier,
        },
        apiUrl: apiUrl,
      })),
      switchMap(({ permission, apiUrl }) => {
        const url = new URL(
          `consent/${permission.identifier}/${orcidId}`,
          apiUrl.href
        );
        return this.fetchUserConsentState(orcidId, permission, apiUrl);
      })
    );
  }
  fetchUserConsentState(
    orcidId: string,
    permission: Permission,
    apiUrl: URL
  ): Observable<UserConsentState> {
    const url = new URL(
      `consent/${permission.identifier}/${orcidId}`,
      apiUrl.href
    );
    return this.http.get<UserConsentState>(url.href).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          // The user does not have consent or the permission does not exist
          const emptyConsent: UserConsentState = {
            user: {
              orcidId: orcidId,
            },
            permission: permission,
            hasPermission: false,
          };
          return of(emptyConsent);
        }
        console.error('Error fetching consent state:', error);
        return of(null);
      }),
      map((consentState: UserConsentState | null) => {
        if (!consentState) {
          return {
            user: {
              orcidId: orcidId,
            },
            permission: permission,
            hasPermission: false,
          };
        }
        return consentState;
      })
    );
  }
}
