import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lesson } from '../../../../data/model/lesson';

@Component({
  selector: 'app-manage-card-tile',
  templateUrl: './manage-card-tile.component.html',
  styleUrl: './manage-card-tile.component.scss',
  animations: [
    trigger('slideDown', [
      state('collapsed', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('200ms ease-in-out'))
    ])
  ]
})
export class ManageCardTileComponent {

  @Input({required: true}) question: string;
  @Input({required: true}) answer: string;
  @Input() markedForDeletion: boolean = false;
  @Input() markedForMove: boolean = false;
  @Input() availableLessons: Lesson[] = [];
  @Input() selectedMoveTargetId: number | null = null;
  @Output() deleteClicked = new EventEmitter();
  @Output() moveClicked = new EventEmitter();
  @Output() moveTargetSelected = new EventEmitter<number>();
}
