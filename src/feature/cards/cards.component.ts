import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Card } from '../../data/model/card';
import { Observable, Subject, take, takeUntil } from 'rxjs';
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
import { TabStateService } from '../../services/tab-state/tab-state.service';
import { TurnCardService } from '../../services/turn-card/turn-card.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
  animations: [
    trigger('slideDown', [
      state('collapsed', style({ height: '0px', marginTop: '0px' })),
      state('expanded', style({ height: '*', marginTop: '-15px' })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ]),
    trigger('slideDownSearch', [
      transition(':enter', [
        style({ height: '0px', overflow: 'hidden' }),
        animate('200ms ease-out', style({ height: '*' }))
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: '0px' }))
      ])
    ])
  ]
})
export class CardsComponent implements OnInit, OnDestroy {

  Tab = Tab;
  isActionsExpanded = false;
  showBulkActions = true;
  isLearning: boolean = false;
  isReorder: boolean = false;
  cardsToLearn: Card[];

  course$: Observable<Course>;
  cards$: Observable<Card[]>;
  lesson: Lesson;
  lessonId: number;
  selectedTab: Tab = Tab.LEARN;
  scrollToCardId: number | null = null;

  isSearchActive: boolean = false;
  searchQuery: string = '';

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store,
    private tabState: TabStateService, private turnCardService: TurnCardService) {
  }

  ngOnInit(): void {
    this.selectedTab = this.tabState.pendingCardsTab ?? Tab.LEARN;
    this.tabState.pendingCardsTab = null;
    this.scrollToCardId = this.tabState.pendingCardId;
    this.tabState.pendingCardId = null;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const courseId = params['courseId'];
      this.lessonId = +params['lessonId'];
      this.cards$ = this.store.select(selectCardsByLessonId(this.lessonId));
      this.store.select(selectLesson(this.lessonId)).pipe(takeUntil(this.destroy$)).subscribe(lesson => this.lesson = lesson);
      this.course$ = this.store.select(selectCourse(courseId));
   });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange(index: number): void {
    this.selectedTab = index === 0 ? Tab.LEARN : Tab.CARDS;
    if (index !== Tab.CARDS) {
      this.isSearchActive = false;
      this.searchQuery = '';
      this.showBulkActions = true;
    }
  }

  toggleSearch(): void {
    if (!this.isSearchActive) {
      const needsTabSwitch = this.selectedTab !== Tab.CARDS;
      this.selectedTab = Tab.CARDS;
      this.showBulkActions = false;
      setTimeout(() => {
        this.isSearchActive = true;
        setTimeout(() => this.searchInput?.nativeElement.focus(), needsTabSwitch ? 300 : 0);
      }, 50);
    } else {
      this.isSearchActive = false;
      this.searchQuery = '';
      setTimeout(() => this.showBulkActions = true, 200);
    }
  }

  scrollToCard(cardId: number): void {
    this.isSearchActive = false;
    this.searchQuery = '';
    this.selectedTab = Tab.CARDS;
    this.scrollToCardId = cardId;
    setTimeout(() => this.showBulkActions = true, 200);
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

  toggleActionsExpanded() {
    this.isActionsExpanded = !this.isActionsExpanded;
  }

  turnLessonCards() {
    this.turnCardService.turnLessonCards(this.lesson.id);
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
  searchPlaceholder: string = CONFIG.LABELS.searchPlaceholder;
  cardsLabel: string = CONFIG.LABELS.cards;
  turnLessonCardsLabel: string = CONFIG.LABELS.turnCards;
  reorderCardsLabel: string = CONFIG.LABELS.reorderCards;
  removeAllCardsMarksLabel: string = CONFIG.LABELS.removeAllCardsMarks;
  markAllCardsLabel: string = CONFIG.LABELS.markAllCards;
  bulkActionsLabel: string = CONFIG.LABELS.bulkActions;
}

export enum Tab {
  LEARN, CARDS
}