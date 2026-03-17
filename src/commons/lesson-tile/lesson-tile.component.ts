import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../data/model/card';

@Component({
  selector: 'app-lesson-tile',
  templateUrl: './lesson-tile.component.html',
  styleUrl: './lesson-tile.component.scss',
  animations: [
    trigger('slideDown', [
      state('collapsed', style({ height: '0px', marginTop: '0px' })),
      state('expanded', style({ height: '*', marginTop: '-15px' })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ])
  ]
})
export class LessonTileComponent {

  @Input({required: true}) name: string;
  @Input({required: true}) cardsCount: number;
  @Input() cards: Card[] = [];
  @Output() tileClicked = new EventEmitter();

  isExpanded = false;

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
