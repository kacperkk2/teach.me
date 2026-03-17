import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from '../../../data/model/lesson';
import { CONFIG } from '../../../app/app.properties';
import { ScrollService } from '../../../services/scroll/scroll.service';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent implements OnInit {

  @Input({required: true}) lessons: Lesson[];

  constructor(private router: Router, private route: ActivatedRoute, private scrollService: ScrollService) {}

  ngOnInit(): void {
    this.scrollService.setScrolledDown(false);
  }

  onScroll(event: Event): void {
    this.scrollService.setScrolledDown((event.target as HTMLElement).scrollTop > 0);
  }

  navigateToCards(lessonId: number): void {
    this.router.navigate([lessonId, 'cards'], { relativeTo: this.route });
  }

  emptyLessonsLabel: string = CONFIG.LABELS.emptyLessons;
  emptyLessonsSubLabel: string = CONFIG.LABELS.emptyLessonsSub;
}
