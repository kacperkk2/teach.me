import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { Card } from '../../../data/model/card';
import { Lesson } from '../../../data/model/lesson';
import { removeCard, updateCard } from '../../../data/store/cards/cards.action';
import { selectCard } from '../../../data/store/cards/cards.selector';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { TabStateService } from '../../../services/tab-state/tab-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrl: './edit-card.component.scss'
})
export class EditCardComponent implements OnInit, OnDestroy {

  card: Card;
  lesson: Lesson;
  courseId: string;
  lessonId: string;
  editCardForm: FormGroup;
  maxLength: number = CONFIG.CARDS.phraseMaxLength;

  private destroy$ = new Subject<void>();

  get questionFormControl() {
    return this.editCardForm.controls["question"] as FormControl;
  }

  get answerFormControl() {
    return this.editCardForm.controls["answer"] as FormControl;
  }

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog, private tabState: TabStateService) {}

  ngOnInit(): void {
    this.editCardForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
      answer: new FormControl('', [Validators.required])
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const cardId = params['cardId'];
      this.courseId = params['courseId'];
      this.lessonId = params['lessonId'];
      this.store.select(selectCard(cardId)).pipe(takeUntil(this.destroy$)).subscribe(card => {
        this.card = card;
        this.questionFormControl.patchValue(card.question);
        this.answerFormControl.patchValue(card.answer);
      });
      this.store.select(selectLesson(+this.lessonId)).pipe(takeUntil(this.destroy$)).subscribe(lesson => {
        this.lesson = lesson;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearQuestion() {
    this.questionFormControl.patchValue("");
  }

  clearAnswer() {
    this.answerFormControl.patchValue("");
  }

  close() {
    this.tabState.pendingCardsTab = 1;
    this.router.navigate(['/courses', this.courseId, 'lessons', this.lessonId, 'cards']);
  }

  removeCard() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteCardText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeCard({cardId: this.card.id, lesson: this.lesson}));
          this.tabState.pendingCardsTab = 1;
          this.router.navigate(['/courses', this.courseId, 'lessons', this.lessonId, 'cards']);
        }
    });
  }

  saveCard() {
    const updatedCard: Card = {
      id: this.card.id,
      question: this.questionFormControl.value,
      answer: this.answerFormControl.value,
      isMarked: this.card.isMarked
    }
    this.store.dispatch(updateCard({card: updatedCard}));
    this.tabState.pendingCardsTab = 1;
    this.router.navigate(['/courses', this.courseId, 'lessons', this.lessonId, 'cards']);
  }

  turnCard() {
    const question = this.questionFormControl.value;
    this.questionFormControl.patchValue(this.answerFormControl.value);
    this.answerFormControl.patchValue(question);
  }

  headerTitle: string = CONFIG.LABELS.editCard;
  questionLabel: string = CONFIG.LABELS.question;
  answerLabel: string = CONFIG.LABELS.answer;
  deleteCardText: string = CONFIG.LABELS.deleteCardConfirmation;
}
