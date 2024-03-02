import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../../data/model/card';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrl: './round.component.scss'
})
export class RoundComponent {

  @Input({required: true}) cards: Card[];
  @Input({required: true}) title: string;
  @Output() roundSummary = new EventEmitter<RoundSummary>();
  
  index: number;
  cardState: CardState = CardState.QUESTION;
  CardState = CardState;
  answerState: AnswerState = AnswerState.BEFORE_SHOW;
  AnswerState = AnswerState;
  correct: Card[];
  wrong: Card[];
  
  constructor(private route: ActivatedRoute, private store: Store, private location: Location) {
  }

  ngOnInit(): void {
    this.index = 1;
    this.correct = [];
    this.wrong = [];
  }

  showAnswer() {
    this.cardState = CardState.ANSWER;
    this.answerState = AnswerState.AFTER_SHOW
  }

  correctAnswer() {
    this.correct.push(this.cards[this.index-1]);
    this.goToNextCard();
  }

  wrongAnswer() {
    this.wrong.push(this.cards[this.index-1]);
    this.goToNextCard();
  }

  private goToNextCard() {
    if (this.index == this.cards.length) {
      this.endRound();
    }
    else {
      this.cardState = CardState.QUESTION;
      this.answerState = AnswerState.BEFORE_SHOW;
      this.index++;
    }
  }

  toggleCardSide() {
    if (this.cardState == CardState.QUESTION) {
      this.cardState = CardState.ANSWER
    }
    else {
      this.cardState = CardState.QUESTION
    }
  }

  private endRound() {
    // todo pokazac jak sie pasek dopelnia
    // setTimeout(() => {
      this.roundSummary.emit(new RoundSummary(RoundAction.NEXT, this.correct, this.wrong));
    // }, 5000);
  }

  abortRound() {
    this.roundSummary.emit(new RoundSummary(RoundAction.ABORT, this.correct, this.wrong));
  }
}

export class RoundSummary {
  constructor(public roundAction: RoundAction, public correct: Card[], public wrong: Card[]) {}
}

export enum RoundAction {
  ABORT, NEXT
}

export enum CardState {
  QUESTION, ANSWER
}

export enum AnswerState {
  BEFORE_SHOW, AFTER_SHOW
}