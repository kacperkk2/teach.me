import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quick-learn-tile',
  templateUrl: './quick-learn-tile.component.html',
  styleUrl: './quick-learn-tile.component.scss'
})
export class QuickLearnTileComponent {

  @Input({required: true}) totalCards: number;
  @Output() quickLearnClicked = new EventEmitter<number>();

  get quickCount(): number {
    return Math.round(this.totalCards * 0.2);
  }
}
