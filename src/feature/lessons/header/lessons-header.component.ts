import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from '../../../app/app.properties';
import { Store } from '@ngrx/store';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { Course } from '../../../data/model/course';
import { removeCourse } from '../../../data/store/courses/courses.action';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lessons-header',
  templateUrl: './lessons-header.component.html',
  styleUrl: './lessons-header.component.scss'
})
export class LessonsHeaderComponent implements OnInit {
  course: Course;

  constructor(private location: Location, private router: Router, 
    private route: ActivatedRoute, private store: Store, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).subscribe(course => {
        this.course = course;
      });
    });
  }

  back() {
    this.location.back();
  }

  removeCourseClicked() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteLessonText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeCourse({course: this.course, lessonIds: this.course.lessonIds}));
          this.location.back();
        }
    });
  }

  editCourseClicked() {
    this.router.navigate(['/courses', this.course.id]);
  }
  
  title: string = CONFIG.LABELS.course;
  removeCourseLabel: string = CONFIG.LABELS.removeCourse;
  editCourseLabel: string = CONFIG.LABELS.editCourse;
  deleteLessonText: string = CONFIG.LABELS.deleteLessonConfirmation;
}
