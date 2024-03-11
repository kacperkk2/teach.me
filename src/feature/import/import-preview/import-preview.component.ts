import { Component, Input } from '@angular/core';
import { CONFIG } from '../../../app/app.properties';
import { LessonMigration } from '../../../data/model/lesson';

@Component({
  selector: 'app-import-preview',
  templateUrl: './import-preview.component.html',
  styleUrl: './import-preview.component.scss'
})
export class ImportPreviewComponent {

  @Input({required: true}) migrationLessons: LessonMigration[];

  getCards() {
    return []; //Object.values(this.migrationData.cards)
  }

  cardsLabel: string = CONFIG.LABELS.cards;
}
