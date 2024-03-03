import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Course } from '../../data/model/course';
import { selectCourse } from '../../data/store/courses/courses.selector';
import { CONFIG } from '../../app/app.properties';
import { Lesson } from '../../data/model/lesson';
import { selectLessonsByCourseId } from '../../data/store/lessons/lessons.selector';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnInit {

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      this.course$ = this.store.select(selectCourse(courseId));
      this.lessons$ = this.store.select(selectLessonsByCourseId(courseId));
   });
  }

  teachTabLabel: string = CONFIG.LABELS.teachTab;
  lessonsTabLabel: string = CONFIG.LABELS.lessonsTab;
  lessonLabel: string = CONFIG.LABELS.lesson;
}
