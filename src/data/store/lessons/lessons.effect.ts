import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { StorageManagerService } from "../../../services/storage-manager/storage-manager.service";
import { saveAppState } from "../app/app.action";
import { removeLessonIdFromCourse, updateCourseWithLessonId } from "../courses/courses.action";
import { addLesson, loadLessonsState, removeLesson, removeLessons, updateLessonWithCardsIds } from "./lessons.action";
import { selectLessonsList } from "./lessons.selector";
import { IdGeneratorService } from "../../../services/id-generator/id-generator.service";
import { selectCardsByIds } from "../cards/cards.selector";
import { removeCards } from "../cards/cards.action";

@Injectable()
export class LessonsEffects {

    constructor(private actions$: Actions, 
        private store$: Store,
        private storageManager: StorageManagerService,
        private idGenerator: IdGeneratorService) {
    }

    loadLessonsState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadLessonsState),
            withLatestFrom(this.store$.select(selectLessonsList)),
            tap(([payload, lessons]) => 
                this.idGenerator.loadLessonsIds(lessons)
            )
        ),
        { dispatch: false }
    )

    addLesson$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(addLesson),
            switchMap((payload) => 
                of(updateCourseWithLessonId({course: payload.course, lessonId: payload.lesson.id}))
            )
        )
    );

    updateLesson$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(updateLessonWithCardsIds),
            switchMap(() => of(saveAppState()))
        )
    );

    removeLesson$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(removeLesson),
            switchMap((payload) => {
                return of(payload).pipe(
                    withLatestFrom(this.store$.select(selectCardsByIds(payload.cardIds))),
                    map(([payload, cards]) => ({ payload, cards }))
                );
            }),
            switchMap((payload) => 
                of(
                    removeCards({cards: payload.cards}),
                    removeLessonIdFromCourse({lessonId: payload.payload.lesson.id, course: payload.payload.course})
                )
            )
        )
    )

    removeLessons$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(removeLessons),
            switchMap((payload) => {
                return of(payload).pipe(
                    withLatestFrom(this.store$.select(selectCardsByIds(payload.allCardIds))),
                    map(([payload, cards]) => ({ cards }))
                );
            }),
            switchMap((payload) => of(removeCards({cards: payload.cards})))
        )
    )
}