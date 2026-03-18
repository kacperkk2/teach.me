import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../../../data/model/card';

@Component({
  selector: 'app-manage-lesson-tile',
  templateUrl: './manage-lesson-tile.component.html',
  styleUrl: './manage-lesson-tile.component.scss',
  animations: [
    trigger('slideDown', [
      state('collapsed', style({ height: '0px', marginTop: '0px' })),
      state('expanded', style({ height: '*', marginTop: '-15px' })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ])
  ]
})
export class ManageLessonTileComponent {

  @Input({required: true}) name: string;
  @Input({required: true}) cardsCount: number;
  @Input() cards: Card[] = [];
  @Input() markedForDeletion: boolean = false;
  @Output() deleteClicked = new EventEmitter();

  isExpanded = false;

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
