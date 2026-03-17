import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../../data/model/card';
import { Lesson } from '../../../data/model/lesson';
import { selectCards } from '../../../data/store/cards/cards.selector';
import { CONFIG } from '../../../app/app.properties';
import { ScrollService } from '../../../services/scroll/scroll.service';
import { TabStateService } from '../../../services/tab-state/tab-state.service';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent implements OnInit {

  @Input({required: true}) lessons: Lesson[];

  cards$ = this.store.select(selectCards);

  constructor(private router: Router, private route: ActivatedRoute, private scrollService: ScrollService, private store: Store, private tabState: TabStateService) {}

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
    this.tabState.cardsOrigin = 'lessons';
    this.router.navigate([lessonId, 'cards'], { relativeTo: this.route });
  }

  navigateToCardsTab(lessonId: number, cardId: number): void {
    this.tabState.cardsOrigin = 'lessons';
    this.tabState.pendingCardsTab = 1;
    this.tabState.pendingCardId = cardId;
    this.router.navigate([lessonId, 'cards'], { relativeTo: this.route });
  }

  emptyLessonsLabel: string = CONFIG.LABELS.emptyLessons;
  emptyLessonsSubLabel: string = CONFIG.LABELS.emptyLessonsSub;
}
