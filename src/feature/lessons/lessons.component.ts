import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnInit {

  isLearning: boolean = false;
  cardsToLearn: Card[];

  course: Course;
  lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).subscribe(course => this.course = course);
      this.lessons$ = this.store.select(selectLessonsByCourseId(courseId));
   });
  }

  learnEnd(learnEndData: LearnEndData) {
    this.isLearning = false;
    if (learnEndData.state == LearnEndState.ABORT) {
      return;
    }
    const updatedCourse: Course = {
      id: this.course.id,
      name: this.course.name,
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
}
