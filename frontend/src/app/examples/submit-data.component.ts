import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  ApicuronConsentComponent,
  ApicuronConsentModule,
  ApicuronConsentService,
  ConfigInput,
  provideAConsentConfig,
} from 'apicuron-consent';

const ExampleConfig: ConfigInput = {
  apiUrl: 'http://localhost:3000/',
  privacyPolicyUrl:
    'https://raw.githubusercontent.com/intact-portal/intact-portal-documentation/master/assets/IntAct-and-Complex-Portal-websites-privacy-notice.pdf',
  tosUrl: 'https://www.ebi.ac.uk/about/terms-of-use/',
  orcidInputLabel: 'Enter your ORCID ID (Example of Data Submission)',
  searchHint:
    'You can link your Account to your ORCID ID to get credited for your contributions.',
  permission_name: 'Example Permission',
  permission_description: 'This is an example permission description.',
  permission_identifier: 'example_permission_001',
};
@Component({
  standalone: true,
  imports: [ApicuronConsentModule],
  providers: [provideAConsentConfig(ExampleConfig)],
  selector: 'app-submit-data-example',
  template: `
    <div class="card bg-base-100 shadow-xl dark:bg-base-300">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h2 class="card-title text-base-content dark:text-base-content">
            <i class="fas fa-spinner text-accent dark:text-accent-content"></i>
            Submit Data Call
          </h2>
          <div class="badge badge-accent dark:badge-outline">
            Submit Data function call
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            class="btn btn-xs btn-accent dark:btn-outline"
            (click)="testSubmit()"
          >
            Send Data
          </button>
          <!-- <button class="btn btn-xs btn-outline dark:btn-accent">
            Stop Loading
          </button>
          <select
            class="select select-xs dark:bg-base-200 dark:text-base-content"
          >
            <option>Fast</option>
            <option>Normal</option>
            <option>Slow</option>
          </select> -->
        </div>
        <div
          class="bg-base-200 p-8 rounded-lg min-h-32 border-2 border-dashed border-base-300 flex items-center justify-center dark:bg-base-200 dark:border-base-100"
        >
          <apicuron-consent></apicuron-consent>
        </div>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class SubmitDataExampleComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {}

  testSubmit() {
    // if (this.consentService) {
    // }
  }
}
