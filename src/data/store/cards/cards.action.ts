import { createAction, props } from "@ngrx/store";
import { Card } from "../../model/card";
import { CardsState } from "./cards.state";
import { Lesson } from "../../model/lesson";

export const loadCardsState = createAction(
    '[Cards] Load Cards State', 
    props<{ cardsState: CardsState }>()
);

export const addCards = createAction(
    '[Cards] Add Cards', 
    props<{ cards: Card[], lesson: Lesson }>()
)

export const removeCards = createAction(
    '[Cards] Remove Cards', 
    props<{ cards: Card[] }>()
)