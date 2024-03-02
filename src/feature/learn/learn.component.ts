import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../data/model/card';
import { LearnDataProviderService } from '../../services/learn-data-provider/learn-data-provider.service';
import { RoundAction, RoundSummary } from './round/round.component';
import { SummaryAction } from './summary/summary.component';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss'
})
export class LearnComponent implements OnInit {

  cards: Card[];
  label: string;

  cardsLeft: Card[];
  gameState: GameState = GameState.ROUND;
  GameState = GameState;
  round: number;
  fullRoundsSummaries: FullRoundSummary[];
  
  constructor(private route: ActivatedRoute, private store: Store, 
    private location: Location, private learnDataProvider: LearnDataProviderService) {
  }

  ngOnInit(): void {
    this.round = 1;
    this.fullRoundsSummaries = [];

    this.cards = this.learnDataProvider.getCards();
    this.cardsLeft = this.cards;
    this.label = this.learnDataProvider.getLabel();
  }

  endRound(roundSummary: RoundSummary) {
    if (roundSummary.roundAction == RoundAction.ABORT) {
      this.close();
    }
    else {
      const fullRoundSummary = new FullRoundSummary(
        this.round, 
        this.concatWithPrevCorrect(roundSummary.correct), 
        this.concatWithPrevCorrect(roundSummary.wrong), 
        roundSummary.correct, 
        roundSummary.wrong
      );
      this.fullRoundsSummaries.push(fullRoundSummary);
      this.gameState = GameState.SUMMARY;
    }
  }

  private concatWithPrevCorrect(cards: Card[]) {
    if (this.fullRoundsSummaries.length == 0) {
      return cards;
    }
    return [...this.fullRoundsSummaries[this.fullRoundsSummaries.length - 1].correctFromBeggining, ...cards]
  }

  endSummary(action: SummaryAction) {
    if (action == SummaryAction.ABORT) {
      this.close();
    }
    else {
      this.cardsLeft = this.fullRoundsSummaries[this.round-1].wrongInRound;
      this.round++;
      this.gameState = GameState.ROUND;
    }
  }

  close() {
    this.location.back();
  }
}

export class FullRoundSummary {
  constructor(public roundNum: number, public correctFromBeggining: Card[], public wrongFromBeggining: Card[], 
    public correctInRound: Card[], public wrongInRound: Card[]) {}
}

export enum GameState {
  ROUND, SUMMARY
}