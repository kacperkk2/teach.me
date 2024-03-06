import { Component, Input } from '@angular/core';
import { MigrationData } from '../../../services/migration/migration.service';
import { CONFIG } from '../../../app/app.properties';

@Component({
  selector: 'app-import-preview',
  templateUrl: './import-preview.component.html',
  styleUrl: './import-preview.component.scss'
})
export class ImportPreviewComponent {

  @Input({required: true}) migrationData: MigrationData;

  getCards() {
    return Object.values(this.migrationData.cards)
  }

  cardsLabel: string = CONFIG.LABELS.cards;
}
