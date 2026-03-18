import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-manage-card-tile',
  templateUrl: './manage-card-tile.component.html',
  styleUrl: './manage-card-tile.component.scss'
})
export class ManageCardTileComponent {

  @Input({required: true}) question: string;
  @Input({required: true}) answer: string;
  @Input() markedForDeletion: boolean = false;
  @Output() deleteClicked = new EventEmitter();
}
