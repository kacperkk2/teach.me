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
import { LearnEndData, LearnEndState } from '../learn/learn.component';
import { LearnData } from './cards-learn/cards-learn.component';
import { updateLesson } from '../../data/store/lessons/lessons.action';
import { updateCard } from '../../data/store/cards/cards.action';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {

  isLearning: boolean = false;
  cardsToLearn: Card[];

  course$: Observable<Course>;
  cards$: Observable<Card[]>;
  lesson: Lesson;

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      const lessonId = params['lessonId'];
      this.cards$ = this.store.select(selectCardsByLessonId(lessonId));
      this.store.select(selectLesson(lessonId)).subscribe(lesson => this.lesson = lesson);
      this.course$ = this.store.select(selectCourse(courseId));
   });
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

  teachTabLabel: string = CONFIG.LABELS.teachTab;
  cardsTabLabel: string = CONFIG.LABELS.cardsTab;
  cardsLabel: string = CONFIG.LABELS.cards;
}
