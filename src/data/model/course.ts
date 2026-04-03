import { LessonMigration } from "./lesson"

export interface Course {
    id: number,
    name: string,
    language?: string,
    lastLearningDate: Date,
    nextSuggestedLearningDate: Date,
    lessonIds: number[],
    wrongPreviouslyCardIds: number[]
}

export interface CourseMigration {
    name: string,
    language?: string,
    lessons: LessonMigration[]
}