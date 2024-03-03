import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  constructor(
      public dialogRef: MatDialogRef<ConfirmDialog>, 
      @Inject(MAT_DIALOG_DATA) public text: string
      ) {}
}