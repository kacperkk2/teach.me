import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { shuffle } from '../../../commons/utils';
import { Card } from '../../../data/model/card';
import { Course } from '../../../data/model/course';
import { Lesson } from '../../../data/model/lesson';
import { selectCardsByIds } from '../../../data/store/cards/cards.selector';
import { LearningPreferencesService } from '../../../services/learning-preferences/learning-preferences.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cards-learn',
  templateUrl: './cards-learn.component.html',
  styleUrl: './cards-learn.component.scss'
})
export class CardsLearnComponent implements OnInit, OnDestroy {

  @Input({required: true}) lesson: Lesson;
  @Input({required: true}) course: Course;
  @Output() learnClicked = new EventEmitter<LearnData>();
  cards: Card[];
  markedCards: Card[];
  wrongPreviouslyCards: Card[];

  private destroy$ = new Subject<void>();

  constructor(private store: Store, public prefs: LearningPreferencesService) {
  }

  ngOnInit(): void {
    this.store.select(selectCardsByIds(this.lesson.cardIds)).pipe(takeUntil(this.destroy$)).subscribe(lessonCards => {
      this.cards = lessonCards;
      this.markedCards = lessonCards.filter(card => card.isMarked);
    });
    this.store.select(selectCardsByIds(this.lesson.wrongPreviouslyCardIds)).pipe(takeUntil(this.destroy$)).subscribe(
      wrongCards => this.wrongPreviouslyCards = wrongCards
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startAllInOrderGame() {
    this.learnClicked.emit(new LearnData([...this.cards]));
  }

  startAllRandomGame() {
    this.learnClicked.emit(new LearnData(shuffle([...this.cards])));
  }

  startPreviouslyFailedGame() {
    this.learnClicked.emit(new LearnData(shuffle([...this.wrongPreviouslyCards])));
  }

  startOnlyMarkedGame() {
    this.learnClicked.emit(new LearnData([...this.markedCards]));
  }

  startMarkedRandomGame() {
    this.learnClicked.emit(new LearnData(shuffle([...this.markedCards])));
  }

  startQuickGame(count: number) {
    const picked = shuffle([...this.cards]).slice(0, count);
    this.learnClicked.emit(new LearnData(picked));
  }

  quickLearnMinCards: number = CONFIG.QUICK_LEARN.minCards;
}

export class LearnData {
  constructor(public cards: Card[]) {}
} 