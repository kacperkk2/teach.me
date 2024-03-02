import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Lesson } from '../../../data/model/lesson';
import { selectLessonsByCourseId } from '../../../data/store/lessons/lessons.selector';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent implements OnInit {

  lessons$: Observable<Lesson[]>;

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
    // todo: sprobowac inicjalizowac moze dopiero jak sie wejdzie w zakladke
    // problem polega na tym ze jak kasuje kursy to tu przez chwile jeszcze odwoluje sie do courseId 
    // i pod spodem wyciaga kurs po courseId
    console.log("init list lessons")
    this.route.params.subscribe(params => {
      const courseId = params['courseId']
      this.lessons$ = this.store.select(selectLessonsByCourseId(courseId));
      // this.course$ = this.store.select(selectCourse(courseId));
   });
  }

  ngOnDestroy() {
    console.log("destroy")
  }
}
