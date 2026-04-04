import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { shuffle } from '../../../commons/utils';
import { Card } from '../../../data/model/card';
import { Course } from '../../../data/model/course';
import { selectCardsByIds, selectCardsByUnlockedLessonsInCourse } from '../../../data/store/cards/cards.selector';
import { selectLessonsByCourseId } from '../../../data/store/lessons/lessons.selector';
import { LearnData } from '../../cards/cards-learn/cards-learn.component';
import { LearningPreferencesService } from '../../../services/learning-preferences/learning-preferences.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';

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
  lockedLessonsCount: number = 0;
  lockedCardsCount: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private store: Store, public prefs: LearningPreferencesService) {
  }

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectCardsByUnlockedLessonsInCourse(this.course.id)),
      this.store.select(selectCardsByIds(this.course.wrongPreviouslyCardIds))
    ]).pipe(takeUntil(this.destroy$)).subscribe(([courseCards, wrongCards]) => {
      this.cards = courseCards;
      this.markedCards = courseCards.filter(card => card.isMarked);
      const unlockedIds = new Set(courseCards.map(c => c.id));
      this.wrongPreviouslyCards = wrongCards.filter(c => unlockedIds.has(c.id));
    });
    this.store.select(selectLessonsByCourseId(this.course.id)).pipe(takeUntil(this.destroy$)).subscribe(lessons => {
      const locked = lessons.filter(l => l.isLocked);
      this.lockedLessonsCount = locked.length;
      this.lockedCardsCount = locked.reduce((sum, l) => sum + l.cardIds.length, 0);
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
