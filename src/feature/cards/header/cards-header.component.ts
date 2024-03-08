import { Location } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-cards-header',
  templateUrl: './cards-header.component.html',
  styleUrl: './cards-header.component.scss'
})
export class CardsHeaderComponent {
  lesson: Lesson;
  course: Course;

  // todo zrobic dumb component z tego, menu klikniecia zwracane jako akcje wyzej
  constructor(private location: Location, private router: Router, 
    private route: ActivatedRoute, private store: Store, 
    public dialog: MatDialog, private migrationService: MigrationService, 
    private codec: CodecService, private urlShortener: UrlShortenerService) {
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
      let url = this.migrationService.lessonToUrl(this.lesson, cards);
      console.log('url przed encode', url)
      url = encodeURIComponent(url)
      console.log('url po encode', url)

      // todo url shortner w jednym miejscu a nie tu i w kursach
      this.urlShortener.getShortUrl(url).subscribe((response) => {
        let finalUrl = url;
        if (response != null && response.shorturl) {
          finalUrl = response.shorturl;
        }
  
        const data = new ExportDialogInput(this.lesson.name, finalUrl);
        const dialogRef = this.dialog.open(ExportDialog, {data: data, width: '90%', maxWidth: '650px', autoFocus: false});
        dialogRef.afterClosed().subscribe();
        // todo snackbar po kliknieu w kopiuj link
      })
    });
  }
  
  title: string = CONFIG.LABELS.lesson;
  removeLessonLabel: string = CONFIG.LABELS.removeLesson;
  editLessonLabel: string = CONFIG.LABELS.editLesson;
  deleteLessonText: string = CONFIG.LABELS.deleteLessonConfirmation;
  exportLessonLabel: string = CONFIG.LABELS.exportLesson;
}
