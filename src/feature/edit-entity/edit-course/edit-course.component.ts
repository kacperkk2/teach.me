import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { Course } from '../../../data/model/course';
import { removeCourse, updateCourse } from '../../../data/store/courses/courses.action';
import { selectCourse } from '../../../data/store/courses/courses.selector';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.scss'
})
export class EditCourseComponent implements OnInit {
  
  course: Course;
  editCourseForm: FormGroup;
  maxLength: number = CONFIG.COURSES.nameMaxLength;

  get nameFormControl() {
    return this.editCourseForm.controls["name"] as FormControl;
  }

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute, private location: Location, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.editCourseForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).subscribe(course => {
        this.course = course;
        this.nameFormControl.patchValue(course.name);
      });
    });
  }

  clearName() {
    this.nameFormControl.patchValue("");
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

  saveCourse() {
    const updatedCourse: Course = {
      id: this.course.id,
      name: this.nameFormControl.value,
      lastLearningDate: this.course.lastLearningDate,
      nextSuggestedLearningDate: this.course.nextSuggestedLearningDate,
      lessonIds: this.course.lessonIds
    }
    this.store.dispatch(updateCourse({course: updatedCourse}));
    this.location.back();
  }

  headerTitle: string = CONFIG.LABELS.editCourse;
  nameLabel: string = CONFIG.LABELS.courseName;
  deleteCourseText: string = CONFIG.LABELS.deleteCourseConfirmation;
}
