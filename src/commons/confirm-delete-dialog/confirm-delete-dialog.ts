import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: 'confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.scss'
})
export class ConfirmDeleteDialog {
  constructor(
      public dialogRef: MatDialogRef<ConfirmDeleteDialog>, 
      @Inject(MAT_DIALOG_DATA) public text: string
      ) {}
}