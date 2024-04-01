import { Action, createReducer, on } from "@ngrx/store";
import { CardsState, initializeState } from "./cards.state";
import { addCards, loadCardsState, removeCard, removeCards, updateCard, updateCards } from "./cards.action";
import { Card } from "../../model/card";


export const cardsReducer = createReducer<CardsState>(
    initializeState(),

    on(loadCardsState, (state, { cardsState }) => cardsState),
    on(addCards, (state, { cards }) => ({
        ...state, 
        cards: {
            ...state.cards, 
            ...cards.reduce((acc: { [id: number]: Card }, card) => {
                acc[card.id] = card;
                return acc;
            }, {}) 
        }
    })),
    on(removeCards, (state, { cards }) => {
        const updatedCards = { ...state.cards };
        cards.forEach(card => delete updatedCards[card.id])
        return {...state, cards: updatedCards}
    }),
    on(updateCard, (state, { card }) => {
        const updatedCard = Object.assign({}, card);
        return {...state, cards: {...state.cards, [card.id]: updatedCard }}
    }),
    on(updateCards, (state, { cards }) => {
        const updatedCards = { ...state.cards };
        cards.forEach(card => updatedCards[card.id] = card)
        return {...state, cards: updatedCards}
    }),
    on(removeCard, (state, { cardId }) => {
        const updatedCards = { ...state.cards };
        delete updatedCards[cardId];
        return {...state, cards: updatedCards}
    }),
)

export function cardsReducers(state: CardsState | undefined, action: Action) {
    return cardsReducer(state, action);
}