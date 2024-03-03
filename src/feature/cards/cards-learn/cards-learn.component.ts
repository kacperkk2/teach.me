import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../../../data/model/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCards, selectCardsByIds, selectCardsByLessonId, selectCardsList } from '../../../data/store/cards/cards.selector';
import { Lesson } from '../../../data/model/lesson';
import { Course } from '../../../data/model/course';
import { LearnDataProviderService } from '../../../services/learn-data-provider/learn-data-provider.service';
import { shuffle } from '../../../commons/utils';

@Component({
  selector: 'app-cards-learn',
  templateUrl: './cards-learn.component.html',
  styleUrl: './cards-learn.component.scss'
})
export class CardsLearnComponent implements OnInit {

  @Input({required: true}) lesson: Lesson;
  @Input({required: true}) course: Course;
  cards: Card[];

  constructor(private router: Router, private store: Store, private learnDataProvider: LearnDataProviderService) {
  }

  ngOnInit(): void {
    this.store.select(selectCardsByIds(this.lesson.cardIds)).subscribe(lessonCards => this.cards = lessonCards);
  }

  startAllInOrderGame() {
    this.learnDataProvider.prepareData([...this.cards], this.lesson.name);
    this.router.navigate(['/learn']);
  }

  startAllRandomGame() {
    this.learnDataProvider.prepareData(shuffle([...this.cards]), this.lesson.name);
    this.router.navigate(['/learn']);
  }

  startPreviouslyFailedGame() {
    // todo jak sie rozszerzy state o pamietanie poprzednio blednych
    console.log("previously failed started")
  }
}