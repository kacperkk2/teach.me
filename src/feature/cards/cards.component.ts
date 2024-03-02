import { Component, OnInit } from '@angular/core';
import { Card } from '../../data/model/card';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCardsByLessonId } from '../../data/store/cards/cards.selector';
import { Lesson } from '../../data/model/lesson';
import { selectLesson } from '../../data/store/lessons/lessons.selector';
import { CONFIG } from '../../app/app.properties';
import { Course } from '../../data/model/course';
import { selectCourse } from '../../data/store/courses/courses.selector';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {

  course$: Observable<Course>;
  cards$: Observable<Card[]>;
  lesson$: Observable<Lesson>;

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      const lessonId = params['lessonId'];
      this.cards$ = this.store.select(selectCardsByLessonId(lessonId));
      this.lesson$ = this.store.select(selectLesson(lessonId));
      this.course$ = this.store.select(selectCourse(courseId));
   });
  }

  teachTabLabel: string = CONFIG.LABELS.teachTab;
  cardsTabLabel: string = CONFIG.LABELS.cardsTab;
  cardsLabel: string = CONFIG.LABELS.cards;
}
