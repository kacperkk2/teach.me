import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '../../../app/app.properties';
import { IdGeneratorService } from '../../../services/id-generator/id-generator.service';
import { Course } from '../../../data/model/course';
import { Store } from '@ngrx/store';
import { addCourse } from '../../../data/store/courses/courses.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss'
})
export class AddCourseComponent implements OnInit, AfterViewInit {

  addCourseForm: FormGroup;
  maxLength: number = CONFIG.COURSES.nameMaxLength;
  @ViewChild('nameInput') nameInput: ElementRef;

  constructor(private idGenerator: IdGeneratorService,
    private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.addCourseForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)])
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.nameInput.nativeElement.focus());
  }

  close() {
    this.router.navigate(['/courses']);
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
      lessonIds: [],
      wrongPreviouslyCardIds: []
    }
    this.store.dispatch(addCourse({course}));
    this.router.navigate(['/courses', course.id, 'lessons'], { replaceUrl: true });
  }
  
  headerTitle: string = CONFIG.LABELS.addCourse;
  nameLabel: string = CONFIG.LABELS.courseName;
}
