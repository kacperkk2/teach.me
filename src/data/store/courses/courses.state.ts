import { Course } from "../../model/course";

export interface CoursesState {
    courses: { [key: number]: Course }
}

export const initializeState = (): CoursesState => {
    return {
        courses: {}
        // courses: {
        //     1: {
        //         id: 1,
        //         name: "kurs 1",
        //         lastLearningDate: new Date(),
        //         nextSuggestedLearningDate: new Date(),
        //         lessonIds: [1,2] 
        //     },
        //     2: {
        //         id: 2,
        //         name: "kurs 2",
        //         lastLearningDate: new Date(),
        //         nextSuggestedLearningDate: new Date(),
        //         lessonIds: [3] 
        //     },
        //     3: {
        //         id: 3,
        //         name: "kurs 3",
        //         lastLearningDate: new Date(),
        //         nextSuggestedLearningDate: new Date(),
        //         lessonIds: [1,2,3,4] 
        //     }
        // }
    }
}