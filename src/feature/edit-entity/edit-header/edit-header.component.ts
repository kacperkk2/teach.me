import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-header',
  templateUrl: './edit-header.component.html',
  styleUrl: './edit-header.component.scss'
})
export class EditHeaderComponent {
  @Input({required: true}) title: string;
  @Output() actionClicked = new EventEmitter();
  @Output() closeClicked = new EventEmitter<void>();

  close() {
    this.closeClicked.emit();
  }

  emitActionClicked() {
    this.actionClicked.emit();
  }
}
