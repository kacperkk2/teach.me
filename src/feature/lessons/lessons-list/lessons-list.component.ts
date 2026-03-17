import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../../data/model/card';
import { Lesson } from '../../../data/model/lesson';
import { selectCards } from '../../../data/store/cards/cards.selector';
import { CONFIG } from '../../../app/app.properties';
import { ScrollService } from '../../../services/scroll/scroll.service';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent implements OnInit {

  @Input({required: true}) lessons: Lesson[];

  cards$ = this.store.select(selectCards);

  constructor(private router: Router, private route: ActivatedRoute, private scrollService: ScrollService, private store: Store) {}

  getCardsForLesson(lesson: Lesson, cards: {[id: number]: Card}): Card[] {
    return lesson.cardIds.map(id => cards[id]).filter(Boolean);
  }

  ngOnInit(): void {
    this.scrollService.setScrolledDown(false);
  }

  onScroll(event: Event): void {
    this.scrollService.setScrolledDown((event.target as HTMLElement).scrollTop > 0);
  }

  navigateToCards(lessonId: number): void {
    this.router.navigate([lessonId, 'cards'], { relativeTo: this.route });
  }

  emptyLessonsLabel: string = CONFIG.LABELS.emptyLessons;
  emptyLessonsSubLabel: string = CONFIG.LABELS.emptyLessonsSub;
}
