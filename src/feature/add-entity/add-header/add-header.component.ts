import { Location } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-add-header',
  templateUrl: './add-header.component.html',
  styleUrl: './add-header.component.scss'
})
export class AddHeaderComponent {
  @Input({required: true}) title: string = "karty";

  constructor(private location: Location) {
  }

  close() {
    this.location.back();
  }
}
