import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { IdGeneratorService } from "../../../services/id-generator/id-generator.service";
import { StorageManagerService } from "../../../services/storage-manager/storage-manager.service";
import { saveAppState } from "../app/app.action";
import { addCourse, loadCoursesState, removeCourse, updateCourseWithLessonId } from "../courses/courses.action";
import { removeLessons } from "../lessons/lessons.action";
import { selectLessonsByIds } from "../lessons/lessons.selector";
import { selectCoursesList } from "./courses.selector";
import { Lesson } from "../../model/lesson";

@Injectable()
export class CoursesEffects {

    constructor(private actions$: Actions, 
        private store$: Store,
        private storageManager: StorageManagerService,
        private idGenerator: IdGeneratorService) {
    }

    loadCoursesState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCoursesState),
            withLatestFrom(this.store$.select(selectCoursesList)),
            tap(([payload, courses]) => 
                this.idGenerator.loadCoursesIds(courses)
            )
        ),
        { dispatch: false }
    )
    
    addOrUpdateCourse$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(addCourse, updateCourseWithLessonId),
            switchMap(() => of(saveAppState()))
        )
    )

    removeCourse$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(removeCourse),
            switchMap((payload) => {
                return of(payload).pipe(
                    withLatestFrom(this.store$.select(selectLessonsByIds(payload.lessonIds))),
                    map(([payload, lessons]) => ({ lessons }))
                );
            }),
            switchMap((payload) => {
                const allCardIds = payload.lessons.reduce((acc: number[], lesson: Lesson) => {
                    return acc.concat(lesson.cardIds);
                }, []);
                return of(removeLessons({lessons: payload.lessons, allCardIds: allCardIds}))
            })
        )
    )
}