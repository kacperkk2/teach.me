import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '../../../../app/app.properties';
import { ImportSummaryData } from '../../import.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-course',
  templateUrl: './import-course.component.html',
  styleUrl: './import-course.component.scss'
})
export class ImportCourseComponent {
  @Input({required: true}) summaryData: ImportSummaryData;
  @Output() importCourse = new EventEmitter<ImportCourseData>();

  importForm: FormGroup;

  get nameFormControl() {
    return this.importForm.controls["name"] as FormControl;
  }

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.importForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.maxNameLength)]),
    });
    this.nameFormControl.patchValue(this.summaryData.entityName);
  }

  import() {
    this.importCourse.emit({
      newCourseName: this.nameFormControl.value,
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
}