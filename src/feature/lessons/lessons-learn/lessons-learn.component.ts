import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { shuffle } from '../../../commons/utils';
import { Card } from '../../../data/model/card';
import { Course } from '../../../data/model/course';
import { LearnDataProviderService } from '../../../services/learn-data-provider/learn-data-provider.service';
import { selectCardsByLessonIds } from '../../../data/store/cards/cards.selector';
import { CONFIG } from '../../../app/app.properties';

@Component({
  selector: 'app-lessons-learn',
  templateUrl: './lessons-learn.component.html',
  styleUrl: './lessons-learn.component.scss'
})
export class LessonsLearnComponent implements OnInit {

  @Input({required: true}) course: Course;
  cards: Card[];

  constructor(private router: Router, private store: Store, private learnDataProvider: LearnDataProviderService) {
  }

  ngOnInit(): void {
    this.store.select(selectCardsByLessonIds(this.course.lessonIds)).subscribe(courseCards => {
      this.cards = courseCards;
    });
  }

  startAllInOrderGame() {
    this.learnDataProvider.prepareData([...this.cards], this.course.name);
    this.router.navigate(['/learn']);
  }

  startAllRandomGame() {
    this.learnDataProvider.prepareData(shuffle([...this.cards]), this.course.name);
    this.router.navigate(['/learn']);
  }

  startPreviouslyFailedGame() {
    // todo jak sie rozszerzy state o pamietanie poprzednio blednych
    console.log("previously failed started")
  }

  cardsLabel: string = CONFIG.LABELS.cards;
}
