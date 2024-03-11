import { LessonMigration } from "./lesson"

export interface Course {
    id: number,
    name: string,
    lastLearningDate: Date,
    nextSuggestedLearningDate: Date,
    lessonIds: number[],
    wrongPreviouslyCardIds: number[]
}

export interface CourseMigration {
    name: string,
    lessons: LessonMigration[]
}