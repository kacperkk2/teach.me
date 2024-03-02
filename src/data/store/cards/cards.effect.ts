import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, of, switchMap, tap, withLatestFrom } from "rxjs";
import { StorageManagerService } from "../../../services/storage-manager/storage-manager.service";
import { updateLessonWithCardsIds } from "../lessons/lessons.action";
import { addCards, loadCardsState, removeCards } from "./cards.action";
import { IdGeneratorService } from "../../../services/id-generator/id-generator.service";
import { selectCardsList } from "./cards.selector";
import { saveAppState } from "../app/app.action";

@Injectable()
export class CardsEffects {

    constructor(private actions$: Actions, 
        private store$: Store,
        private storageManager: StorageManagerService,
        private idGenerator: IdGeneratorService) {
    }

    loadCardsState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCardsState),
            withLatestFrom(this.store$.select(selectCardsList)),
            tap(([payload, cards]) => 
                this.idGenerator.loadCardsIds(cards)
            )
        ),
        { dispatch: false }
    )

    addCards$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(addCards),
            switchMap((payload) => 
                of(updateLessonWithCardsIds({lesson: payload.lesson, cardIds: payload.cards.map(card => card.id)}))
            )
        )
    )

    removeCards$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(removeCards),
            switchMap(() => of(saveAppState()))
        )
    );
}