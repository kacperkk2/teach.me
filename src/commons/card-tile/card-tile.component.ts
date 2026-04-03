import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-tile',
  templateUrl: './card-tile.component.html',
  styleUrl: './card-tile.component.scss'
})
export class CardTileComponent {

  @Input({required: true}) question: string;
  @Input({required: true}) answer: string;
  @Input() isMarked: boolean = false;
  @Input() language?: string;
  @Output() tileClicked = new EventEmitter();
  @Output() bookmarkClicked = new EventEmitter();
}
