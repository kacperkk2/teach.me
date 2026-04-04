import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { CONFIG } from '../../app/app.properties';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrl: './language-select.component.scss'
})
export class LanguageSelectComponent {

  @Input({required: true}) set control(value: AbstractControl) { this.formControl = value as FormControl; }
  formControl: FormControl;

  checkboxLabel: string = CONFIG.LABELS.languageCourse;
  languages = CONFIG.LANGUAGES;

  get isLanguageCourse(): boolean {
    return !!this.formControl?.value;
  }

  onToggle(checked: boolean): void {
    this.formControl.setValue(checked ? this.languages[0].code : '');
  }
}
