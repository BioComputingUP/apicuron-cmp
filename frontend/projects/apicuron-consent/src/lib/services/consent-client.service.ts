import { HttpClient } from '@angular/common/http';
import { ConfigService, Permission } from './config.service';
import { Observable, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';



@Injectable()
export class ConsentClientService {
  protected apiUrl$: Observable<string>;
  constructor(protected http: HttpClient, protected config: ConfigService) {
    this.apiUrl$ = this.config.get('apiUrl');
  }

 

  grantConsent(orcidId: string, permission: Permission) {
    return this.apiUrl$.pipe(
      switchMap((apiUrl) =>
        this.http.post(`${apiUrl}/consent/grant`, {
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
