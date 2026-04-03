import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { Card } from '../../../data/model/card';
import { Course } from '../../../data/model/course';
import { Lesson } from '../../../data/model/lesson';
import { removeCourse, updateCourse } from '../../../data/store/courses/courses.action';
import { removeLessons } from '../../../data/store/lessons/lessons.action';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { selectCards } from '../../../data/store/cards/cards.selector';
import { selectLessonsByCourseId } from '../../../data/store/lessons/lessons.selector';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.scss'
})
export class EditCourseComponent implements OnInit, OnDestroy {

  course: Course;
  editCourseForm: FormGroup;
  maxLength: number = CONFIG.COURSES.nameMaxLength;
  lessons: Lesson[] = [];
  cards$: Observable<{[id: number]: Card}> = this.store.select(selectCards);
  pendingDeleteLessonIds: Set<number> = new Set();

  private destroy$ = new Subject<void>();

  get nameFormControl() {
    return this.editCourseForm.controls["name"] as FormControl;
  }

  get languageFormControl() {
    return this.editCourseForm.controls["language"] as FormControl;
  }

  isMarkedForDeletion(lesson: Lesson): boolean {
    return this.pendingDeleteLessonIds.has(lesson.id);
  }

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.editCourseForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      language: new FormControl('')
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).pipe(takeUntil(this.destroy$)).subscribe(course => {
        this.course = course;
        this.nameFormControl.patchValue(course.name);
        this.languageFormControl.patchValue(course.language ?? '');
      });
      this.store.select(selectLessonsByCourseId(+courseId)).pipe(takeUntil(this.destroy$)).subscribe(lessons => {
        this.lessons = lessons;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCardsForLesson(lesson: Lesson, cards: {[id: number]: Card}): Card[] {
    return lesson.cardIds.map(id => cards[id]).filter(Boolean);
  }

  clearName() {
    this.nameFormControl.patchValue("");
  }

  toggleLessonDeletion(lesson: Lesson) {
    if (this.pendingDeleteLessonIds.has(lesson.id)) {
      this.pendingDeleteLessonIds.delete(lesson.id);
    } else {
      this.pendingDeleteLessonIds.add(lesson.id);
    }
  }

  removeCourse() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteCourseText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeCourse({course: this.course, lessonIds: this.course.lessonIds}));
          this.router.navigate(['/courses']);
        }
    });
  }

  close() {
    this.router.navigate(['/courses', this.course.id, 'lessons']);
  }

  saveCourse() {
    const lessonsToDelete = this.lessons.filter(l => this.pendingDeleteLessonIds.has(l.id));
    if (lessonsToDelete.length > 0) {
      const allCardIds = lessonsToDelete.flatMap(l => l.cardIds);
      this.store.dispatch(removeLessons({lessons: lessonsToDelete, allCardIds}));
    }

    const remainingLessonIds = this.course.lessonIds.filter(id => !this.pendingDeleteLessonIds.has(id));
    const updatedCourse: Course = {
      id: this.course.id,
      name: this.nameFormControl.value,
      language: this.languageFormControl.value || undefined,
      lastLearningDate: this.course.lastLearningDate,
      nextSuggestedLearningDate: this.course.nextSuggestedLearningDate,
      lessonIds: remainingLessonIds,
      wrongPreviouslyCardIds: this.course.wrongPreviouslyCardIds
    }
    this.store.dispatch(updateCourse({course: updatedCourse}));
    this.router.navigate(['/courses', this.course.id, 'lessons']);
  }

  headerTitle: string = CONFIG.LABELS.manageCourse;
  nameLabel: string = CONFIG.LABELS.courseName;
  deleteCourseText: string = CONFIG.LABELS.deleteCourseConfirmation;
}
