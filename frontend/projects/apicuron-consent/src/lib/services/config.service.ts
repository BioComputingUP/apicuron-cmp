import { Inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { ACONSENT_CONFIG } from '../constants';

export type ConfigInput = {
  apiUrl: string;
  tosUrl: string;
  privacyPolicyUrl: string;
  permission_name: string;
  permission_description: string;
  permission_identifier: string;
  orcidInputPlaceholder?: string;
  searchHint?: string;
  orcidInputLabel?: string;
};

export type ComponentConf = {
  apiUrl: string;
  orcidInputPlaceholder: string;
  tosUrl: string;
  privacyPolicyUrl: string;
  searchHint: string;
  orcidInputLabel: string;
  permission_name: string;
  permission_description: string;
  permission_identifier: string;
};
export type FormType<T extends Record<string, any>> = {
  [K in keyof T]: FormControl<T[K]>;
};
export type Permission = {
  name: string; // Submit ddata to something
  description: string; // You're alowing to do this and that
  identifier: string; // submit_data_to_something
};

@Injectable()
export class ConfigService {
  configurationForm = new FormGroup<FormType<ComponentConf>>({
    apiUrl: new FormControl<string>('', { nonNullable: true }),
    orcidInputPlaceholder: new FormControl<string>(
      'Search by ORCID ID or Name',
      { nonNullable: true }
    ),
    tosUrl: new FormControl<string>('', { nonNullable: true }),
    privacyPolicyUrl: new FormControl<string>('', { nonNullable: true }),
    searchHint: new FormControl<string>(
      'You can link your Account to your ORCID ID to get credited for your contributions.',
      { nonNullable: true }
    ),
    orcidInputLabel: new FormControl<string>('Enter your ORCID ID', {
      nonNullable: true,
    }),
    permission_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(1)],
    }),
    permission_description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(1)],
    }),
    permission_identifier: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.minLength(1)],
    }),
  });

  _config$ = new BehaviorSubject<ComponentConf | null>(null);
  config$ = this._config$
    .asObservable()
    .pipe(filter((conf): conf is ComponentConf => conf !== null));
  private set configValue(value: ComponentConf) {
    this._config$.next(value);
  }
  get configValue(): ComponentConf {
    return this._config$.value as ComponentConf;
  }

  get(key: keyof ComponentConf): Observable<ComponentConf[typeof key]> {
    return this.config$.pipe(
      map((config: ComponentConf) => {
        if (!(key in config)) {
          throw new Error(`Config key ${key} does not exist in configuration`);
        }
        return config[key];
      })
    );
  }

  loadConfiguration(config: ConfigInput): ComponentConf {
    // This ensures to set default values of the configuration form
    // It also merges the input config with the default values
    const defaultValue = this.configurationForm.getRawValue();
    this.configurationForm.setValue({
      ...defaultValue,
      ...(config as ComponentConf),
    });
    if (!this.configurationForm.valid) {
      const errors = Object.entries(this.configurationForm.errors || {})
        .map(([key, value]) => `Error (${key}): ${value}`)
        .join(' ,\n');
      throw new Error(`
                Passed Configuration is invalid, Errors include \n${errors}`);
    }
    const configValue = this.configurationForm.getRawValue();
    this.configValue = configValue;
    return configValue;
  }
}
