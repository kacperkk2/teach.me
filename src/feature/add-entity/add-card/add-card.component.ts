import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CONFIG } from '../../../app/app.properties';
import { IdGeneratorService } from '../../../services/id-generator/id-generator.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { Lesson } from '../../../data/model/lesson';
import { Card } from '../../../data/model/card';
import { addCards } from '../../../data/store/cards/cards.action';
import { TabStateService } from '../../../services/tab-state/tab-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss'
})
export class AddCardComponent implements OnInit, AfterViewInit, OnDestroy {
  
  addCardsForm: FormGroup;
  addCardsBulkForm: FormGroup;
  lesson: Lesson;
  mode: AddMode = AddMode.CARD;
  AddMode = AddMode;
  separators: string[] = CONFIG.CARDS.ADD_CARD.questionAnswerSeparators;
  outputSeparator: string = CONFIG.CARDS.ADD_CARD.questionAnswerOutputSeparator;
  outputSeparatorWithSpaces: string = ' ' + this.outputSeparator + ' ';
  private separatorRegex = new RegExp(`[${this.separators.join('')}]`);

  @ViewChildren('questionInput') questionInputs: QueryList<ElementRef>;
  @ViewChild('bulkInput') bulkInput: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => this.questionInputs.first?.nativeElement.focus());
  }

  get cardsFormArray() {
    return this.addCardsForm.controls["cards"] as FormArray;
  }

  get cardsBulkFormControl() {
    return this.addCardsBulkForm.controls["cards"] as FormControl;
  }

  private destroy$ = new Subject<void>();

  constructor(private idGenerator: IdGeneratorService,
    private store: Store, private route: ActivatedRoute,
    private location: Location, private tabState: TabStateService) {}

  ngOnInit(): void {
    this.addCardsBulkForm = new FormGroup({
      cards: new FormControl('', [Validators.required])
    });
    this.addCardsForm = new FormGroup({
      cards: new FormArray([])
    });
    this.addEmptyCard();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.store.select(selectLesson(params['lessonId'])).pipe(takeUntil(this.destroy$)).subscribe(lesson => {
        this.lesson = lesson;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    setTimeout(() => this.bulkInput?.nativeElement.focus());
  }

  private switchToCardMode() {
    this.fillCardsFromText();
    this.mode = AddMode.CARD;
    setTimeout(() => this.questionInputs.first?.nativeElement.focus());
  }

  private getTextFromCards() {
    return (this.cardsFormArray.controls as FormGroup[]).reduce((acc: string, card: FormGroup) => {
      const question = card.controls["question"].value as string;
      const answer = card.controls["answer"].value as string;
      let text = '';
      if (question.trim()) {
        text += card.controls["question"].value
          + this.outputSeparatorWithSpaces;
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
      const parts = line.split(this.separatorRegex);
      const question = this.trimOrEmptyString(parts[0]);
      const answer = this.trimOrEmptyString(parts.slice(1).join(this.outputSeparator));
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

  turnCard(index: number) {
    const group = this.cardsFormArray.at(index) as FormGroup;
    const question = group.controls['question'].value;
    group.controls['question'].patchValue(group.controls['answer'].value);
    group.controls['answer'].patchValue(question);
  }

  save() {
    const cards: Card[] = (this.cardsFormArray.controls as FormGroup[]).map((cardFormGroup: FormGroup) => {
      return {
        id: this.idGenerator.nextIdForCards(),
        question: cardFormGroup.controls["question"].value.trim(),
        answer: cardFormGroup.controls["answer"].value.trim(),
        isMarked: false
      }
    });
    this.store.dispatch(addCards({cards: cards, lesson: this.lesson}));
    this.tabState.pendingCardsTab = 1;
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