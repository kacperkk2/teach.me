import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lesson } from '../../data/model/lesson';

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrl: './course-tile.component.scss',
  animations: [
    trigger('slideDown', [
      state('collapsed', style({ height: '0px', marginTop: '0px' })),
      state('expanded', style({ height: '*', marginTop: '-15px' })),
      transition('collapsed <=> expanded', animate('250ms ease-in-out'))
    ])
  ]
})
export class CourseTileComponent {

  @Input({required: true}) name: string;
  @Input({required: true}) cardsCount: number;
  @Input() lessonsCount: number | null = null;
  @Input() lessons: Lesson[] = [];
  @Output() tileClicked = new EventEmitter();

  isExpanded = false;

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
