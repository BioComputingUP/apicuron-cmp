import { Injectable } from '@angular/core';
import { OrcidService } from '../../services/orcid.service';
import {
  BehaviorSubject,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';
import {
  LoadingState,
  skipWhileTrue,
  switchMapWithLoading,
} from '../../util/operators';
import { OrcidProfile } from '../../model/orcid-profile.model';
import { isValidOrcid } from '../../util/orcid-checksum';

export type SearchMode = 'idle' | 'searching' | 'selected';

@Injectable()
export class OrcidInputSearchService {
  suggestions$: Observable<LoadingState<OrcidProfile[]>>;
  constructor(protected orcidService: OrcidService) {
    this.suggestions$ = this.fetchSuggestions(this.searchQuery$);
  }

  private searchQueryInput$ = new BehaviorSubject<string>('');
  private inputDisabled$ = new BehaviorSubject<boolean>(false);
  private searchingMode$ = new BehaviorSubject<SearchMode>('idle');
  searchMode$ = this.searchingMode$.asObservable();
  disabled$ = this.inputDisabled$.asObservable();

  set searchMode(mode: SearchMode) {
    this.searchingMode$.next(mode);
  }
  get searchMode() {
    return this.searchingMode$.getValue();
  }

  public searchQuery$ = this.searchQueryInput$
    .asObservable()
    .pipe(skipWhileTrue(this.disabled$));

  setDisabled(disabled: boolean) {
    this.inputDisabled$.next(disabled);
  }

  setSearchQuery(query: string) {
    this.searchQueryInput$.next(query);
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

  openSearch() {
    this.searchMode = 'searching';
  }

  closeSearch() {
    if (this.searchMode == 'searching') {
      this.searchMode = 'idle';
    }
  }

  fetchSuggestions(
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
}
