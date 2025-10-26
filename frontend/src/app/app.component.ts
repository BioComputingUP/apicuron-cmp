import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApicuronConsentModule, ConfigInput } from 'apicuron-consent';
import { BaseExampleComponent } from './examples/base.component';

const ExampleConfig: ConfigInput = {
  apiUrl: 'http://localhost:3000/',
  privacyPolicyUrl:
    'https://raw.githubusercontent.com/intact-portal/intact-portal-documentation/master/assets/IntAct-and-Complex-Portal-websites-privacy-notice.pdf',
  tosUrl: 'https://www.ebi.ac.uk/about/terms-of-use/',
  permission_name: 'Example Permission',
  permission_description: 'This is an example permission description.',
  permission_identifier: 'example_permission_001',
  orcidInputLabel: 'Enter your ORCID ID',
  searchHint:
    'You can link your Account to your ORCID ID to get credited for your contributions.',
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApicuronConsentModule,
    BaseExampleComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'consent-widget';
}
