import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CONFIG } from '../../app/app.properties';
import { Lesson } from '../../data/model/lesson';
import { CourseWithStats, selectCoursesWithStats } from '../../data/store/courses/courses.selector';
import { selectLessons } from '../../data/store/lessons/lessons.selector';
import { ScrollService } from '../../services/scroll/scroll.service';
import { TabStateService } from '../../services/tab-state/tab-state.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
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
export class CoursesComponent implements OnInit {

  courses$: Observable<CourseWithStats[]>;
  lessons$ = this.store.select(selectLessons);

  getLessonsForCourse(course: CourseWithStats, lessons: {[id: number]: Lesson}): Lesson[] {
    return course.lessonIds.map(id => lessons[id]).filter(Boolean);
  }

  constructor(private store: Store, private router: Router, private scrollService: ScrollService, private tabState: TabStateService) {
  }

  ngOnInit(): void {
    this.courses$ = this.store.select(selectCoursesWithStats);
    this.scrollService.setScrolledDown(false);
  }

  onScroll(event: Event): void {
    this.scrollService.setScrolledDown((event.target as HTMLElement).scrollTop > 0);
  }

  navigateToLessons(courseId: number): void {
    this.router.navigate(['/courses', courseId, 'lessons']);
  }

  navigateToCards(courseId: number, lessonId: number): void {
    this.tabState.cardsOrigin = 'courses';
    this.router.navigate(['/courses', courseId, 'lessons', lessonId, 'cards']);
  }

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  searchQuery: string = '';
  isSearchActive: boolean = false;

  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      setTimeout(() => this.searchInput?.nativeElement.focus());
    } else {
      this.searchQuery = '';
    }
  }

  navigateToCard(courseId: number, lessonId: number, cardId: number): void {
    this.tabState.cardsOrigin = 'courses';
    this.tabState.pendingCardsTab = 1;
    this.tabState.pendingCardId = cardId;
    this.router.navigate(['/courses', courseId, 'lessons', lessonId, 'cards']);
  }

  courseLabel: string = CONFIG.LABELS.course;
  emptyCoursesLabel: string = CONFIG.LABELS.emptyCourses;
  emptyCoursesSubLabel: string = CONFIG.LABELS.emptyCoursesSub;
  searchPlaceholder: string = CONFIG.LABELS.searchPlaceholder;
}
