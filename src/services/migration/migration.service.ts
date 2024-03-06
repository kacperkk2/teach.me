import { Injectable } from '@angular/core';
import { CONFIG } from '../../app/app.properties';
import { Lesson } from '../../data/model/lesson';
import { CodecService } from '../codec/codec.service';
import { UrlShortenerService } from '../urlshortener/url-shortener.service';
import { Card } from '../../data/model/card';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  importPath: string = CONFIG.IMPORT.importPath;
  appRoot: string = CONFIG.IMPORT.appRoot;
  dataParam: string = CONFIG.IMPORT.dataParam;

  constructor(private codec: CodecService, private urlShortener: UrlShortenerService) { }

  // todo przekazac tylko lessonId
  lessonToUrl(lesson: Lesson, cards: Card[]) {
    // todo fetch lesson
    const data: MigrationData = this.createMigrationData(lesson, cards);
    const compressedEncoded = this.codec.pack(data, DataType.LESSON);
    return this.getImportUrl(compressedEncoded);
  }

  private getImportUrl(data: any): string {
    const longUrl = this.buildImportLongUrl(data);
    return longUrl;
  }   

  private buildImportLongUrl(data: any) {
    return location.origin + this.appRoot + this.importPath + "?" + this.dataParam + "=" + data;
  }

  private createMigrationData(lesson: Lesson, cards: Card[]): MigrationData {
    return {
      lessons: {[lesson.id]: lesson},
      cards: cards.reduce((acc: { [id: number]: Card }, card) => {
        acc[card.id] = card;
        return acc;
      }, {})
    }
  }
}

export interface MigrationData {
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