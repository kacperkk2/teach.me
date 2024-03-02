import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-round-button',
  templateUrl: './add-round-button.component.html',
  styleUrl: './add-round-button.component.scss'
})
export class AddRoundButtonComponent {

  @Input({required: true}) redirectTo: string;
  @Input() label: string;
}
