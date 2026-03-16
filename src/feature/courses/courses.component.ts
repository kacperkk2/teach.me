import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CONFIG } from '../../app/app.properties';
import { CourseWithStats, selectCoursesWithStats } from '../../data/store/courses/courses.selector';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {

  courses$: Observable<CourseWithStats[]>;

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
    this.courses$ = this.store.select(selectCoursesWithStats);
  }

  navigateToLessons(courseId: number): void {
    this.router.navigate(['/courses', courseId, 'lessons']);
  }

  courseLabel: string = CONFIG.LABELS.course;
  emptyCoursesLabel: string = CONFIG.LABELS.emptyCourses;
  emptyCoursesSubLabel: string = CONFIG.LABELS.emptyCoursesSub;
}
