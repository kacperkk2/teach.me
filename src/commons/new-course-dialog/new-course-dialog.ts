import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CONFIG } from '../../app/app.properties';
import { IdGeneratorService } from '../../services/id-generator/id-generator.service';
import { Store } from '@ngrx/store';
import { Course } from '../../data/model/course';
import { addCourse } from '../../data/store/courses/courses.action';

@Component({
  selector: 'new-course-dialog',
  templateUrl: 'new-course-dialog.html',
  styleUrl: './new-course-dialog.scss'
})
export class NewCourseDialog {
  addCourseForm: FormGroup;
  maxLength: number = CONFIG.COURSES.nameMaxLength;
  
  get nameFormControl() {
    return this.addCourseForm.controls["name"] as FormControl;
  }

  constructor(
      public dialogRef: MatDialogRef<NewCourseDialog>,
      private idGenerator: IdGeneratorService,
      private store: Store
      ) {}

  ngOnInit(): void {
    this.addCourseForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)])
    });
  }

  clear() {
    this.nameFormControl.patchValue("");
  }

  save() {
    const course: Course = {
      id: this.idGenerator.nextIdForCourses(),
      name: this.nameFormControl.value.trim(),
      lastLearningDate: new Date(),
      nextSuggestedLearningDate: new Date(),
      lessonIds: []
    }
    this.store.dispatch(addCourse({course}));
    this.dialogRef.close();
  }

  nameLabel: string = CONFIG.LABELS.newCourseName;
}