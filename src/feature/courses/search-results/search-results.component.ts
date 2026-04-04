import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CardSearchResult, selectCardSearchResults, selectCardSearchResultsByCourseId, selectCardSearchResultsByLessonId } from '../../../data/store/cards/cards.selector';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  results$: Observable<CardSearchResult[]>;
  currentQuery: string = '';
  private _courseId: number | null = null;
  private _lessonId: number | null = null;

  @Input() set lessonId(id: number | null) {
    this._lessonId = id;
    this.updateResults();
  }

  @Input() set courseId(id: number | null) {
    this._courseId = id;
    this.updateResults();
  }

  @Input() set query(q: string) {
    this.currentQuery = q;
    this.updateResults();
  }

  private updateResults(): void {
    if (this._lessonId != null) {
      this.results$ = this.store.select(selectCardSearchResultsByLessonId(this.currentQuery, this._lessonId));
    } else if (this._courseId != null) {
      this.results$ = this.store.select(selectCardSearchResultsByCourseId(this.currentQuery, this._courseId));
    } else {
      this.results$ = this.store.select(selectCardSearchResults(this.currentQuery));
    }
  }

  @Output() cardClicked = new EventEmitter<{ courseId: number; lessonId: number; cardId: number }>();

  constructor(private store: Store) {}
}
