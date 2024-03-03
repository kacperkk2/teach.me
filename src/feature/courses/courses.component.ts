import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Course } from '../../data/model/course';
import { selectCoursesList } from '../../data/store/courses/courses.selector';
import { IdGeneratorService } from '../../services/id-generator/id-generator.service';
import { CONFIG } from '../../app/app.properties';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]>;

  constructor(private store: Store, private idGenerator: IdGeneratorService) {
  }

  ngOnInit(): void {
    this.courses$ = this.store.select(selectCoursesList);
  }

  courseLabel: string = CONFIG.LABELS.course;
  emptyCoursesLabel: string = CONFIG.LABELS.emptyCourses;
  emptyCoursesSubLabel: string = CONFIG.LABELS.emptyCoursesSub;
}
