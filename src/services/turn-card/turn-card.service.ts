import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCardsByLessonId } from '../../data/store/cards/cards.selector';
import { updateCard, updateCards } from '../../data/store/cards/cards.action';
import { Card } from '../../data/model/card';
import { take } from 'rxjs';
import { selectLessonsByCourseId } from '../../data/store/lessons/lessons.selector';

@Injectable({
  providedIn: 'root'
})
export class TurnCardService {

  constructor(private store: Store) { }

  turnLessonCards(lessonId: number) {
    this.store.select(selectCardsByLessonId(lessonId))
      .pipe(take(1))
      .subscribe(cards => {
        const turnedCards: Card[] = cards.map(card => this.turn(card));
        this.store.dispatch(updateCards({cards: turnedCards}));
      }); 
  }

  turnCourseCards(courseId: number) {
    this.store.select(selectLessonsByCourseId(courseId))
      .pipe(take(1))
      .subscribe(lessons => {
        lessons.forEach(lesson => this.turnLessonCards(lesson.id))
      });
  }

  private turn(card: Card): Card {
    return {
      id: card.id,
      question: card.answer,
      answer: card.question,
      isMarked: card.isMarked
    }
  }
}
