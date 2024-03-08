import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, concatMap, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { StorageManagerService } from "../../../services/storage-manager/storage-manager.service";
import { saveAppState } from "../app/app.action";
import { removeLessonIdFromCourse, updateCourseWithLessonId, updateCourseWithLessonIds } from "../courses/courses.action";
import { addLesson, addLessons, loadLessonsState, removeCardIdFromLesson, removeLesson, removeLessons, updateLesson, updateLessonWithCardsIds } from "./lessons.action";
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
            concatMap((payload) => 
                of(updateCourseWithLessonId({course: payload.course, lessonId: payload.lesson.id}))
            )
        )
    );

    addLessons$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(addLessons),
            concatMap((payload) => 
                of(updateCourseWithLessonIds({course: payload.course, lessonIds: payload.lessons.map(lesson => lesson.id)}))
            )
        )
    )

    saveAppState$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(updateLessonWithCardsIds, removeCardIdFromLesson, updateLesson),
            switchMap(() => of(saveAppState()))
        )
    );

    removeLesson$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(removeLesson),
            concatMap((payload) => {
                return of(payload).pipe(
                    withLatestFrom(this.store$.select(selectCardsByIds(payload.cardIds))),
                    map(([payload, cards]) => ({ payload, cards }))
                );
            }),
            concatMap((payload) => 
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
            concatMap((payload) => {
                return of(payload).pipe(
                    withLatestFrom(this.store$.select(selectCardsByIds(payload.allCardIds))),
                    map(([payload, cards]) => ({ cards }))
                );
            }),
            concatMap((payload) => of(removeCards({cards: payload.cards})))
        )
    )
}