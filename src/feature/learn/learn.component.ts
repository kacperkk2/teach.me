import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from '../../data/model/card';
import { RoundAction, RoundSummary } from './round/round.component';
import { SummaryAction } from './summary/summary.component';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss'
})
export class LearnComponent implements OnInit {
  @Input({required: true}) cards: Card[];
  @Input({required: true}) label: string;
  @Output() learnEnd = new EventEmitter();

  cardsWrongInFirstRound: Card[];
  cardsLeft: Card[];
  gameState: GameState = GameState.ROUND;
  GameState = GameState;
  round: number;
  fullRoundsSummaries: FullRoundSummary[];
  
  constructor() {
  }

  ngOnInit(): void {
    this.round = 1;
    this.fullRoundsSummaries = [];
    this.cardsLeft = this.cards;
  }

  endRound(roundSummary: RoundSummary) {
    if (roundSummary.roundAction == RoundAction.ABORT) {
      this.abortLearn();
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
      this.cardsLeft = this.fullRoundsSummaries[this.round-1].wrongInRound;
      if (this.round == 1) {
        this.cardsWrongInFirstRound = [...this.cardsLeft];
      }
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
      this.abortLearn();
    }
    else if (action == SummaryAction.LEARN_END) {
      this.finishLearn();
    }
    else {
      this.round++;
      this.gameState = GameState.ROUND;
    }
  }

  abortLearn() {
    this.learnEnd.emit(new LearnEndData(LearnEndState.ABORT, []))
  }

  finishLearn() {
    this.learnEnd.emit(new LearnEndData(LearnEndState.LEARN_END, this.cardsWrongInFirstRound))
  }
}

export class FullRoundSummary {
  constructor(public roundNum: number, public correctFromBeggining: Card[], public wrongFromBeggining: Card[], 
    public correctInRound: Card[], public wrongInRound: Card[]) {}
}

export class LearnEndData {
  constructor(public state: LearnEndState, public wrong: Card[]) {}
}

export enum LearnEndState {
  ABORT, LEARN_END
}

export enum GameState {
  ROUND, SUMMARY
}