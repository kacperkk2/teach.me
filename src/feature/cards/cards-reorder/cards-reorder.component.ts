import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from '../../../data/model/card';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CONFIG } from '../../../app/app.properties';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Lesson } from '../../../data/model/lesson';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { updateLesson } from '../../../data/store/lessons/lessons.action';

@Component({
  selector: 'app-cards-reorder',
  templateUrl: './cards-reorder.component.html',
  styleUrl: './cards-reorder.component.scss'
})
export class CardsReorderComponent implements OnInit {

  @Input({required: true}) cards: Card[];
  @Output() reorderFinished = new EventEmitter();

  lesson: Lesson;
  reorderedCards: Card[];

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.reorderedCards = [...this.cards];
    this.route.params.subscribe(params => {
      const lessonId = params['lessonId'];
      this.store.select(selectLesson(lessonId)).subscribe(lesson => this.lesson = lesson);
   });
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
