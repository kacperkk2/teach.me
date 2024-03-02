import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppFeatureState } from "..";
import { CardsState } from "./cards.state";
import { selectLesson } from "../lessons/lessons.selector";

const stateSelector = createFeatureSelector<AppFeatureState>('appFeatureKey');
export const selectCardsState = createSelector(
    stateSelector,
    (state: AppFeatureState) => state.cards
)

export const selectCards = createSelector(
    selectCardsState, 
    (state: CardsState) => state.cards
)

export const selectCardsList = createSelector(
    selectCardsState, 
    (state: CardsState) => Object.values(state.cards)
)

export const selectCard = (id: number) => createSelector(
    selectCards, 
    (items) => items[id]
)

export const selectCardsByIds = (ids: number[]) => createSelector(
    selectCards,
    items => ids.map(id => items[id])
);

export const selectCardsByLessonId = (id: number) => createSelector(
    selectLesson(id),
    selectCards,
    (lesson, cards) => lesson.cardIds.map(id => cards[id])
);