import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Lesson } from '../../../data/model/lesson';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CONFIG } from '../../../app/app.properties';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Course } from '../../../data/model/course';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { updateCourse } from '../../../data/store/courses/courses.action';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-lessons-reorder',
  templateUrl: './lessons-reorder.component.html',
  styleUrl: './lessons-reorder.component.scss'
})
export class LessonsReorderComponent implements OnInit, OnDestroy {

  @Input({required: true}) lessons: Lesson[];
  @Output() reorderFinished = new EventEmitter();

  course: Course;
  reorderedLessons: Lesson[];

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    this.reorderedLessons = [...this.lessons];
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).pipe(takeUntil(this.destroy$)).subscribe(course => this.course = course);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.reorderedLessons, event.previousIndex, event.currentIndex);
  }

  abort() {
    this.reorderFinished.emit();
  }

  save() {
    const updatedCourse: Course = Object.assign({}, this.course);
    updatedCourse.lessonIds = this.reorderedLessons.map(lesson => lesson.id);
    this.store.dispatch(updateCourse({course: updatedCourse}));
    this.reorderFinished.emit();
  }

  title: string = CONFIG.LABELS.editOrder;
  saveLabel: string = CONFIG.LABELS.save;
}
