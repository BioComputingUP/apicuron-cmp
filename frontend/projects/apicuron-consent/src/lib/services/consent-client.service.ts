import { HttpClient } from '@angular/common/http';
import { ConfigService, Permission } from './config.service';
import { map, Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

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
}
