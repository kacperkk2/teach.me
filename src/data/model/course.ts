
export interface Course {
    id: number,
    name: string,
    lastLearningDate: Date,
    nextSuggestedLearningDate: Date,
    lessonIds: number[]
}