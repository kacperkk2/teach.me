import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrl: './edit-card.component.scss'
})
export class EditCardComponent implements OnInit {
  
  card: Card;
  lesson: Lesson;
  editCardForm: FormGroup;
  maxLength: number = CONFIG.CARDS.phraseMaxLength;

  get questionFormControl() {
    return this.editCardForm.controls["question"] as FormControl;
  }

  get answerFormControl() {
    return this.editCardForm.controls["answer"] as FormControl;
  }

  constructor(private store: Store, private router: Router,
    private route: ActivatedRoute, private location: Location, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.editCardForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
      answer: new FormControl('', [Validators.required])
    });

    this.route.params.subscribe(params => {
      const cardId = params['cardId'];
      const lessonId = params['lessonId'];
      this.store.select(selectCard(cardId)).subscribe(card => {
        this.card = card;
        this.questionFormControl.patchValue(card.question);
        this.answerFormControl.patchValue(card.answer);
      });
      this.store.select(selectLesson(lessonId)).subscribe(lesson => {
        this.lesson = lesson;
      });
    });
  }

  clearQuestion() {
    this.questionFormControl.patchValue("");
  }

  clearAnswer() {
    this.answerFormControl.patchValue("");
  }

  removeCard() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteCardText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeCard({cardId: this.card.id, lesson: this.lesson}));
          this.location.back();
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
    this.location.back();
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
