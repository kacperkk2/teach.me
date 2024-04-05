import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from '../../../app/app.properties';
import { Store } from '@ngrx/store';
import { selectCourse } from '../../../data/store/courses/courses.selector';
import { Course } from '../../../data/model/course';
import { removeCourse } from '../../../data/store/courses/courses.action';
import { ConfirmDeleteDialog } from '../../../commons/confirm-delete-dialog/confirm-delete-dialog';
import { MatDialog } from '@angular/material/dialog';
import { selectLessonsByCourseId } from '../../../data/store/lessons/lessons.selector';
import { MigrationService } from '../../../services/migration/migration.service';
import { selectCardsByIds, selectCardsByLessonId, selectCardsByLessonIds } from '../../../data/store/cards/cards.selector';
import { ExportDialog, ExportDialogInput } from '../../../commons/export-dialog/export-dialog';
import { UrlShortenerService } from '../../../services/urlshortener/url-shortener.service';
import { CodecService } from '../../../services/codec/codec.service';
import { TurnCardService } from '../../../services/turn-card/turn-card.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lessons-header',
  templateUrl: './lessons-header.component.html',
  styleUrl: './lessons-header.component.scss'
})
export class LessonsHeaderComponent implements OnInit {
  course: Course;

  constructor(private location: Location, private router: Router, 
    private route: ActivatedRoute, private store: Store, 
    public dialog: MatDialog, private migrationService: MigrationService,
    private urlShortener: UrlShortenerService, private codec: CodecService,
    private turnCardService: TurnCardService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      this.store.select(selectCourse(courseId)).subscribe(course => {
        this.course = course;
      });
    });
  }

  back() {
    this.location.back();
  }

  removeCourseClicked() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: this.deleteLessonText, width: '90%', maxWidth: '600px', autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.store.dispatch(removeCourse({course: this.course, lessonIds: this.course.lessonIds}));
          this.location.back();
        }
    });
  }

  editCourseClicked() {
    this.router.navigate(['/courses', this.course.id]);
  }

  exportCourseClicked() {
    this.store.select(selectLessonsByCourseId(this.course.id)).subscribe(lessons => {
      const cardIds = lessons.flatMap(lesson => lesson.cardIds);

      this.store.select(selectCardsByIds(cardIds)).subscribe(cards => {
        const url = this.migrationService.courseToUrl(this.course, lessons, cards);

        // todo url shortner w jednym miejscu a nie tu i w kursach
        this.urlShortener.getShortUrl(url).subscribe((response) => {
          let finalUrl = url;
          if (response != null && response.shorturl) {
            finalUrl = response.shorturl;
          }
    
          const data = new ExportDialogInput(this.course.name, finalUrl);
          const dialogRef = this.dialog.open(ExportDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
          dialogRef.afterClosed().subscribe();
          // todo snackbar po kliknieu w kopiuj link
        })
      });
    });
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

  showSnackBar(label: string) {
    this.snackBar.open(label, 'Zamknij', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3 * 1000,
    });
  }

  title: string = CONFIG.LABELS.course;
  removeCourseLabel: string = CONFIG.LABELS.removeCourse;
  editCourseLabel: string = CONFIG.LABELS.editCourse;
  deleteLessonText: string = CONFIG.LABELS.deleteLessonConfirmation;
  exportCourseLabel: string = CONFIG.LABELS.exportCourse;
  turnCourseCardsLabel: string = CONFIG.LABELS.turnCards;
  turnCourseCardsSnackBarLabel: string = CONFIG.LABELS.turnCardsSnackBar;
}
