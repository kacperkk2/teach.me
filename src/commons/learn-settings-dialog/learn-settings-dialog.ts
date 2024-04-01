import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LearnSettingsState } from '../../data/store/learn-settings/learn-settings.state';
import { selectLearnSettingsState } from '../../data/store/learn-settings/learn-settings.selector';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'learn-settings-dialog',
  templateUrl: 'learn-settings-dialog.html',
  styleUrl: './learn-settings-dialog.scss'
})
export class LearnSettingsDialog implements OnInit {
  learnSettings: LearnSettingsState;
  settingsForm: FormGroup;

  get shuffleFormControl() {
    return this.settingsForm.controls["shuffle"] as FormControl;
  }

  get backFirstFormControl() {
    return this.settingsForm.controls["backFirst"] as FormControl;
  }

  constructor(
      public dialogRef: MatDialogRef<LearnSettingsDialog>, 
      @Inject(MAT_DIALOG_DATA) public text: string,
      private store: Store) {
  }

  ngOnInit(): void {
    this.settingsForm = new FormGroup({
      shuffle: new FormControl(''),
      backFirst: new FormControl('')
    });
    this.store.select(selectLearnSettingsState).subscribe(settings => {
      this.learnSettings = settings;
      this.initForm();
    });
  }

  initForm() {
    this.shuffleFormControl.patchValue(this.learnSettings.shuffle);
    this.backFirstFormControl.patchValue(this.learnSettings.backFirst);
  }

  saveSettings() {
    console.log(this.settingsForm.value)
  }
}