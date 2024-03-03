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

  constructor(private location: Location) {
  }

  close() {
    this.location.back();
  }
  
  emitActionClicked() {
    this.actionClicked.emit();
  }
}
