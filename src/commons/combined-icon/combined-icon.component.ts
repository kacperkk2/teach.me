import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-combined-icon',
  templateUrl: './combined-icon.component.html',
  styleUrl: './combined-icon.component.scss'
})
export class CombinedIconComponent {
  @Input({required: true}) mainIcon: string;
  @Input({required: true}) smallIcon: string;

}
