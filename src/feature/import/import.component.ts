import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../app/app.properties';
import { Card } from '../../data/model/card';
import { Lesson } from '../../data/model/lesson';
import { addCards } from '../../data/store/cards/cards.action';
import { addLesson, addLessons } from '../../data/store/lessons/lessons.action';
import { CodecService } from '../../services/codec/codec.service';
import { IdGeneratorService } from '../../services/id-generator/id-generator.service';
import { DataType, MigrationData } from '../../services/migration/migration.service';
import { ImportLessonData } from './import-summary/import-lesson/import-lesson.component';
import { ImportCourseData } from './import-summary/import-course/import-course.component';
import { Course } from '../../data/model/course';
import { addCourse } from '../../data/store/courses/courses.action';

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
  isImportFail: boolean = false;

  constructor(private codec: CodecService, private route: ActivatedRoute, 
    private store: Store, private idGenerator: IdGeneratorService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const data = params['data'];
      const migrationDataWrapper = this.codec.unpack(data);
      this.migrationType = migrationDataWrapper.type;
      this.migrationData = JSON.parse(migrationDataWrapper.data || '{}');
      if (Object.keys(this.migrationData).length == 0) {
        this.importFailed();
        return;
      }
      this.summaryData = this.getSummaryData(this.migrationData, this.migrationType);
      // todo zabezpieczyc sie na mozliwosc zlych danych po rozpakowaniu, wtedy widok ze dane popsute i tylko krzyzyk
      this.importTitle = this.getImportTitle(this.migrationType);
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

  // todo w kazdym elemencie parent id, wtedy uproscic add (nie beda lancuchami, tylko save obiektu ktory przychodzi)
  importCourse(importCourseData: ImportCourseData) {
    const course: Course = {
      id: this.idGenerator.nextIdForCourses(),
      name: importCourseData.newCourseName,
      lastLearningDate: new Date(),
      nextSuggestedLearningDate: new Date(),
      lessonIds: []
    }
    this.store.dispatch(addCourse({course: course}))

    let lessonToCards = new Map<Lesson, Card[]>();

    Object.values(this.migrationData.lessons).forEach(migratedDataLesson => {
      const cards: Card[] = migratedDataLesson.cardIds.map(cardId => {
        return {
          id: this.idGenerator.nextIdForCards(),
          question: this.migrationData.cards[cardId].question,
          answer: this.migrationData.cards[cardId].answer
        }
      })
      const lesson: Lesson = {
        id: this.idGenerator.nextIdForLessons(),
        name: migratedDataLesson.name,
        lastLearningDate: new Date(),
        nextSuggestedLearningDate: new Date(),
        noMistakeInARow: 0,
        cardIds: []
      }
      lessonToCards.set(lesson, cards);
    })

    this.store.dispatch(addLessons({lessons: Array.from(lessonToCards.keys()), course: course}))
    lessonToCards.forEach((value: Card[], key: Lesson) => {
      this.store.dispatch(addCards({cards: value, lesson: key})) 
    });
  }

  importFailed() {
    this.isImportFail = true;
    this.importTitle = this.importFailedTitle;
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
        entityName: Object.values(migrationData.lessons)[0].name,
      }
    }
    else if (type == DataType.COURSE) {
      return {
        entityName: Object.values(migrationData.courses)[0].name,
      }
    }
    throw new TypeError("Illegal data type during import")
  }

  importTabLabel: string = CONFIG.LABELS.importSummary;
  previewTabLabel: string = CONFIG.LABELS.importPreview;
  lessonImportTitle: string = CONFIG.LABELS.importLesson;
  courseImportTitle: string = CONFIG.LABELS.importCourse;
  importFailedTitle: string = CONFIG.LABELS.importFailed;
  importFailedReason: string = CONFIG.LABELS.importFailedReason;
  importFailedDescription: string = CONFIG.LABELS.importFailedDescription;
}

export interface ImportSummaryData {
  entityName: string
}