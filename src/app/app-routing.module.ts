import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCardComponent } from '../feature/add-entity/add-card/add-card.component';
import { AddCourseComponent } from '../feature/add-entity/add-course/add-course.component';
import { AddLessonComponent } from '../feature/add-entity/add-lesson/add-lesson.component';
import { CardsComponent } from '../feature/cards/cards.component';
import { CoursesComponent } from '../feature/courses/courses.component';
import { EditCardComponent } from '../feature/edit-entity/edit-card/edit-card.component';
import { EditCourseComponent } from '../feature/edit-entity/edit-course/edit-course.component';
import { EditLessonComponent } from '../feature/edit-entity/edit-lesson/edit-lesson.component';
import { ImportComponent } from '../feature/import/import.component';
import { LessonsComponent } from '../feature/lessons/lessons.component';

const routes: Routes = [
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/new', component: AddCourseComponent },
  { path: 'courses/:courseId', component: EditCourseComponent },
  { path: 'courses/:courseId/lessons', component: LessonsComponent },
  { path: 'courses/:courseId/lessons/new', component: AddLessonComponent },
  { path: 'courses/:courseId/lessons/:lessonId', component: EditLessonComponent },
  { path: 'courses/:courseId/lessons/:lessonId/cards', component: CardsComponent },
  { path: 'courses/:courseId/lessons/:lessonId/cards/new', component: AddCardComponent },
  { path: 'courses/:courseId/lessons/:lessonId/cards/:cardId', component: EditCardComponent },
  { path: 'import', component: ImportComponent },
  { path: '**', redirectTo: 'courses', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
