import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'export-dialog',
  templateUrl: 'export-dialog.html',
  styleUrl: './export-dialog.scss'
})
export class ExportDialog {

  constructor(
    public dialogRef: MatDialogRef<ExportDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: ExportDialogInput,
    private snackBar: MatSnackBar) {
  }

  getDataToCopy() {
    return this.data.url;
  }

  close() {
    this.snackBar.open('Link został skopiowany', 'Zamknij', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3 * 1000,
    });
    this.dialogRef.close();
  }
}

export class ExportDialogInput {
  constructor(public label: string, public url: string) {}
}