import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrl: './course-tile.component.scss'
})
export class CourseTileComponent {

  @Input({required: true}) name: string;
  @Input({required: true}) cardsCount: number;
  @Input() lessonsCount: number | null = null;
  @Output() tileClicked = new EventEmitter();
}
