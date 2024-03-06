import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../app/app.properties';
import { CodecService } from '../../services/codec/codec.service';
import { DataType, MigrationData } from '../../services/migration/migration.service';
import { ImportLessonData } from './import-summary/import-lesson/import-lesson.component';
import { Lesson } from '../../data/model/lesson';
import { addLesson } from '../../data/store/lessons/lessons.action';
import { IdGeneratorService } from '../../services/id-generator/id-generator.service';
import { Card } from '../../data/model/card';
import { animate } from '@angular/animations';
import { addCards } from '../../data/store/cards/cards.action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss'
})
export class ImportComponent implements OnInit {

  migrationData: MigrationData;
  summaryData: ImportSummaryData;
  migrationType: DataType;
  importTitle: string;
  DataType = DataType;

  constructor(private codec: CodecService, private route: ActivatedRoute, 
    private store: Store, private idGenerator: IdGeneratorService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const data = params['data'];
      const migrationDataWrapper = this.codec.unpack(data);
      this.migrationType = migrationDataWrapper.type;
      this.migrationData = JSON.parse(migrationDataWrapper.data || '{}');
      this.summaryData = this.getSummaryData(this.migrationData, this.migrationType);
      // todo zabezpieczyc sie na mozliwosc zlych danych po rozpakowaniu, wtedy widok ze dane popsute i tylko krzyzyk
      this.importTitle = this.getImportTitle(this.migrationType);

      console.log(this.migrationData)
   });
  }

  // todo nie podoba mi sie ze zwracam nazwe lekcji i kurs, a karty biore z migration data, ale czy da sie inaczej?
  importLesson(importLessonData: ImportLessonData) {
    const lesson: Lesson = {
      id: this.idGenerator.nextIdForLessons(),
      name: importLessonData.newLessonName,
      lastLearningDate: new Date(),
      nextSuggestedLearningDate: new Date(),
      noMistakeInARow: 0,
      cardIds: [],
    }
    this.store.dispatch(addLesson({lesson: lesson, course: importLessonData.course}))

    const cards: Card[] = Object.values(this.migrationData.cards).map(card => {
      return {
        id: this.idGenerator.nextIdForCards(),
        question: card.question,
        answer: card.answer
      }
    })
    this.store.dispatch(addCards({cards: cards, lesson: lesson}))
  }

  private getImportTitle(type: DataType): string {
    if (type == DataType.LESSON) {
      return this.lessonImportTitle;
    }
    else if (type == DataType.COURSE) {
      return this.courseImportTitle;
    }
    return "";
  }

  private getSummaryData(migrationData: MigrationData, type: DataType): ImportSummaryData {
    if (type == DataType.LESSON) {
      return {
        entityName: migrationData.lessons[0].name,
      }
    }
    else if (type == DataType.COURSE) {
      return {
        entityName: migrationData.lessons[0].name, // todo wziac nazwe z kursu
      }
    }
    throw new TypeError("Illegal data type during import")
  }

  importTabLabel: string = CONFIG.LABELS.importSummary;
  previewTabLabel: string = CONFIG.LABELS.importPreview;
  lessonImportTitle: string = CONFIG.LABELS.importLesson;
  courseImportTitle: string = CONFIG.LABELS.importCourse;
}

export interface ImportSummaryData {
  entityName: string
}