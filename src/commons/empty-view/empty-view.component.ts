import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-view',
  templateUrl: './empty-view.component.html',
  styleUrl: './empty-view.component.scss'
})
export class EmptyViewComponent {

  @Input({required: true}) mainLabel: string;
  @Input({required: true}) subLabel: string;
  @Input() redirectTo: string;
  @Input() showButton: boolean = false;
}
