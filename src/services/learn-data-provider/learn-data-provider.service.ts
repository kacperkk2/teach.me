import { Injectable, OnInit } from '@angular/core';
import { Card } from '../../data/model/card';
import { last } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearnDataProviderService implements OnInit {
  cards: Card[];
  learnLabel: string;

  constructor() { }

  ngOnInit() {
    this.clearData();
  }

  clearData() {
    this.cards = [];
    this.learnLabel = "";
  }

  prepareData(cards: Card[], label: string) {
    this.cards = cards;
    this.learnLabel = label;
  }

  getCards() {
    return this.cards;
  }

  getLabel() {
    return this.learnLabel;
  }
}
