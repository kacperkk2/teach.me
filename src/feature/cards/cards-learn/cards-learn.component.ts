import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { shuffle } from '../../../commons/utils';
import { Card } from '../../../data/model/card';
import { Course } from '../../../data/model/course';
import { Lesson } from '../../../data/model/lesson';
import { selectCardsByIds } from '../../../data/store/cards/cards.selector';

@Component({
  selector: 'app-cards-learn',
  templateUrl: './cards-learn.component.html',
  styleUrl: './cards-learn.component.scss'
})
export class CardsLearnComponent implements OnInit {

  @Input({required: true}) lesson: Lesson;
  @Input({required: true}) course: Course;
  @Output() learnClicked = new EventEmitter<LearnData>();
  cards: Card[];
  wrongPreviouslyCards: Card[];

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.select(selectCardsByIds(this.lesson.cardIds)).subscribe(lessonCards => this.cards = lessonCards);
    this.store.select(selectCardsByIds(this.lesson.wrongPreviouslyCardIds)).subscribe(
      wrongCards => this.wrongPreviouslyCards = wrongCards
    );
  }

  startAllInOrderGame() {
    this.learnClicked.emit(new LearnData([...this.cards]));
  }

  startAllRandomGame() {
    this.learnClicked.emit(new LearnData(shuffle([...this.cards])));
  }

  startPreviouslyFailedGame() {
    this.learnClicked.emit(new LearnData([...this.wrongPreviouslyCards]));
  }
}

export class LearnData {
  constructor(public cards: Card[]) {}
} 