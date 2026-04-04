import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HelpDialog } from '../../commons/help-dialog/help-dialog';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss'
})
export class InstructionsComponent {

  currentSlide = 0;
  readonly totalSlides = 14;

  constructor(private router: Router, private dialog: MatDialog) {}

  navigateBack() {
    this.router.navigate(['/courses']);
  }

  openDetails() {
    this.dialog.open(HelpDialog, { width: '90%', maxWidth: '600px', autoFocus: false });
  }

  prev() {
    if (this.currentSlide > 0) this.currentSlide--;
  }

  next() {
    if (this.currentSlide < this.totalSlides - 1) this.currentSlide++;
  }
}
