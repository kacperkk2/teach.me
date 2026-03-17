import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CONFIG } from '../../app/app.properties';
import { Lesson } from '../../data/model/lesson';
import { CourseWithStats, selectCoursesWithStats } from '../../data/store/courses/courses.selector';
import { selectLessons } from '../../data/store/lessons/lessons.selector';
import { ScrollService } from '../../services/scroll/scroll.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {

  courses$: Observable<CourseWithStats[]>;
  lessons$ = this.store.select(selectLessons);

  getLessonsForCourse(course: CourseWithStats, lessons: {[id: number]: Lesson}): Lesson[] {
    return course.lessonIds.map(id => lessons[id]).filter(Boolean);
  }

  constructor(private store: Store, private router: Router, private scrollService: ScrollService) {
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

  courseLabel: string = CONFIG.LABELS.course;
  emptyCoursesLabel: string = CONFIG.LABELS.emptyCourses;
  emptyCoursesSubLabel: string = CONFIG.LABELS.emptyCoursesSub;
}
