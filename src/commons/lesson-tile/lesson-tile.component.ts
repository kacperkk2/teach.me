import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-lesson-tile',
  templateUrl: './lesson-tile.component.html',
  styleUrl: './lesson-tile.component.scss'
})
export class LessonTileComponent {

  @Input({required: true}) name: string;
  @Input({required: true}) cardsCount: number;
  @Output() tileClicked = new EventEmitter();
}
