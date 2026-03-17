import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CardSearchResult, selectCardSearchResults } from '../../../data/store/cards/cards.selector';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  results$: Observable<CardSearchResult[]>;
  currentQuery: string = '';

  @Input() set query(q: string) {
    this.currentQuery = q;
    this.results$ = this.store.select(selectCardSearchResults(q));
  }

  @Output() cardClicked = new EventEmitter<{ courseId: number; lessonId: number; cardId: number }>();

  constructor(private store: Store) {}
}
