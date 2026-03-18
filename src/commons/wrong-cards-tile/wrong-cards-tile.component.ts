import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-wrong-cards-tile',
  templateUrl: './wrong-cards-tile.component.html',
  styleUrl: './wrong-cards-tile.component.scss'
})
export class WrongCardsTileComponent {

  @Input({required: true}) wrongCardsCount: number;
  @Output() wrongClicked = new EventEmitter();
}
