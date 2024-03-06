import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'export-dialog',
  templateUrl: 'export-dialog.html',
  styleUrl: './export-dialog.scss'
})
export class ExportDialog {

  constructor(
    public dialogRef: MatDialogRef<ExportDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: ExportDialogInput) {
  }

  getDataToCopy() {
    // todo jakis opis ze teachme i udostepnione lekcje lub kurs i nazwa
    return this.data.url;
  }
}

export class ExportDialogInput {
  constructor(public label: string, public url: string) {}
}