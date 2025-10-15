import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApicuronConsentModule } from 'apicuron-consent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ApicuronConsentModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'consent-widget';
}
