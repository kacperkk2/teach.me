import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { Card } from '../../../data/model/card';
import { Lesson } from '../../../data/model/lesson';
import { removeCard, updateCard } from '../../../data/store/cards/cards.action';
import { selectCard } from '../../../data/store/cards/cards.selector';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { Course } from '../../../data/model/course';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { removeLesson, updateLesson } from '../../../data/store/lessons/lessons.action';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrl: './edit-lesson.component.scss'
})
export class EditLessonComponent implements OnInit {
  
  lesson: Lesson;
  course: Course;
  editLessonForm: FormGroup;
  maxLength: number = CONFIG.LESSONS.nameMaxLength;

  get nameFormControl() {
    return this.editLessonForm.controls["name"] as FormControl;
  }

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute, private location: Location, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.editLessonForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe(params => {
      const lessonId = params['lessonId'];
      const courseId = params['courseId'];
      this.store.select(selectLesson(lessonId)).subscribe(lesson => {
        this.lesson = lesson;
        this.nameFormControl.patchValue(lesson.name);
      });
      this.store.select(selectCourse(courseId)).subscribe(course => {
        this.course = course;
      });
    });
  }

  clearName() {
    this.nameFormControl.patchValue("");
  }

  removeLesson() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteLessonText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeLesson({lesson: this.lesson, cardIds: this.lesson.cardIds, course: this.course}));
          this.location.replaceState('/courses');
          this.router.navigate(['/courses', this.course.id, 'lessons']);
        }
    });
  }

  saveLesson() {
    const updatedLesson: Lesson = {
      id: this.lesson.id,
      name: this.nameFormControl.value,
      lastLearningDate: this.lesson.lastLearningDate,
      nextSuggestedLearningDate: this.lesson.nextSuggestedLearningDate,
      noMistakeInARow: this.lesson.noMistakeInARow,
      cardIds: this.lesson.cardIds,
      wrongPreviouslyCardIds: this.lesson.wrongPreviouslyCardIds,
    }
    this.store.dispatch(updateLesson({lesson: updatedLesson}));
    this.location.back();
  }

  headerTitle: string = CONFIG.LABELS.editLesson;
  nameLabel: string = CONFIG.LABELS.lessonName;
  deleteLessonText: string = CONFIG.LABELS.deleteLessonConfirmation;
}
