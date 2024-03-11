import { CardMigration } from "./card";

export interface Lesson {
    id: number,
    name: string,
    lastLearningDate: Date,
    nextSuggestedLearningDate: Date,
    noMistakeInARow: number,
    cardIds: number[],
    wrongPreviouslyCardIds: number[]
}

export interface LessonMigration {
    name: string,
    cards: CardMigration[],
}