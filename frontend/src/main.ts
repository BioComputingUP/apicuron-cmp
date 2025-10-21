import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import {
  ApplicationConfig,
  bootstrapApplication,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [RouterModule],
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
