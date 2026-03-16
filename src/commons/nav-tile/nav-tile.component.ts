import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-nav-tile',
  templateUrl: './nav-tile.component.html',
  styleUrl: './nav-tile.component.scss'
})
export class NavTileComponent {

  @Input({required: true}) name: string;
  @Input({required: true}) cardsCount: number;
  @Input() lessonsCount: number | null = null;
  @Output() tileClicked = new EventEmitter();
}
