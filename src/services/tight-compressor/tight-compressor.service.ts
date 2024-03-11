import { Injectable } from '@angular/core';
import { CardMigration } from '../../data/model/card';
import { CourseMigration } from '../../data/model/course';
import { LessonMigration } from '../../data/model/lesson';
import { DataType } from '../migration/migration.service';

@Injectable({
  providedIn: 'root'
})
export class TightCompressorService {

  courseInternalSeparator: string = '!@';
  courseExternalSeparator: string = '@#';

  lessonInternalSeparator: string = '#$';
  lessonExternalSeparator: string = '$%';

  cardInternalSeparator: string = '%^';
  cardExternalSeparator: string = '^&';

  constructor() { }

  compress(data: any, type: DataType): string {
    if (type == DataType.COURSE) {
      return this.compressCourses(data);
    }
    else if (type == DataType.LESSON) {
      return this.compressLessons(data);
    }
    else {
      throw new TypeError("Illegal data type during export")
    }
  }

  decompress(data: string, type: DataType): any {
    if (type == DataType.COURSE) {
      return this.decompressCourses(data);
    }
    else if (type == DataType.LESSON) {
      return this.decompressLessons(data);
    }
    else {
      throw new TypeError("Illegal data type during export")
    }
  }

  compressCourses(courses: CourseMigration[]): string {
    const compressedCourses = courses.map(course => {
      return course.name + this.courseInternalSeparator + this.compressLessons(course.lessons)
    })
    return compressedCourses.join(this.courseExternalSeparator);
  }

  decompressCourses(courses: string): CourseMigration[] {
    return courses.split(this.courseExternalSeparator).map(course => {
      return {
        name: course.split(this.courseInternalSeparator)[0],
        lessons: this.decompressLessons(course.split(this.courseInternalSeparator)[1])
      }
    })
  }

  compressLessons(lessons: LessonMigration[]): string {
    const compressedLessons = lessons.map(lesson => {
      return lesson.name + this.lessonInternalSeparator + this.compressCards(lesson.cards)
    })
    return compressedLessons.join(this.lessonExternalSeparator);
  }

  decompressLessons(lessons: string): LessonMigration[] {
    return lessons.split(this.lessonExternalSeparator).map(lesson => {
      return {
        name: lesson.split(this.lessonInternalSeparator)[0],
        cards: this.decompressCards(lesson.split(this.lessonInternalSeparator)[1])
      }
    })
  }

  compressCards(cards: CardMigration[]): string {
    const compressedCards = cards.map(card => {
      return card.question + this.cardInternalSeparator + card.answer
    })
    return compressedCards.join(this.cardExternalSeparator);
  }

  decompressCards(cards: string): CardMigration[] {
    return cards.split(this.cardExternalSeparator).map(card => {
      return {
        question: card.split(this.cardInternalSeparator)[0],
        answer: card.split(this.cardInternalSeparator)[1],
      }
    })
  }

  // decompress(data: string): MigrationData {

  // }
}
