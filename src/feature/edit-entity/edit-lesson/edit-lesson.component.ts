import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { Card } from '../../../data/model/card';
import { Lesson } from '../../../data/model/lesson';
import { Course } from '../../../data/model/course';
import { removeLesson, updateLesson } from '../../../data/store/lessons/lessons.action';
import { removeCards } from '../../../data/store/cards/cards.action';
import { selectCardsByLessonId } from '../../../data/store/cards/cards.selector';
import { Subject, takeUntil } from 'rxjs';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { selectCourse } from '../../../data/store/courses/courses.selector';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrl: './edit-lesson.component.scss'
})
export class EditLessonComponent implements OnInit, OnDestroy {

  lesson: Lesson;
  course: Course;
  editLessonForm: FormGroup;
  maxLength: number = CONFIG.LESSONS.nameMaxLength;
  cards: Card[] = [];
  pendingDeleteCardIds: Set<number> = new Set();

  private destroy$ = new Subject<void>();

  get nameFormControl() {
    return this.editLessonForm.controls["name"] as FormControl;
  }

  isMarkedForDeletion(card: Card): boolean {
    return this.pendingDeleteCardIds.has(card.id);
  }

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.editLessonForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const lessonId = params['lessonId'];
      const courseId = params['courseId'];
      this.store.select(selectLesson(lessonId)).pipe(takeUntil(this.destroy$)).subscribe(lesson => {
        this.lesson = lesson;
        this.nameFormControl.patchValue(lesson.name);
      });
      this.store.select(selectCourse(courseId)).pipe(takeUntil(this.destroy$)).subscribe(course => {
        this.course = course;
      });
      this.store.select(selectCardsByLessonId(+lessonId)).pipe(takeUntil(this.destroy$)).subscribe(cards => {
        this.cards = cards;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearName() {
    this.nameFormControl.patchValue("");
  }

  toggleCardDeletion(card: Card) {
    if (this.pendingDeleteCardIds.has(card.id)) {
      this.pendingDeleteCardIds.delete(card.id);
    } else {
      this.pendingDeleteCardIds.add(card.id);
    }
  }

  removeLesson() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteLessonText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeLesson({lesson: this.lesson, cardIds: this.lesson.cardIds, course: this.course}));
          this.router.navigate(['/courses', this.course.id, 'lessons']);
        }
    });
  }

  close() {
    this.router.navigate(['/courses', this.course.id, 'lessons', this.lesson.id, 'cards']);
  }

  saveLesson() {
    const cardsToDelete = this.cards.filter(c => this.pendingDeleteCardIds.has(c.id));
    if (cardsToDelete.length > 0) {
      this.store.dispatch(removeCards({cards: cardsToDelete}));
    }

    const updatedLesson: Lesson = {
      id: this.lesson.id,
      name: this.nameFormControl.value,
      lastLearningDate: this.lesson.lastLearningDate,
      nextSuggestedLearningDate: this.lesson.nextSuggestedLearningDate,
      noMistakeInARow: this.lesson.noMistakeInARow,
      cardIds: this.lesson.cardIds.filter(id => !this.pendingDeleteCardIds.has(id)),
      wrongPreviouslyCardIds: this.lesson.wrongPreviouslyCardIds.filter(id => !this.pendingDeleteCardIds.has(id)),
    }
    this.store.dispatch(updateLesson({lesson: updatedLesson}));
    this.router.navigate(['/courses', this.course.id, 'lessons', this.lesson.id, 'cards']);
  }

  headerTitle: string = CONFIG.LABELS.manageLesson;
  nameLabel: string = CONFIG.LABELS.lessonName;
  deleteLessonText: string = CONFIG.LABELS.deleteLessonConfirmation;
}
