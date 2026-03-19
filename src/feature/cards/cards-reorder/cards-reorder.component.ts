import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Card } from '../../../data/model/card';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CONFIG } from '../../../app/app.properties';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Lesson } from '../../../data/model/lesson';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { updateLesson } from '../../../data/store/lessons/lessons.action';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cards-reorder',
  templateUrl: './cards-reorder.component.html',
  styleUrl: './cards-reorder.component.scss'
})
export class CardsReorderComponent implements OnInit, OnDestroy {

  @Input({required: true}) cards: Card[];
  @Output() reorderFinished = new EventEmitter();

  lesson: Lesson;
  reorderedCards: Card[];

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.reorderedCards = [...this.cards];
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const lessonId = params['lessonId'];
      this.store.select(selectLesson(lessonId)).pipe(takeUntil(this.destroy$)).subscribe(lesson => this.lesson = lesson);
   });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.reorderedCards, event.previousIndex, event.currentIndex);
  }

  abort() {
    this.reorderFinished.emit()
  }

  save() {
    const updatedLesson: Lesson = Object.assign({}, this.lesson);
    updatedLesson.cardIds = this.reorderedCards.map(card => card.id)
    this.store.dispatch(updateLesson({lesson: updatedLesson}))
    this.reorderFinished.emit()
  }

  title: string = CONFIG.LABELS.editOrder;
  saveLabel: string = CONFIG.LABELS.save;
}
