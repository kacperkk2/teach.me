
export interface Card {
    id: number,
    question: string,
    answer: string,
    isMarked: boolean,
}

export interface CardMigration {
    question: string,
    answer: string,
}