import { Component, Input } from '@angular/core';
import { Lesson } from '../../../data/model/lesson';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrl: './lessons-list.component.scss'
})
export class LessonsListComponent {

  @Input({required: true}) lessons: Lesson[];
}
