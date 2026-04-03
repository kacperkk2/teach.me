import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../../data/model/card';
import { LessonMigration } from '../../../data/model/lesson';

@Component({
  selector: 'app-import-preview',
  templateUrl: './import-preview.component.html',
  styleUrl: './import-preview.component.scss'
})
export class ImportPreviewComponent {

  @Input({required: true}) migrationLessons: LessonMigration[];
  @Output() markedLessonsChange = new EventEmitter<LessonMigration[]>();

  private markedIndices = new Set<number>();

  isMarkedForDeletion(index: number): boolean {
    return this.markedIndices.has(index);
  }

  toggleLessonDeletion(index: number): void {
    if (this.markedIndices.has(index)) {
      this.markedIndices.delete(index);
    } else {
      this.markedIndices.add(index);
    }
    const marked = this.migrationLessons.filter((_, i) => this.markedIndices.has(i));
    this.markedLessonsChange.emit(marked);
  }

  getCards(lesson: LessonMigration): Card[] {
    return lesson.cards.map(c => ({ id: 0, question: c.question, answer: c.answer, isMarked: false }));
  }
}
