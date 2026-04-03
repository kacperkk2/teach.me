import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Card } from '../../../data/model/card';
import { updateCard } from '../../../data/store/cards/cards.action';
import { LearningPreferencesService } from '../../../services/learning-preferences/learning-preferences.service';
import { SpeakButtonComponent } from '../../../commons/speak-button/speak-button.component';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrl: './round.component.scss'
})
export class RoundComponent implements OnDestroy {

  @ViewChild(SpeakButtonComponent) speakButton?: SpeakButtonComponent;

  @Input({required: true}) cards: Card[];
  @Input({required: true}) title: string;
  @Input() language?: string;
  @Output() roundSummary = new EventEmitter<RoundSummary>();

  index: number;
  cardState: CardState = CardState.QUESTION;
  CardState = CardState;
  answerState: AnswerState = AnswerState.BEFORE_SHOW;
  AnswerState = AnswerState;
  correct: Card[];
  wrong: Card[];
  isReversed: boolean;

  constructor(private route: ActivatedRoute, private store: Store, private location: Location, private prefs: LearningPreferencesService) {
  }

  ngOnInit(): void {
    this.index = 1;
    this.correct = [];
    this.wrong = [];
    this.isReversed = this.prefs.reversedMode;
  }

  get currentSpokenText(): string {
    if (!this.cards?.length || this.index < 1) return '';
    const card = this.cards[this.index - 1];
    return this.cardState === CardState.QUESTION
      ? (this.isReversed ? card.answer : card.question)
      : (this.isReversed ? card.question : card.answer);
  }

  showAnswer() {
    this.cardState = CardState.ANSWER;
    this.answerState = AnswerState.AFTER_SHOW;
  }

  correctAnswer() {
    this.correct.push(this.cards[this.index-1]);
    this.goToNextCard();
  }

  wrongAnswer() {
    this.wrong.push(this.cards[this.index-1]);
    this.goToNextCard();
  }

  ngOnDestroy() {
    window.speechSynthesis.cancel();
  }

  private goToNextCard() {
    window.speechSynthesis.cancel();
    if (this.index == this.cards.length) {
      this.endRound();
    }
    else {
      this.cardState = CardState.QUESTION;
      this.answerState = AnswerState.BEFORE_SHOW;
      this.index++;
    }
  }

  private endRound() {
    // todo pokazac jak sie pasek dopelnia
    // setTimeout(() => {
      this.roundSummary.emit(new RoundSummary(RoundAction.NEXT, this.correct, this.wrong));
    // }, 5000);
  }

  toggleReversed() {
    this.isReversed = !this.isReversed;
    this.prefs.reversedMode = this.isReversed;
  }

  toggleMark() {
    const updatedCard = { ...this.cards[this.index - 1], isMarked: !this.cards[this.index - 1].isMarked };
    this.store.dispatch(updateCard({ card: updatedCard }));
    this.cards[this.index - 1] = updatedCard;
  }

  private canDelegateToSpeak(): boolean {
    return !!this.language && this.answerState === AnswerState.AFTER_SHOW;
  }

  onCardMouseDown() { if (this.canDelegateToSpeak()) this.speakButton?.onPressStart(); }
  onCardMouseUp() { if (this.canDelegateToSpeak()) this.speakButton?.onPressEnd(); }
  onCardMouseLeave() { if (this.canDelegateToSpeak()) this.speakButton?.onPressCancel(); }
  onCardTouchStart(e: Event) { if (this.canDelegateToSpeak()) { e.preventDefault(); this.speakButton?.onPressStart(); } }
  onCardTouchEnd() { if (this.canDelegateToSpeak()) this.speakButton?.onPressEnd(); }
  onCardTouchCancel() { if (this.canDelegateToSpeak()) this.speakButton?.onPressCancel(); }
  onCardTouchMove() { if (this.canDelegateToSpeak()) this.speakButton?.onPressCancel(); }

  abortRound() {
    window.speechSynthesis.cancel();
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
