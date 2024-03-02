import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-learn-type-tile',
  templateUrl: './learn-type-tile.component.html',
  styleUrl: './learn-type-tile.component.scss'
})
export class LearnTypeTileComponent {

  @Input({required: true}) label: string;
  @Input({required: true}) icon: string;
  @Input({required: true}) buttonLabel: string;
  @Input() buttonDisabled: boolean = false;
  @Output() actionClicked = new EventEmitter();
  
  emitActionClicked() {
    this.actionClicked.emit();
  }
}
