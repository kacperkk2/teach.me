import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { shuffle } from '../../../commons/utils';
import { Card } from '../../../data/model/card';
import { Course } from '../../../data/model/course';
import { selectCardsByIds, selectCardsByLessonIds } from '../../../data/store/cards/cards.selector';
import { LearnData } from '../../cards/cards-learn/cards-learn.component';

@Component({
  selector: 'app-lessons-learn',
  templateUrl: './lessons-learn.component.html',
  styleUrl: './lessons-learn.component.scss'
})
export class LessonsLearnComponent implements OnInit {
  @Input({required: true}) course: Course;
  @Output() learnClicked = new EventEmitter<LearnData>();

  cards: Card[];
  wrongPreviouslyCards: Card[];

  constructor(private router: Router, private store: Store) {
  }

  ngOnInit(): void {
    this.store.select(selectCardsByLessonIds(this.course.lessonIds)).subscribe(courseCards => {
      this.cards = courseCards;
    });
    this.store.select(selectCardsByIds(this.course.wrongPreviouslyCardIds)).subscribe(wrongCards => {
      this.wrongPreviouslyCards = wrongCards
    });
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

  cardsLabel: string = CONFIG.LABELS.cards;
}
