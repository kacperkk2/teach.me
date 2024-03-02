import { Injectable } from '@angular/core';
import { Course } from '../../data/model/course';
import { Lesson } from '../../data/model/lesson';
import { Card } from '../../data/model/card';

@Injectable({
  providedIn: 'root'
})
export class IdGeneratorService {

  idHolder: IdHolder = {
    courses: 0,
    lessons: 0,
    cards: 0,
  };

  constructor() { }

  public nextIdForCourses() {
    return this.idHolder.courses++;
  }

  public nextIdForLessons() {
    return this.idHolder.lessons++;
  }

  public nextIdForCards() {
    return this.idHolder.cards++;
  }

  public loadCoursesIds(courses: Course[]) {
    if (courses.length == 0) {
      return;
    }
    this.idHolder.courses = Math.max(...courses.map(course => course.id)) + 1;
  }

  public loadLessonsIds(lessons: Lesson[]) {
    if (lessons.length == 0) {
      return;
    }
    this.idHolder.lessons = Math.max(...lessons.map(lesson => lesson.id)) + 1;
  }

  public loadCardsIds(cards: Card[]) {
    if (cards.length == 0) {
      return;
    }
    this.idHolder.cards = Math.max(...cards.map(card => card.id)) + 1;
  }
}

export interface IdHolder {
  courses: number,
  lessons: number,
  cards: number,
}
