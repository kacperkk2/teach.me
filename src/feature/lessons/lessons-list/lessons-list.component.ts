import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from '../../../data/model/lesson';
import { CONFIG } from '../../../app/app.properties';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent {

  @Input({required: true}) lessons: Lesson[];

  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateToCards(lessonId: number): void {
    this.router.navigate([lessonId, 'cards'], { relativeTo: this.route });
  }

  emptyLessonsLabel: string = CONFIG.LABELS.emptyLessons;
  emptyLessonsSubLabel: string = CONFIG.LABELS.emptyLessonsSub;
}
