import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));


namespace global {
  interface Window {
    apicuronConsentW: (config: unknown, disabled: boolean) => void;
  }
}