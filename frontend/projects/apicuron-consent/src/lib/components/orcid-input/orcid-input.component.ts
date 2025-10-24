import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, startWith, Subject, take, takeUntil, tap } from 'rxjs';
import { OrcidService } from '../../services/orcid.service';
import { LoadingState } from '../../util/operators';
import { OrcidProfile } from '../../model/orcid-profile.model';
import { ComponentConf, ConfigService } from '../../services/config.service';
import { ApicuronConsentService } from '../../apicuron-consent.service';
import { FormControl } from '@angular/forms';
import {
  OrcidInputSearchService,
  SearchMode,
} from './orcid-input-search.service';
import { isValidOrcid } from '../../util/orcid-checksum';

@Component({
  selector: 'ac-orcid-input',
  templateUrl: './orcid-input.component.html',
  styles: [],
  providers: [OrcidInputSearchService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrcidInputComponent implements OnInit, OnDestroy {
  searchQuery$: Observable<string>;
  suggestions$: Observable<LoadingState<OrcidProfile[]>>;
  searchText: string = '';
  placeholder$: Observable<string>;
  selectedOrcidProfile: FormControl<OrcidProfile | null>;
  private destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  userSelected$: Observable<OrcidProfile | null>;
  config$: Observable<ComponentConf>;
  disabled$: Observable<boolean>;
  searchMode$: Observable<SearchMode>;

  constructor(
    protected orcidService: OrcidService,
    protected config: ConfigService,
    private el: ElementRef,
    protected consentService: ApicuronConsentService,
    protected inputService: OrcidInputSearchService
  ) {
    this.selectedOrcidProfile = this.consentService.selectedProfile$;
    this.userSelected$ = this.selectedOrcidProfile.valueChanges.pipe(
      startWith(this.selectedOrcidProfile.value)
    );
    this.config$ = this.config.config$;
    this.placeholder$ = this.config.get('orcidInputPlaceholder');
    this.searchQuery$ = this.inputService.searchQuery$;
    this.suggestions$ = this.inputService.suggestions$;
    this.searchMode$ = this.inputService.searchMode$;
    this.disabled$ = this.inputService.disabled$;

    this.setupResetOn();
  }

  ngOnInit(): void {}
  onInput(event: Event) {
    const targetElement = event.target;
    if (!targetElement || !(targetElement instanceof HTMLInputElement)) {
      return;
    }
    this.inputService.setSearchQuery(targetElement.value);
  }

  @Input() set disabled(value: boolean) {
    this.inputService.setDisabled(value);
  }

  @Input('value') set initOrcidProfile(profile: OrcidProfile | string) {
    if (typeof profile === 'string') {
      if (!isValidOrcid(profile)) {
        throw new Error(
          'Invalid ORCID string provided to orcid-input component'
        );
      }
      this.consentService.setSelectedProfile(profile);
      return;
    }
    try {
      const profileInstance = new OrcidProfile().deserialize({ ...profile });
      this.selectedOrcidProfile.setValue(profileInstance);
    } catch (e) {
      throw new Error(
        'Invalid ORCIDProfile object provided to orcid-input component'
      );
    }
  }

  @HostListener('document:click', ['$event.target'])
  focusOut(targetElement: HTMLElement) {
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.inputService.closeSearch();
    }
  }
  @ViewChild('searchInput', { static: false })
  searchInputElementRef!: ElementRef<HTMLInputElement>;

  selectProfile(profile: OrcidProfile) {
    this.selectedOrcidProfile.setValue(profile);
  }

  setupResetOn() {
    this.selectedOrcidProfile.valueChanges
      .pipe(
        tap((profile) => {
          this.inputService.searchMode = profile == null ? 'idle' : 'selected';
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
    this.inputService.closeSearch();
  }
  resetSearch() {
    if (this.selectedOrcidProfile.value != null) {
      this.selectedOrcidProfile.setValue(null);
    }
    this.searchText = '';
    this.inputService.setSearchQuery('');
  }
  openSearch() {
    this.inputService.openSearch();
  }
}
