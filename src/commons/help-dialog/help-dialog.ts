import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'help-dialog',
  templateUrl: 'help-dialog.html',
  styleUrl: './help-dialog.scss'
})
export class HelpDialog {
  constructor(public dialogRef: MatDialogRef<HelpDialog>) {}
}
