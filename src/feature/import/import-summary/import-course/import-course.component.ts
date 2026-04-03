import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { CONFIG } from '../../../../app/app.properties';
import { ImportSummaryData } from '../../import.component';
import { Router } from '@angular/router';
import { LessonMigration } from '../../../../data/model/lesson';
import { selectCoursesList } from '../../../../data/store/courses/courses.selector';

@Component({
  selector: 'app-import-course',
  templateUrl: './import-course.component.html',
  styleUrl: './import-course.component.scss'
})
export class ImportCourseComponent {
  @Input({required: true}) summaryData: ImportSummaryData;
  @Input({required: true}) migrationLessons: LessonMigration[];
  @Output() importCourse = new EventEmitter<ImportCourseData>();

  importForm: FormGroup;
  excludedLessons: LessonMigration[] = [];

  get nameFormControl() {
    return this.importForm.controls["name"] as FormControl;
  }

  get languageFormControl() {
    return this.importForm.controls["language"] as FormControl;
  }

  constructor(private router: Router, private store: Store) {
  }

  ngOnInit(): void {
    this.importForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.maxNameLength)]),
      language: new FormControl(this.summaryData.language ?? ''),
    });
    this.store.select(selectCoursesList).pipe(take(1)).subscribe(courses => {
      const nameExists = courses.some(c => c.name === this.summaryData.entityName);
      this.nameFormControl.patchValue(nameExists ? this.summaryData.entityName + ' Kopia' : this.summaryData.entityName);
    });
  }

  import() {
    this.importCourse.emit({
      newCourseName: this.nameFormControl.value,
      language: this.languageFormControl.value,
      excludedLessons: this.excludedLessons,
    })
    this.router.navigate(['/courses']);
  }

  clearName() {
    this.nameFormControl.patchValue('');
  }

  nameLabel: string = CONFIG.LABELS.courseName;
  maxNameLength = CONFIG.COURSES.nameMaxLength;
}

export interface ImportCourseData {
  newCourseName: string,
  language: string,
  excludedLessons: LessonMigration[],
}
