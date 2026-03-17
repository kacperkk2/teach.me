import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ScrollService } from '../../services/scroll/scroll.service';

@Component({
  selector: 'app-add-round-button',
  templateUrl: './add-round-button.component.html',
  styleUrl: './add-round-button.component.scss',
  animations: [
    trigger('slideInOut', [
      state('visible', style({ transform: 'translateY(0)', opacity: '1' })),
      state('hidden', style({ transform: 'translateY(100px)', opacity: '0' })),
      transition('visible => hidden', animate('220ms ease-in')),
      transition('hidden => visible', animate('300ms ease-out')),
    ])
  ]
})
export class AddRoundButtonComponent implements OnInit, OnDestroy {

  @Input({required: true}) redirectTo: string;
  @Input() label: string;

  animState: 'visible' | 'hidden' = 'visible';
  private sub: Subscription;

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {
    this.sub = this.scrollService.scrolledDown$.subscribe(scrolledDown => {
      this.animState = scrolledDown ? 'hidden' : 'visible';
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
