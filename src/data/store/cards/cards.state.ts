import { Card } from "../../model/card"


export interface CardsState {
    cards: { [key: number]: Card }
}

export const initializeState = (): CardsState => {
    return {
        cards: {}
        // {
        //     1: {
        //         id: 1,
        //         question: "question 1",
        //         answer: "answer 1",
        //     },
        //     2: {
        //         id: 2,
        //         question: "question 2",
        //         answer: "answer 2",
        //     },
        //     3: {
        //         id: 3,
        //         question: "question 3",
        //         answer: "answer 3",
        //     },
        //     4: {
        //         id: 4,
        //         question: "question 4",
        //         answer: "answer 4",
        //     },
        //     5: {
        //         id: 5,
        //         question: "question 5",
        //         answer: "answer 5",
        //     },
        //     6: {
        //         id: 6,
        //         question: "question 6",
        //         answer: "answer 6",
        //     }
        // }
    }
}