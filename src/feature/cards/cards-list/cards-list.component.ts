import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../../data/model/card';
import { CONFIG } from '../../../app/app.properties';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss'
})
export class CardsListComponent implements OnInit {

  @Input({required: true}) cards: Card[];

  constructor(private route: ActivatedRoute, private store: Store) {
  }

  ngOnInit(): void {
  }

  emptyCardsLabel: string = CONFIG.LABELS.emptyCards;
  emptyCardsSubLabel: string = CONFIG.LABELS.emptyCardsSub;
}
