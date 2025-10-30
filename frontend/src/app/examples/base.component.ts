import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ApicuronConsentModule,
  ApicuronConsentService,
  ConfigInput,
} from 'apicuron-consent';
import { filter, map, ReplaySubject } from 'rxjs';

const ExampleConfig: ConfigInput = {
  apiUrl: 'http://localhost:3000/',
  privacyPolicyUrl:
    'https://raw.githubusercontent.com/intact-portal/intact-portal-documentation/master/assets/IntAct-and-Complex-Portal-websites-privacy-notice.pdf',
  tosUrl: 'https://www.ebi.ac.uk/about/terms-of-use/',
  orcidInputLabel: 'Enter your ORCID ID',
  searchHint:
    'You can link your Account to your ORCID ID to get credited for your contributions.',
  permission_name: 'Example Permission',
  permission_description: 'This is an example permission description.',
  permission_identifier: 'example_permission_001',
};
@Component({
  standalone: true,
  imports: [
    ApicuronConsentModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  styles: [``],
  selector: 'app-example-base',
  template: ` <div class="card bg-base-100 shadow-xl dark:bg-base-300">
    <div class="card-body">
      <div class="flex flex-row items-center justify-between mb-4">
        <h2 class="card-title text-base-content dark:text-base-content">
          <i class="fas fa-cube text-primary dark:text-primary-content"></i>
          Orcid Input Component
        </h2>
        <div class="badge badge-primary dark:badge-outline">
          Search & Select
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4 mb-4">
        <label for="id-base-test-disabled">
          Disable input
          <input
            type="checkbox"
            name="base-test-disabled"
            id="id-base-test-disabled"
            [(ngModel)]="isDisabled"
          />
        </label>

        <form class="flex flex-row gap-2">
          <label for="input-orcid-id">Default ORCID ID</label>
          <input
            type="text"
            name="orcid-id"
            id="input-orcid-id"
            #orcidIdInput
          />
          <input
            type="submit"
            value="Update"
            class="btn btn-xs btn-accent dark:btn-outline"
            (click)="setOrcidId(orcidIdInput.value)"
          />
        </form>

        <form class="flex flex-row gap-2">
          <label for="input-orcid-id">Submit consent to server</label>
          <button
            class="btn btn-xs bg-primary text-white dark:bg-primary dark:text-base-content opacity-100 disabled:opacity-60 disabled:cursor-not-allowed border border-primary dark:border-primary"
            (click)="submitConsent()"
            [disabled]="submitting"
          >
            Submit Consent
          </button>
        </form>
        <!-- <button class="btn btn-xs btn-accent dark:btn-outline">
          Send Data
        </button> -->
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
        <apicuron-consent
          [config]="exampleConfig"
          [disabled]="isDisabled"
          [value]="consentValue$ | async"
        ></apicuron-consent>
      </div>
    </div>
  </div>`,
})
export class BaseExampleComponent implements AfterViewInit {
  constructor(protected consentService: ApicuronConsentService) {}
  submitting: boolean = false;
  async submitConsent() {
    this.submitting = true;
    await this.consentService.submitConsent();
    this.submitting = false;
  }
  exampleConfig = ExampleConfig;
  isDisabled: boolean = false;
  orcidId$ = new ReplaySubject<string>(1);
  setOrcidId(value: string) {
    this.orcidId$.next(value);
  }

  consentValue$ = this.orcidId$.pipe(
    map((orcidId) => ({
      orcidId,
      consent: true,
    }))
  );

  ngAfterViewInit(): void {}
}
