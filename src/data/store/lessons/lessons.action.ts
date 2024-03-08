import { createAction, props } from "@ngrx/store";
import { Lesson } from "../../model/lesson";
import { Course } from "../../model/course";
import { LessonsState } from "./lessons.state";

export const loadLessonsState = createAction(
    '[Lessons] Load Lessons State', 
    props<{ lessonsState: LessonsState }>()
);

export const addLesson = createAction(
    '[Lessons] Add Lesson', 
    props<{ lesson: Lesson, course: Course }>()
)

export const addLessons = createAction(
    '[Lessons] Add Lessons', 
    props<{ lessons: Lesson[], course: Course }>()
)

export const updateLessonWithCardsIds = createAction(
    '[Lesson] Update Lesson With Card Ids', 
    props<{ lesson: Lesson, cardIds: number[] }>()
);

export const removeLesson = createAction(
    '[Lesson] Remove Lesson', 
    props<{ lesson: Lesson, cardIds: number[], course: Course }>()
);

export const removeLessons = createAction(
    '[Lesson] Remove Lessons', 
    props<{ lessons: Lesson[], allCardIds: number[] }>()
);

export const removeCardIdFromLesson = createAction(
    '[Lesson] Remove Card Id From Lesson', 
    props<{ cardId: number, lesson: Lesson }>()
);

export const updateLesson = createAction(
    '[Lesson] Update Lesson', 
    props<{ lesson: Lesson }>()
)
