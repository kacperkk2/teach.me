import { Component, Input } from '@angular/core';
import { Lesson } from '../../../data/model/lesson';
import { CONFIG } from '../../../app/app.properties';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent {

  @Input({required: true}) lessons: Lesson[];

  emptyLessonsLabel: string = CONFIG.LABELS.emptyLessons;
  emptyLessonsSubLabel: string = CONFIG.LABELS.emptyLessonsSub;
}
