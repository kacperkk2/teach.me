import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CONFIG } from '../../../../app/app.properties';
import { Course } from '../../../../data/model/course';
import { selectCoursesList } from '../../../../data/store/courses/courses.selector';
import { ImportSummaryData } from '../../import.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-lesson',
  templateUrl: './import-lesson.component.html',
  styleUrl: './import-lesson.component.scss'
})
export class ImportLessonComponent implements OnInit {
  @Input({required: true}) summaryData: ImportSummaryData;
  @Output() importLesson = new EventEmitter<ImportLessonData>();

  importForm: FormGroup;
  courses$: Observable<Course[]>;

  get nameFormControl() {
    return this.importForm.controls["name"] as FormControl;
  }

  get courseFormControl() {
    return this.importForm.controls["course"] as FormControl;
  }

  constructor(private store: Store, private router: Router) {

  }

  ngOnInit(): void {
    this.importForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.maxNameLength)]),
      course: new FormControl('', [Validators.required])
    });
    this.nameFormControl.patchValue(this.summaryData.entityName);
    this.courses$ = this.store.select(selectCoursesList);
  }

  // TODO ZROBIC DIALOG NA DODAWANIE NOWEGO KURSU

  import() {
    this.importLesson.emit({
      newLessonName: this.nameFormControl.value,
      course: this.courseFormControl.value
    })
    this.router.navigate(['/courses']);
  }

  clearName() {
    this.nameFormControl.patchValue('');
  }

  nameLabel: string = CONFIG.LABELS.lessonName;
  maxNameLength = CONFIG.LESSONS.nameMaxLength;
}

export interface ImportLessonData {
  newLessonName: string,
  course: Course
}