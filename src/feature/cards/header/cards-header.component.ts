import { Location } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { CONFIG } from '../../../app/app.properties';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeLesson, removeLessons } from '../../../data/store/lessons/lessons.action';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { Lesson } from '../../../data/model/lesson';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { Course } from '../../../data/model/course';

@Component({
  selector: 'app-cards-header',
  templateUrl: './cards-header.component.html',
  styleUrl: './cards-header.component.scss'
})
export class CardsHeaderComponent {
  lesson: Lesson;
  course: Course;

  constructor(private location: Location, private router: Router, 
    private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const lessonId = params['lessonId'];
      this.store.select(selectLesson(lessonId)).subscribe(lesson => {
        this.lesson = lesson;
      });
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).subscribe(course => {
        this.course = course;
      });
    });
  }

  back() {
    this.location.back();
  }

  removeLessonClicked() {
    this.store.dispatch(removeLesson({lesson: this.lesson, cardIds: this.lesson.cardIds, course: this.course}));
    this.location.back();
    // todo confirmation dialog
  }
  
  title: string = CONFIG.LABELS.lesson;
  removeLessonLabel: string = CONFIG.LABELS.removeLesson;
}
