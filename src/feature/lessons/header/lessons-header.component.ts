import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from '../../../app/app.properties';
import { Store } from '@ngrx/store';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { Course } from '../../../data/model/course';
import { removeCourse } from '../../../data/store/courses/courses.action';

@Component({
  selector: 'app-lessons-header',
  templateUrl: './lessons-header.component.html',
  styleUrl: './lessons-header.component.scss'
})
export class LessonsHeaderComponent implements OnInit {
  course: Course;

  constructor(private location: Location, private router: Router, 
    private route: ActivatedRoute, private store: Store) {
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
    this.store.dispatch(removeCourse({course: this.course, lessonIds: this.course.lessonIds}));
    this.location.back();
    // todo confirmation dialog
  }
  
  title: string = CONFIG.LABELS.course;
  removeCourseLabel: string = CONFIG.LABELS.removeCourse;
}
