import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  tap,
} from 'rxjs';
import { OrcidService } from '../../services/orcid.service';
import { LoadingState, switchMapWithLoading } from '../../util/operators';
import { OrcidProfile } from '../../model/orcid-profile.model';
import { isValidOrcid } from '../../util/orcid-checksum';
import { ComponentConf, ConfigService } from '../../services/config.service';
import { ApicuronConsentService } from '../../apicuron-consent.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ac-orcid-input',
  templateUrl: './orcid-input.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrcidInputComponent implements OnInit {
  searchQuery$ = new BehaviorSubject<string>('');
  suggestions$: Observable<LoadingState<OrcidProfile[]>>;
  searchText: string = '';
  searchingMode$ = new BehaviorSubject<'idle' | 'searching' | 'selected'>(
    'idle'
  );
  placeholder$: Observable<string>;
  selectedOrcidProfile: FormControl<OrcidProfile | null>;
  userSelected$: Observable<OrcidProfile | null>;
  config$: Observable<ComponentConf>;

  constructor(
    protected orcidService: OrcidService,
    protected config: ConfigService,
    private el: ElementRef,
    protected consentService: ApicuronConsentService
  ) {
    this.selectedOrcidProfile = this.consentService.selectedProfile$;
    this.userSelected$ = this.selectedOrcidProfile.valueChanges.pipe(
      startWith(this.selectedOrcidProfile.value)
    );
    this.config$ = this.config.config$;
    this.placeholder$ = this.config.get('orcidInputPlaceholder');
    this.suggestions$ = this.setupSuggestionFetch(
      this.searchQuery$.asObservable()
    );
  }

  ngOnInit(): void {}
  onInput(event: Event) {
    const targetElement = event.target;
    if (!targetElement || !(targetElement instanceof HTMLInputElement)) {
      return;
    }
    this.searchQuery$.next(targetElement.value);
  }

  findOrSearch(query: string): Observable<OrcidProfile[]> {
    const isOrcid = isValidOrcid(query);
    if (isOrcid) {
      return this.orcidService
        .getOrcidProfile(query)
        .pipe(map((profile) => (profile ? [profile] : [])));
    }
    return this.orcidService.searchOrcidProfile(query).pipe(delay(1000));
  }

  setupSuggestionFetch(
    source: Observable<string>
  ): Observable<LoadingState<OrcidProfile[]>> {
    return source.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      filter((val, idx) => val.length > 3),
      switchMapWithLoading((query: string) => this.findOrSearch(query)),
      tap((state) => {
        if (this.searchingMode$.getValue() !== 'searching') {
          this.openSearch();
        }
      })
    );
  }
  @HostListener('document:click', ['$event.target'])
  focusOut(targetElement: HTMLElement) {
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.closeSearch();
    }
  }
  @ViewChild('searchInput', { static: false })
  searchInputElementRef!: ElementRef<HTMLInputElement>;
  selectProfile(profile: OrcidProfile) {
    this.searchingMode$.next('selected');
    this.selectedOrcidProfile.setValue(profile);
  }

  keyPress(event: KeyboardEvent) {
    if (
      event.key === 'Escape' &&
      this.searchInputElementRef &&
      this.searchInputElementRef.nativeElement == event.target
    ) {
      this.closeAndResetSearch();
    }
  }

  closeAndResetSearch() {
    this.resetSearch();
    this.closeSearch();
  }
  resetSearch() {
    if (this.selectedOrcidProfile.value != null) {
      this.selectedOrcidProfile.setValue(null);
    }
    this.searchText = '';
    this.searchQuery$.next('');
  }
  closeSearch() {
    if (this.searchingMode$.getValue() == 'searching') {
      this.searchingMode$.next('idle');
    }
  }
  openSearch() {
    this.searchingMode$.next('searching');
  }
}
