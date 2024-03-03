import { Lesson } from "../../model/lesson"


export interface LessonsState {
    lessons: { [key: number]: Lesson }
}

export const initializeState = (): LessonsState => {
    return {
        // lessons: {}
        lessons: {
            1: {
                id: 1,
                name: "lesson 1",
                cardIds: [1,2],
                lastLearningDate: new Date(),
                nextSuggestedLearningDate: new Date(),
                noMistakeInARow: 0
            },
            2: {
                id: 2,
                name: "lesson 2",
                cardIds: [3,4],
                lastLearningDate: new Date(),
                nextSuggestedLearningDate: new Date(),
                noMistakeInARow: 0
            },
            3: {
                id: 3,
                name: "lesson 3",
                cardIds: [5,6],
                lastLearningDate: new Date(),
                nextSuggestedLearningDate: new Date(),
                noMistakeInARow: 0
            },
            4: {
                id: 4,
                name: "lesson 4",
                cardIds: [1,2,3,4,5,6],
                lastLearningDate: new Date(),
                nextSuggestedLearningDate: new Date(),
                noMistakeInARow: 0
            }
        }
    }
}