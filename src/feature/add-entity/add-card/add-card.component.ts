import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '../../../app/app.properties';
import { IdGeneratorService } from '../../../services/id-generator/id-generator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { Lesson } from '../../../data/model/lesson';
import { Location } from '@angular/common';
import { Card } from '../../../data/model/card';
import { addCards } from '../../../data/store/cards/cards.action';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss'
})
export class AddCardComponent implements OnInit {
  
  addCardsForm: FormGroup;
  addCardsBulkForm: FormGroup;
  lesson: Lesson;
  mode: AddMode = AddMode.CARD;
  AddMode = AddMode;
  separator: string = CONFIG.CARDS.ADD_CARD.questionAnswerSeparator;
  separatorWithSpaces: string = ' ' + this.separator + ' ';

  get cardsFormArray() {
    return this.addCardsForm.controls["cards"] as FormArray;
  }

  get cardsBulkFormControl() {
    return this.addCardsBulkForm.controls["cards"] as FormControl;
  }

  constructor(private idGenerator: IdGeneratorService, 
    private store: Store, private router: Router,
    private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.addCardsBulkForm = new FormGroup({
      cards: new FormControl('', [Validators.required])
    });
    this.addCardsForm = new FormGroup({
      cards: new FormArray([])
    });
    this.addEmptyCard();

    this.route.params.subscribe(params => {
      const lessonId = params['lessonId'];
      this.store.select(selectLesson(lessonId)).subscribe(lesson => {
        this.lesson = lesson;
      });
    });
  }

  toggleMode(targetMode: AddMode) {
    if (targetMode == this.mode) {
      return;
    }
    if (this.mode == AddMode.CARD) {
      this.switchToBulkMode();
    }
    else {
      this.switchToCardMode();
    }
  }

  private switchToBulkMode() {
    this.cardsBulkFormControl.patchValue(this.getTextFromCards());
    this.mode = AddMode.BULK;
  }

  private switchToCardMode() {
    this.fillCardsFromText();
    this.mode = AddMode.CARD;
  }

  private getTextFromCards() {
    return (this.cardsFormArray.controls as FormGroup[]).reduce((acc: string, card: FormGroup) => {
      const question = card.controls["question"].value as string;
      const answer = card.controls["answer"].value as string;
      let text = '';
      if (question.trim()) {
        text += card.controls["question"].value 
          + this.separatorWithSpaces;
      }
      if (answer.trim()) {
        text += card.controls["answer"].value;
      }
      if (text) {
        text += '\n';
      }
      return acc + text;
    }, '');
  }

  private fillCardsFromText() {
    this.cardsFormArray.clear();
    (this.cardsBulkFormControl.value as string).split('\n').forEach((line: string) => {
      if (!line.trim()) {
        return;
      }
      const question = this.trimOrEmptyString(line.split(this.separator)[0]);
      const answer = this.trimOrEmptyString(line.split(this.separator).slice(1).join(this.separator));
      this.addCard(question, answer);
    });
    if (this.cardsFormArray.length == 0) {
      this.addEmptyCard();
    }
  }

  private trimOrEmptyString(value: string) {
    if (!value) {
      return "";
    }
    return value.trim();
  }

  addCard(question: string, answer: string) {
    this.cardsFormArray.push(this.buildSingleCardForm(question, answer));
  }

  addEmptyCard() {
    this.cardsFormArray.push(this.buildSingleCardForm('', ''));
  }

  deleteCard(index: number) {
    this.cardsFormArray.removeAt(index);
  }

  save() {
    const cards: Card[] = (this.cardsFormArray.controls as FormGroup[]).map((cardFormGroup: FormGroup) => {
      return {
        id: this.idGenerator.nextIdForCards(),
        question: cardFormGroup.controls["question"].value.trim(),
        answer: cardFormGroup.controls["answer"].value.trim()
      }
    });
    this.store.dispatch(addCards({cards: cards, lesson: this.lesson}));
    this.location.back();
  }

  private buildSingleCardForm(question: string, answer: string) {
    return new FormGroup({
      question: new FormControl(question, [Validators.required, Validators.maxLength(this.maxLength)]),
      answer: new FormControl(answer, [Validators.required, Validators.maxLength(this.maxLength)])
    });
  }

  headerTitle: string = CONFIG.LABELS.addCards;
  maxLength: number = CONFIG.CARDS.phraseMaxLength;
  questionLabel: string = CONFIG.LABELS.question;
  answerLabel: string = CONFIG.LABELS.answer;
  cardsLabel: string = CONFIG.LABELS.cards;
}

export enum AddMode {
  CARD, BULK
}