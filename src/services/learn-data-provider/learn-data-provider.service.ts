import { Injectable, OnInit } from '@angular/core';
import { Card } from '../../data/model/card';
import { last } from 'rxjs';
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';

@Injectable({
  providedIn: 'root'
})
export class LearnDataProviderService implements OnInit {
  cards: Card[];
  learnLabel: string;

  constructor(private store: Store) { }

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

// to typ LEKCJA/KURS