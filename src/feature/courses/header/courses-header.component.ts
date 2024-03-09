import { Component } from '@angular/core';
import { CONFIG } from '../../../app/app.properties';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { Store } from '@ngrx/store';
import { clearAppState } from '../../../data/store/app/app.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-header',
  templateUrl: './courses-header.component.html',
  styleUrl: './courses-header.component.scss'
})
export class CoursesHeaderComponent {

  constructor(public dialog: MatDialog, private store: Store, private router: Router) {
  }

  removeAppData() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.removeAppDataText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(clearAppState());
          // todo jesli refresh bedzie przeszkadzal to zrobic clear na store tez (dodac removeCourses itd...)
          window.location.reload(); 
        }
    });
  }

  title: string = CONFIG.LABELS.appTitle;
  removeAppDataText: string = CONFIG.LABELS.deleteAppDataConfirmation;
  removeAppDataLabel: string = CONFIG.LABELS.removeAppData;
}
