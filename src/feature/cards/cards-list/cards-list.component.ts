import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../../data/model/card';
import { CONFIG } from '../../../app/app.properties';
import { ScrollService } from '../../../services/scroll/scroll.service';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss'
})
export class CardsListComponent implements OnInit, AfterViewInit {

  @Input({required: true}) cards: Card[];
  @Input() scrollToCardId: number | null = null;
  @Output() toggleCardIsMarked = new EventEmitter<Card>();

  constructor(private router: Router, private route: ActivatedRoute, private store: Store,
    private scrollService: ScrollService) {
  }

  ngOnInit(): void {
    this.scrollService.setScrolledDown(false);
  }

  ngAfterViewInit(): void {
    if (this.scrollToCardId === null) return;
    setTimeout(() => {
      document.getElementById(`card-${this.scrollToCardId}`)?.scrollIntoView({ block: 'center' });
    });
  }

  onScroll(event: Event): void {
    this.scrollService.setScrolledDown((event.target as HTMLElement).scrollTop > 0);
  }

  navigateToCard(cardId: number): void {
    this.router.navigate([cardId], { relativeTo: this.route });
  }

  toggleIsMarked(card: Card) {
    this.toggleCardIsMarked.emit(card);
  }

  emptyCardsLabel: string = CONFIG.LABELS.emptyCards;
  emptyCardsSubLabel: string = CONFIG.LABELS.emptyCardsSub;
}
