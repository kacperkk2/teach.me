import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-header',
  templateUrl: './import-header.component.html',
  styleUrl: './import-header.component.scss'
})
export class ImportHeaderComponent {

  @Input({required: true}) title: string;

  constructor(private router: Router) {
  }

  close() {
    this.router.navigate(['/courses']);
  }
}
