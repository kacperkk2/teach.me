import { Component, OnInit } from '@angular/core';
import { Card } from '../../data/model/card';
import { Observable, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCardsByLessonId } from '../../data/store/cards/cards.selector';
import { Lesson } from '../../data/model/lesson';
import { selectLesson } from '../../data/store/lessons/lessons.selector';
import { CONFIG } from '../../app/app.properties';
import { Course } from '../../data/model/course';
import { selectCourse } from '../../data/store/courses/courses.selector';
import { LearnEndData, LearnEndState } from '../learn/learn.component';
import { LearnData } from './cards-learn/cards-learn.component';
import { updateLesson } from '../../data/store/lessons/lessons.action';
import { updateCard, updateCards } from '../../data/store/cards/cards.action';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TabStateService } from '../../services/tab-state/tab-state.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {

  isLearning: boolean = false;
  isReorder: boolean = false;
  cardsToLearn: Card[];

  course$: Observable<Course>;
  cards$: Observable<Card[]>;
  lesson: Lesson;
  selectedTab: Tab = Tab.LEARN;
  scrollToCardId: number | null = null;

  constructor(private route: ActivatedRoute, private store: Store,
    private tabState: TabStateService) {
  }

  ngOnInit(): void {
    this.selectedTab = this.tabState.pendingCardsTab ?? Tab.LEARN;
    this.tabState.pendingCardsTab = null;
    this.scrollToCardId = this.tabState.pendingCardId;
    this.tabState.pendingCardId = null;
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      const lessonId = params['lessonId'];
      this.cards$ = this.store.select(selectCardsByLessonId(lessonId));
      this.store.select(selectLesson(lessonId)).subscribe(lesson => this.lesson = lesson);
      this.course$ = this.store.select(selectCourse(courseId));
   });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.index == 0 ? Tab.LEARN : Tab.CARDS;
  }

  learnEnd(learnEndData: LearnEndData) {
    this.isLearning = false;
    if (learnEndData.state == LearnEndState.ABORT) {
      return;
    }
    const updatedLesson: Lesson = {
      id: this.lesson.id,
      name: this.lesson.name,
      lastLearningDate: this.lesson.lastLearningDate,
      nextSuggestedLearningDate: this.lesson.nextSuggestedLearningDate,
      noMistakeInARow: this.lesson.noMistakeInARow,
      cardIds: this.lesson.cardIds,
      wrongPreviouslyCardIds: learnEndData.wrong.map(card => card.id),
    }
    this.store.dispatch(updateLesson({lesson: updatedLesson}))
  }

  learnClicked(learnData: LearnData) {
    this.cardsToLearn = learnData.cards;
    this.isLearning = true;
  }

  toggleCardIsMarked(card: Card) {
    const updatedCard: Card = {
      id: card.id,
      question: card.question,
      answer: card.answer,
      isMarked: !card.isMarked
    }
    this.store.dispatch(updateCard({card: updatedCard}));
  }

  turnOnReorder() {
    this.isReorder = true;
  }

  turnOffReorder() {
    this.isReorder = false;
  }

  removeAllMarks() {
    this.cards$.pipe(take(1)).subscribe(cardsToUpdate => {
      const updatedCards: Card[] = cardsToUpdate.map(card => Object.assign({}, card));
      updatedCards.forEach(card => card.isMarked = false);
      this.store.dispatch(updateCards({cards: updatedCards}))
    })
  }

  markAllCards() {
    this.cards$.pipe(take(1)).subscribe(cardsToUpdate => {
      const updatedCards: Card[] = cardsToUpdate.map(card => Object.assign({}, card));
      updatedCards.forEach(card => card.isMarked = true);
      this.store.dispatch(updateCards({cards: updatedCards}))
    })
  }

  teachTabLabel: string = CONFIG.LABELS.teachTab;
  cardsTabLabel: string = CONFIG.LABELS.cardsTab;
  cardsLabel: string = CONFIG.LABELS.cards;
}

export enum Tab {
  LEARN, CARDS
}