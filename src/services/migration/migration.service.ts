import { Injectable } from '@angular/core';
import { CONFIG } from '../../app/app.properties';
import { Card, CardMigration } from '../../data/model/card';
import { Lesson, LessonMigration } from '../../data/model/lesson';
import { CodecService } from '../codec/codec.service';
import { UrlShortenerService } from '../urlshortener/url-shortener.service';
import { Course, CourseMigration } from '../../data/model/course';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  importPath: string = CONFIG.IMPORT.importPath;
  appRoot: string = CONFIG.IMPORT.appRoot;
  dataParam: string = CONFIG.IMPORT.dataParam;

  constructor(private codec: CodecService, private urlShortener: UrlShortenerService) { }

  // todo przekazac tylko lessonId (ale wtedy trzeba by tu zwracac z subscribe)
  lessonToUrl(lesson: Lesson, cards: Card[]) {
    // todo fetch lesson
    const data: LessonMigration[] = this.prepareForLessonsMigration([lesson], cards);
    const compressedEncoded = this.codec.pack(data, DataType.LESSON);
    return this.getImportUrl(compressedEncoded);
  }

  // todo przekazac tylko courseId (ale wtedy trzeba by tu zwracac z subscribe)
  courseToUrl(course: Course, lessons: Lesson[], cards: Card[]) {
    // todo fetch lessons i cards
    const data: CourseMigration[] = this.prepareForCoursesMigration([course], lessons, cards);
    const compressedEncoded = this.codec.pack(data, DataType.COURSE);
    return this.getImportUrl(compressedEncoded);
  }

  private getImportUrl(data: any): string {
    const longUrl = this.buildImportLongUrl(data);
    return longUrl;
  }

  private buildImportLongUrl(data: any) {
    return location.origin + this.appRoot + this.importPath + "?" + this.dataParam + "=" + data;
  }

  private prepareForCoursesMigration(courses: Course[], lessons: Lesson[], cards: Card[]): CourseMigration[] {
    const lessonsMap = this.buildLessonsMap(lessons);
    const cardsMap = this.buildCardsMap(cards);

    return courses.map(course => {
      const courseLessonsMigration: LessonMigration[] = course.lessonIds.map(lessonId => {
        const lesson: Lesson = lessonsMap[lessonId];
        const lessonCardsMigration: CardMigration[] = lesson.cardIds.map(cardId => {
          return mapCardToCardMigration(cardsMap[cardId]);
        })
        return mapLessonToLessonMigration(lesson, lessonCardsMigration);
      })
      return mapCourseToCourseMigration(course, courseLessonsMigration);
    });
  }

  private prepareForLessonsMigration(lessons: Lesson[], cards: Card[]): LessonMigration[] {
    const cardsMap = this.buildCardsMap(cards);
    
    return lessons.map(lesson => {
      const lessonCardsMigration: CardMigration[] = lesson.cardIds.map(cardId => {
        return mapCardToCardMigration(cardsMap[cardId]);
      })
      return mapLessonToLessonMigration(lesson, lessonCardsMigration);
    });
  }

  private buildLessonsMap(lessons: Lesson[]) {
    return lessons.reduce((acc: { [id: number]: Lesson }, lesson) => {
      acc[lesson.id] = lesson;
      return acc;
    }, {});
  }

  private buildCardsMap(cards: Card[]) {
    return cards.reduce((acc: { [id: number]: Card }, card) => {
      acc[card.id] = card;
      return acc;
    }, {});
  }
}

export interface MigrationDataWrapper {
  data: string,
  type: DataType
}

export enum DataType {
  LESSON, COURSE
}

export function mapCourseToCourseMigration(course: Course, lessonsMigration: LessonMigration[]): CourseMigration {
  return {
    name: course.name,
    lessons: lessonsMigration
  }
}

export function mapLessonToLessonMigration(lesson: Lesson, cardsMigration: CardMigration[]): LessonMigration {
  return {
    name: lesson.name,
    cards: cardsMigration
  }
}

export function mapCardToCardMigration(card: Card): CardMigration {
  return {
    question: card.question,
    answer: card.answer,
  }
}