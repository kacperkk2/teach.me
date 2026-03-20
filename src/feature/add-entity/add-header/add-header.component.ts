import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-add-header',
  templateUrl: './add-header.component.html',
  styleUrl: './add-header.component.scss'
})
export class AddHeaderComponent {
  @Input({required: true}) title: string = "karty";
  @Output() closeClicked = new EventEmitter<void>();

  close() {
    this.closeClicked.emit();
  }
}
