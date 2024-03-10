import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-icon',
  templateUrl: './card-icon.component.html',
  styleUrl: './card-icon.component.scss'
})
export class CardIconComponent {
  @Input({required: true}) count: number;
}
