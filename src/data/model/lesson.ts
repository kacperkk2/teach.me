
export interface Lesson {
    id: number,
    name: string,
    lastLearningDate: Date,
    nextSuggestedLearningDate: Date,
    noMistakeInARow: number,
    cardIds: number[],
    wrongPreviouslyCardIds: number[]
}