import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Course } from '../../../data/model/course';
import { Lesson } from '../../../data/model/lesson';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { addLesson } from '../../../data/store/lessons/lessons.action';
import { IdGeneratorService } from '../../../services/id-generator/id-generator.service';
import { Location } from '@angular/common';
import { CONFIG } from '../../../app/app.properties';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrl: './add-lesson.component.scss'
})
export class AddLessonComponent implements OnInit {
  
  addLessonForm: FormGroup;
  maxLength: number = CONFIG.COURSES.nameMaxLength;
  course: Course;

  constructor(private idGenerator: IdGeneratorService, 
    private store: Store, private router: Router, 
    private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).subscribe(course => {
        this.course = course;
      });
    });
    this.addLessonForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)])
    });
  }

  clear() {
    this.addLessonForm.controls["name"].patchValue("");
  }

  save() {
    const lessonId = this.idGenerator.nextIdForLessons();
    const lesson: Lesson = {
      id: lessonId,
      name: this.addLessonForm.controls["name"].value,
      lastLearningDate: new Date(),
      nextSuggestedLearningDate: new Date(),
      noMistakeInARow: 0,
      cardIds: [],
    }
    this.store.dispatch(addLesson({lesson: lesson, course: this.course}));
    this.location.back();
  }
  
  headerTitle: string = CONFIG.LABELS.addLesson;
}
