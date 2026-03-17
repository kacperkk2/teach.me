import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-result-tile',
  templateUrl: './search-result-tile.component.html',
  styleUrl: './search-result-tile.component.scss'
})
export class SearchResultTileComponent {

  @Input({required: true}) question: string;
  @Input({required: true}) answer: string;
  @Input({required: true}) courseName: string;
  @Input({required: true}) lessonName: string;
  @Input() query: string = '';
  @Output() tileClicked = new EventEmitter();
}
