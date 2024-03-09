import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, of, switchMap, tap, withLatestFrom } from "rxjs";
import { AppFeatureState } from "..";
import { StorageManagerService } from "../../../services/storage-manager/storage-manager.service";
import { loadCardsState } from "../cards/cards.action";
import { loadCoursesState } from "../courses/courses.action";
import { loadLessonsState } from "../lessons/lessons.action";
import { clearAppState, loadAppState, saveAppState } from "./app.action";
import { selectAppState } from "./app.selector";

@Injectable()
export class AppEffects {

    constructor(private actions$: Actions, 
        private store$: Store,
        private storageManager: StorageManagerService) {
    }

    laodAppState$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAppState),
            switchMap(() => {
                const appState: AppFeatureState = this.storageManager.loadAppState();
                if (Object.keys(appState).length == 0) {
                    return of();
                }
                return of(
                    loadCoursesState({coursesState: appState.courses}),
                    loadLessonsState({lessonsState: appState.lessons}),
                    loadCardsState({cardsState: appState.cards})
                )
            })
        )
    )

    saveAppState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(saveAppState),
            withLatestFrom(this.store$.select(selectAppState)),
            tap(([payload, appState]) => 
                this.storageManager.saveAppState(appState)
            )
        ),
        { dispatch: false }
    )

    clearAppState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(clearAppState),
            tap((payload) => 
                this.storageManager.clearAppState()
            )
        ),
        { dispatch: false }
    )
}