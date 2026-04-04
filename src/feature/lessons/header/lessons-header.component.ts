import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from '../../../app/app.properties';
import { Store } from '@ngrx/store';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { Course } from '../../../data/model/course';
import { MatDialog } from '@angular/material/dialog';
import { selectLessonsByCourseId } from '../../../data/store/lessons/lessons.selector';
import { MigrationService } from '../../../services/migration/migration.service';
import { selectCards, selectCardsByIds, selectCardsByLessonId, selectCardsByLessonIds } from '../../../data/store/cards/cards.selector';
import { ExportDialog, ExportDialogInput } from '../../../commons/export-dialog/export-dialog';
import { UrlShortenerService } from '../../../services/urlshortener/url-shortener.service';
import { CodecService } from '../../../services/codec/codec.service';
import { TurnCardService } from '../../../services/turn-card/turn-card.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../commons/confirm-dialog/confirm-dialog';
import { PdfGeneratorService } from '../../../services/pdf-generator/pdf-generator.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-lessons-header',
  templateUrl: './lessons-header.component.html',
  styleUrl: './lessons-header.component.scss'
})
export class LessonsHeaderComponent implements OnInit, OnDestroy {
  @Output() reorderLessonsClicked = new EventEmitter();
  @Input() isSearchActive: boolean = false;
  @Output() searchToggled = new EventEmitter<void>();

  course: Course;

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private route: ActivatedRoute, private store: Store,
    public dialog: MatDialog, private migrationService: MigrationService,
    private urlShortener: UrlShortenerService, private codec: CodecService,
    private turnCardService: TurnCardService, private snackBar: MatSnackBar,
    private pdfGeneratorService: PdfGeneratorService) {
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).pipe(takeUntil(this.destroy$)).subscribe(course => {
        this.course = course;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  back() {
    this.router.navigate(['/courses']);
  }

  editCourseClicked() {
    this.router.navigate(['/courses', this.course.id]);
  }

  exportCourseClicked() {
    this.store.select(selectLessonsByCourseId(this.course.id)).subscribe(lessons => {
      const cardIds = lessons.flatMap(lesson => lesson.cardIds);

      this.store.select(selectCardsByIds(cardIds)).subscribe(cards => {
        const lessonShortUrlRequests = lessons.map(lesson => {
          const lessonCards = cards.filter(card => lesson.cardIds.includes(card.id));
          const lessonUrl = this.migrationService.lessonToUrl(lesson, lessonCards);
          return this.urlShortener.getShortUrl(lessonUrl);
        });

        forkJoin(lessonShortUrlRequests).subscribe(responses => {
          const allSucceeded = responses.every(r => r != null && r.shorturl);

          if (allSucceeded) {
            const codes = responses.map(r => r!.shorturl.split('/').pop()!);
            const languagePart = this.course.language
              ? '&' + CONFIG.IMPORT.courseLanguageParam + '=' + encodeURIComponent(this.course.language)
              : '';
            const codesUrl = location.origin + CONFIG.IMPORT.appRoot + CONFIG.IMPORT.importPath
              + '?' + CONFIG.IMPORT.codesParam + '=' + codes.join(CONFIG.IMPORT.codeSeparator)
              + '&' + CONFIG.IMPORT.courseNameParam + '=' + encodeURIComponent(this.course.name)
              + languagePart;

            this.urlShortener.getShortUrl(codesUrl).subscribe(finalResponse => {
              const finalUrl = (finalResponse != null && finalResponse.shorturl) ? finalResponse.shorturl : codesUrl;
              const data = new ExportDialogInput(this.course.name, finalUrl);
              this.dialog.open(ExportDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false})
                .afterClosed().subscribe();
            });
          } else {
            // Fallback: try old single-URL format
            const url = this.migrationService.courseToUrl(this.course, lessons, cards);
            this.urlShortener.getShortUrl(url).subscribe(response => {
              const finalUrl = (response != null && response.shorturl) ? response.shorturl : url;
              const data = new ExportDialogInput(this.course.name, finalUrl);
              this.dialog.open(ExportDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false})
                .afterClosed().subscribe();
            });
          }
        });
      }).unsubscribe();
    }).unsubscribe();
  }
  
  turnCourseCards() {
    this.turnCardService.turnCourseCards(this.course.id);
    // this.showSnackBar(this.turnCourseCardsSnackBarLabel);

    // const dialogRef = this.dialog.open(ConfirmDialog, {data: "Odwrócić karty?", width: '90%', maxWidth: '600px', autoFocus: false});
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result == true) {
    //       this.turnCardService.turnLessonCards(this.lesson.id);
    //     }
    // });
  }

  generatePdfClicked() {
    (document.activeElement as HTMLElement)?.blur();
    const dialogRef = this.dialog.open(ConfirmDialog, {data: this.generatePdfConfirmationLabel, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.store.select(selectLessonsByCourseId(this.course.id)).subscribe(lessons => {
          this.store.select(selectCards).subscribe(cardsMap => {
            this.pdfGeneratorService.generateCoursePdf(this.course, lessons, cardsMap);
          }).unsubscribe();
        }).unsubscribe();
      }
    });
  }

  showSnackBar(label: string) {
    this.snackBar.open(label, 'Zamknij', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3 * 1000,
    });
  }

  reorderLessonsLabel: string = CONFIG.LABELS.reorderLessons;
  title: string = CONFIG.LABELS.course;
  manageCourseLabel: string = CONFIG.LABELS.manageCourse;
  exportCourseLabel: string = CONFIG.LABELS.exportCourse;
  turnCourseCardsLabel: string = CONFIG.LABELS.turnCards;
  turnCourseCardsSnackBarLabel: string = CONFIG.LABELS.turnCardsSnackBar;
  generatePdfLabel: string = CONFIG.LABELS.generatePdf;
  generatePdfConfirmationLabel: string = CONFIG.LABELS.generatePdfConfirmation;
  exportCourseFailedLabel: string = CONFIG.LABELS.exportCourseFailed;
}
