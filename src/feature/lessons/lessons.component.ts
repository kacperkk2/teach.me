import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabStateService } from '../../services/tab-state/tab-state.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Course } from '../../data/model/course';
import { selectCourse } from '../../data/store/courses/courses.selector';
import { CONFIG } from '../../app/app.properties';
import { Lesson } from '../../data/model/lesson';
import { selectLessonsByCourseId } from '../../data/store/lessons/lessons.selector';
import { Card } from '../../data/model/card';
import { LearnData } from '../cards/cards-learn/cards-learn.component';
import { LearnEndData, LearnEndState } from '../learn/learn.component';
import { updateCourse } from '../../data/store/courses/courses.action';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
  animations: [
    trigger('slideDown', [
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
export class LessonsComponent implements OnInit, OnDestroy {

  isLearning: boolean = false;
  isReorder: boolean = false;
  cardsToLearn: Card[];

  course: Course;
  courseId: number;
  lessons$: Observable<Lesson[]>;

  selectedTab: number = 0;

  isSearchActive: boolean = false;
  searchQuery: string = '';

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router, private store: Store,
    private tabState: TabStateService) {
  }

  ngOnInit(): void {
    this.selectedTab = this.tabState.pendingLessonsTab ?? 0;
    this.tabState.pendingLessonsTab = null;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.courseId = +params['courseId'];
      this.store.select(selectCourse(this.courseId)).pipe(takeUntil(this.destroy$)).subscribe(course => this.course = course);
      this.lessons$ = this.store.select(selectLessonsByCourseId(this.courseId));
   });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    if (index !== 1) {
      this.isSearchActive = false;
      this.searchQuery = '';
    }
  }

  toggleSearch(): void {
    if (!this.isSearchActive) {
      const needsTabSwitch = this.selectedTab !== 1;
      this.selectedTab = 1;
      this.isSearchActive = true;
      setTimeout(() => this.searchInput?.nativeElement.focus(), needsTabSwitch ? 300 : 0);
    } else {
      this.isSearchActive = false;
      this.searchQuery = '';
    }
  }

  navigateToCard(courseId: number, lessonId: number, cardId: number): void {
    this.tabState.cardsOrigin = 'lessons';
    this.tabState.pendingCardsTab = 1;
    this.tabState.pendingCardId = cardId;
    this.router.navigate(['/courses', courseId, 'lessons', lessonId, 'cards']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  learnEnd(learnEndData: LearnEndData) {
    this.isLearning = false;
    if (learnEndData.state == LearnEndState.ABORT) {
      return;
    }
    const updatedCourse: Course = {
      id: this.course.id,
      name: this.course.name,
      language: this.course.language,
      lastLearningDate: this.course.lastLearningDate,
      nextSuggestedLearningDate: this.course.nextSuggestedLearningDate,
      lessonIds: this.course.lessonIds,
      wrongPreviouslyCardIds: learnEndData.wrong.map(card => card.id),
    }
    this.store.dispatch(updateCourse({course: updatedCourse}));
  }

  learnClicked(learnData: LearnData) {
    this.cardsToLearn = learnData.cards;
    this.isLearning = true;
  }

  teachTabLabel: string = CONFIG.LABELS.teachTab;
  lessonsTabLabel: string = CONFIG.LABELS.lessonsTab;
  lessonLabel: string = CONFIG.LABELS.lesson;
  searchPlaceholder: string = CONFIG.LABELS.searchPlaceholder;
}
