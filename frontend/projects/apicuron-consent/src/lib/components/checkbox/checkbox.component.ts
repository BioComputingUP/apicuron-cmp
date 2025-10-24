import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApicuronConsentService } from '../../apicuron-consent.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ac-consent-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsentCheckboxComponent {
  privacyPolicyUrl$: Observable<string>;
  tosUrl$: Observable<string>;
  darkMode$ = new BehaviorSubject<boolean>(false);

  form: FormControl<boolean>;
  constructor(protected config: ConfigService, protected consentService: ApicuronConsentService) {
    this.form = this.consentService.consentGiven$;
    this.privacyPolicyUrl$ = this.config.get('privacyPolicyUrl');
    this.tosUrl$ = this.config.get('tosUrl');
  }
  @Input() set darkMode(value: boolean) {
    this.darkMode$.next(value);
  }

  @Input('value') set consentGiven(value: boolean) {
    this.form.setValue(value);
  }
}
