import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appFeatureEffects, appFeatureKey, appFeatureReducers } from '../data/store';
import { AddCardComponent } from '../feature/add-entity/add-card/add-card.component';
import { AddCourseComponent } from '../feature/add-entity/add-course/add-course.component';
import { AddHeaderComponent } from '../feature/add-entity/add-header/add-header.component';
import { AddLessonComponent } from '../feature/add-entity/add-lesson/add-lesson.component';
import { CardsComponent } from '../feature/cards/cards.component';
import { CardsHeaderComponent } from '../feature/cards/header/cards-header.component';
import { CoursesComponent } from '../feature/courses/courses.component';
import { CoursesHeaderComponent } from '../feature/courses/header/courses-header.component';
import { LessonsHeaderComponent } from '../feature/lessons/header/lessons-header.component';
import { LessonsComponent } from '../feature/lessons/lessons.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LessonsListComponent } from '../feature/lessons/lessons-list/lessons-list.component';
import { CardsListComponent } from '../feature/cards/cards-list/cards-list.component';
import { CardsLearnComponent } from '../feature/cards/cards-learn/cards-learn.component';
import { LearnComponent } from '../feature/learn/learn.component';
import { RoundComponent } from '../feature/learn/round/round.component';
import { SummaryComponent } from '../feature/learn/summary/summary.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AddRoundButtonComponent } from '../commons/add-round-button/add-round-button.component';
import { LearnTypeTileComponent } from '../commons/learn-type-tile/learn-type-tile.component';
import { ConfirmDialog } from '../commons/confirm-dialog/confirm-dialog';
import { ConfirmDeleteDialog } from '../commons/confirm-delete-dialog/confirm-delete-dialog';
import { EditHeaderComponent } from '../feature/edit-entity/edit-header/edit-header.component';
import { EditCardComponent } from '../feature/edit-entity/edit-card/edit-card.component';
import { EditLessonComponent } from '../feature/edit-entity/edit-lesson/edit-lesson.component';
import { LessonsLearnComponent } from '../feature/lessons/lessons-learn/lessons-learn.component';
import { EditCourseComponent } from '../feature/edit-entity/edit-course/edit-course.component';
import { EmptyViewComponent } from '../commons/empty-view/empty-view.component';
import { ExportDialog } from '../commons/export-dialog/export-dialog';
import { ImportComponent } from '../feature/import/import.component';
import { ImportHeaderComponent } from '../feature/import/import-header/import-header.component';
import { ImportPreviewComponent } from '../feature/import/import-preview/import-preview.component';
import { ImportLessonComponent } from '../feature/import/import-summary/import-lesson/import-lesson.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    CoursesComponent,
    LessonsComponent,
    CardsComponent,
    AddCourseComponent,
    AddLessonComponent,
    AddCardComponent,
    CoursesHeaderComponent,
    LessonsHeaderComponent,
    CardsHeaderComponent,
    AddHeaderComponent,
    LessonsListComponent,
    CardsListComponent,
    CardsLearnComponent,
    LearnComponent,
    RoundComponent,
    SummaryComponent,
    AddRoundButtonComponent,
    LearnTypeTileComponent,
    EditCardComponent,
    EditHeaderComponent,
    ConfirmDialog,
    ConfirmDeleteDialog,
    EditLessonComponent,
    LessonsLearnComponent,
    EditCourseComponent,
    EmptyViewComponent,
    ExportDialog,
    ImportComponent,
    ImportHeaderComponent,
    ImportPreviewComponent,
    ImportLessonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FlexLayoutModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    TextFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    ClipboardModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatMenuModule,
    StoreModule.forFeature(appFeatureKey, appFeatureReducers),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forFeature(appFeatureEffects),
    EffectsModule.forRoot([]),
    MatProgressBarModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // TODO LIST
  // 1. zawsze na gornym pasku wyswietlac gdzie sie znajduje, jaki kurs i jakas lekcja itp
  // 2. tak samo dla tworzenia nowych - pokazac gdzie sie to tworzy
  // 3. ogarnac metody onInit, zrobic ladnie metoda per operacaja w init
  // 4. jak lista jest dluga to na dole ekranu tak takiego fade out zeby bylo widac ze nizej cos jest

  // POMYSLY
  // 1. dac mozliwosc edycji wszystkich fiszek - wtedy widok jak przy dodawaniu
  // 2. przy dodawaniu fiszek mozliwosc zmiany widoku z kart na textarea
}
