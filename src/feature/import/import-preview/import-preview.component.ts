import { Component, Input } from '@angular/core';
import { CONFIG } from '../../../app/app.properties';
import { Card } from '../../../data/model/card';
import { LessonMigration } from '../../../data/model/lesson';

@Component({
  selector: 'app-import-preview',
  templateUrl: './import-preview.component.html',
  styleUrl: './import-preview.component.scss'
})
export class ImportPreviewComponent {

  @Input({required: true}) migrationLessons: LessonMigration[];

  lessonsLabel = CONFIG.LABELS.lessonsTab;

  getCards(lesson: LessonMigration): Card[] {
    return lesson.cards.map(c => ({ id: 0, question: c.question, answer: c.answer, isMarked: false }));
  }
}
