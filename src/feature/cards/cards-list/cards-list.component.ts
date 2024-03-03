import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../../data/model/card';

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

}
