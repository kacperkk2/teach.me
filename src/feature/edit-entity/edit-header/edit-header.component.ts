import { Location } from '@angular/common';
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

  constructor(private location: Location) {
  }

  close() {
    if (this.closeClicked.observed) {
      this.closeClicked.emit();
    } else {
      this.location.back();
    }
  }
  
  emitActionClicked() {
    this.actionClicked.emit();
  }
}
