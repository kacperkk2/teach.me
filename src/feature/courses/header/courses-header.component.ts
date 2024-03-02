import { Component } from '@angular/core';
import { CONFIG } from '../../../app/app.properties';

@Component({
  selector: 'app-courses-header',
  templateUrl: './courses-header.component.html',
  styleUrl: './courses-header.component.scss'
})
export class CoursesHeaderComponent {

  constructor() {
  }

  title: string = CONFIG.LABELS.appTitle;
}
