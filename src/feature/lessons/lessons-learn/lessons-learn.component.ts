import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { shuffle } from '../../../commons/utils';
import { Card } from '../../../data/model/card';
import { Course } from '../../../data/model/course';
import { selectCardsByIds, selectCardsByLessonIds } from '../../../data/store/cards/cards.selector';
import { LearnData } from '../../cards/cards-learn/cards-learn.component';
import { LearningPreferencesService } from '../../../services/learning-preferences/learning-preferences.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-lessons-learn',
  templateUrl: './lessons-learn.component.html',
  styleUrl: './lessons-learn.component.scss'
})
export class LessonsLearnComponent implements OnInit, OnDestroy {
  @Input({required: true}) course: Course;
  @Output() learnClicked = new EventEmitter<LearnData>();

  cards: Card[];
  markedCards: Card[];
  wrongPreviouslyCards: Card[];

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private store: Store, public prefs: LearningPreferencesService) {
  }

  ngOnInit(): void {
    this.store.select(selectCardsByLessonIds(this.course.lessonIds)).pipe(takeUntil(this.destroy$)).subscribe(courseCards => {
      this.cards = courseCards;
      this.markedCards = courseCards.filter(card => card.isMarked);
    });
    this.store.select(selectCardsByIds(this.course.wrongPreviouslyCardIds)).pipe(takeUntil(this.destroy$)).subscribe(wrongCards => {
      this.wrongPreviouslyCards = wrongCards
    });
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

  startOnlyMarkedGame() {
    this.learnClicked.emit(new LearnData([...this.markedCards]));
  }

  startMarkedRandomGame() {
    this.learnClicked.emit(new LearnData(shuffle([...this.markedCards])));
  }

  startPreviouslyFailedGame() {
    this.learnClicked.emit(new LearnData(shuffle([...this.wrongPreviouslyCards])));
  }

  startQuickGame(count: number) {
    const picked = shuffle([...this.cards]).slice(0, count);
    this.learnClicked.emit(new LearnData(picked));
  }

  quickLearnMinCards: number = CONFIG.QUICK_LEARN.minCards;
  cardsLabel: string = CONFIG.LABELS.cards;
}
