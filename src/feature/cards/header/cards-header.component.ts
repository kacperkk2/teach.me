import { Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../app/app.properties';
import { Course } from '../../../data/model/course';
import { Lesson } from '../../../data/model/lesson';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { removeLesson } from '../../../data/store/lessons/lessons.action';
import { selectLesson } from '../../../data/store/lessons/lessons.selector';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MigrationService } from '../../../services/migration/migration.service';
import { ExportDialog, ExportDialogInput } from '../../../commons/export-dialog/export-dialog';
import { CodecService } from '../../../services/codec/codec.service';
import { selectCardsByLessonId } from '../../../data/store/cards/cards.selector';
import { UrlShortenerService } from '../../../services/urlshortener/url-shortener.service';
import { TurnCardService } from '../../../services/turn-card/turn-card.service';
import { ConfirmDialog } from '../../../commons/confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tab } from '../cards.component';

@Component({
  selector: 'app-cards-header',
  templateUrl: './cards-header.component.html',
  styleUrl: './cards-header.component.scss'
})
export class CardsHeaderComponent {
  @Input({required: true}) optionsFor: Tab;
  @Output() isReorder = new EventEmitter();
  @Output() removeAllMarks = new EventEmitter();

  Tab = Tab;
  lesson: Lesson;
  course: Course;

  // todo zrobic dumb component z tego, menu klikniecia zwracane jako akcje wyzej
  constructor(private location: Location, private router: Router, 
    private route: ActivatedRoute, private store: Store, 
    public dialog: MatDialog, private migrationService: MigrationService, 
    private codec: CodecService, private urlShortener: UrlShortenerService,
    private turnCardService: TurnCardService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const lessonId = params['lessonId'];
      this.store.select(selectLesson(lessonId)).subscribe(lesson => {
        this.lesson = lesson;
      });
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).subscribe(course => {
        this.course = course;
      });
    });
  }

  back() {
    this.location.back();
  }

  removeLessonClicked() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteLessonText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeLesson({lesson: this.lesson, cardIds: this.lesson.cardIds, course: this.course}));
          this.location.back();
        }
    });
  }

  editLessonClicked() {
    this.router.navigate(['/courses', this.course.id, 'lessons', this.lesson.id]);
  }

  exportLessonClicked() {
    this.store.select(selectCardsByLessonId(this.lesson.id)).subscribe(cards => {
      const url = this.migrationService.lessonToUrl(this.lesson, cards);

      // todo url shortner w jednym miejscu a nie tu i w kursach
      this.urlShortener.getShortUrl(url).subscribe((response) => {
        let finalUrl = url;
        if (response != null && response.shorturl) {
          finalUrl = response.shorturl;
        }
  
        const data = new ExportDialogInput(this.lesson.name, finalUrl);
        const dialogRef = this.dialog.open(ExportDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
        dialogRef.afterClosed().subscribe();
      })
    });
  }

  turnLessonCards() {
    this.turnCardService.turnLessonCards(this.lesson.id);
    // this.showSnackBar(this.turnLessonCardsSnackBarLabel);

    // const dialogRef = this.dialog.open(ConfirmDialog, {data: "Odwrócić karty?", width: '90%', maxWidth: '600px', autoFocus: false});
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result == true) {
    //       this.turnCardService.turnLessonCards(this.lesson.id);
    //     }
    // });
  }

  // todo snackbar service
  showSnackBar(label: string) {
    this.snackBar.open(label, 'Zamknij', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3 * 1000,
    });
  }

  reorderCards() {
    this.isReorder.emit();
  }

  removeAllCardsMarks() {
    this.removeAllMarks.emit();
  }
  
  title: string = CONFIG.LABELS.lesson;
  removeLessonLabel: string = CONFIG.LABELS.removeLesson;
  editLessonLabel: string = CONFIG.LABELS.editLesson;
  deleteLessonText: string = CONFIG.LABELS.deleteLessonConfirmation;
  exportLessonLabel: string = CONFIG.LABELS.exportLesson;
  turnLessonCardsLabel: string = CONFIG.LABELS.turnCards;
  reorderCardsLabel: string = CONFIG.LABELS.reorderCards;
  turnLessonCardsSnackBarLabel: string = CONFIG.LABELS.turnCardsSnackBar;
  removeAllCardsMarksLabel: string = CONFIG.LABELS.removeAllCardsMarks;
}
