import { Injectable } from '@angular/core';
import { CONFIG } from '../../app/app.properties';
import { Card } from '../../data/model/card';
import { Lesson } from '../../data/model/lesson';
import { CodecService } from '../codec/codec.service';
import { UrlShortenerService } from '../urlshortener/url-shortener.service';
import { Course } from '../../data/model/course';

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
    const data: MigrationData = this.createMigrationData([], [lesson], cards);
    const compressedEncoded = this.codec.pack(data, DataType.LESSON);
    return this.getImportUrl(compressedEncoded);
  }

  // todo przekazac tylko courseId (ale wtedy trzeba by tu zwracac z subscribe)
  courseToUrl(course: Course, lessons: Lesson[], cards: Card[]) {
    // todo fetch lessons i cards
    const data: MigrationData = this.createMigrationData([course], lessons, cards);
    console.log('courseToUrl', data)
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

  private createMigrationData(courses: Course[], lessons: Lesson[], cards: Card[]): MigrationData {
    return {
      courses: courses.reduce((acc: { [id: number]: Course }, course) => {
        acc[course.id] = course;
        return acc;
      }, {}),
      lessons: lessons.reduce((acc: { [id: number]: Lesson }, lesson) => {
        acc[lesson.id] = lesson;
        return acc;
      }, {}),
      cards: cards.reduce((acc: { [id: number]: Card }, card) => {
        acc[card.id] = card;
        return acc;
      }, {})
    }
  }
}

// todo - czy nie latwiejsza struktura by byla drzewiasta? latwiej wyswietlic i pozniej dodac do store?
export interface MigrationData {
  courses: { [key: number]: Course },
  lessons: { [key: number]: Lesson },
  cards: { [key: number]: Card },
}

export interface MigrationDataWrapper {
  data: string,
  type: DataType
}

export enum DataType {
  LESSON, COURSE
}