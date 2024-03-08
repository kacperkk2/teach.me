import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '../../../app/app.properties';
import { IdGeneratorService } from '../../../services/id-generator/id-generator.service';
import { Course } from '../../../data/model/course';
import { Store } from '@ngrx/store';
import { addCourse } from '../../../data/store/courses/courses.action';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss'
})
export class AddCourseComponent implements OnInit {
  
  addCourseForm: FormGroup;
  maxLength: number = CONFIG.COURSES.nameMaxLength;

  constructor(private idGenerator: IdGeneratorService, 
    private store: Store, private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.addCourseForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)])
    });
  }

  clear() {
    this.addCourseForm.controls["name"].patchValue("");
  }

  save() {
    const course: Course = {
      id: this.idGenerator.nextIdForCourses(),
      name: this.addCourseForm.controls["name"].value.trim(),
      lastLearningDate: new Date(),
      nextSuggestedLearningDate: new Date(),
      lessonIds: []
    }
    this.store.dispatch(addCourse({course}));
    this.location.back();
  }
  
  headerTitle: string = CONFIG.LABELS.addCourse;
  nameLabel: string = CONFIG.LABELS.courseName;
}
