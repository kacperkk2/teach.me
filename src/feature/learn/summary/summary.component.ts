import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FullRoundSummary } from '../learn.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {

  @Input({required: true}) summaries: FullRoundSummary[];
  @Input({required: true}) allCardsNum: number;
  @Output() action = new EventEmitter<SummaryAction>();


  abort() {
    this.action.emit(SummaryAction.ABORT);
  }

  endSummary() {
    this.action.emit(SummaryAction.NEXT);
  }
}

export enum SummaryAction {
  ABORT, NEXT
}
