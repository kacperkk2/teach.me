import { Action, createReducer, on } from "@ngrx/store";
import { LessonsState, initializeState } from "./lessons.state";
import { addLesson, addLessons, loadLessonsState, removeCardIdFromLesson, removeLesson, removeLessons, updateLesson, updateLessonWithCardsIds } from "./lessons.action";
import { Lesson } from "../../model/lesson";


export const lessonsReducer = createReducer<LessonsState>(
    initializeState(),

    on(loadLessonsState, (state, { lessonsState }) => lessonsState),
    on(addLesson, (state, { lesson }) => ({
        ...state,
        lessons: {...state.lessons, [lesson.id]: lesson }
    })),
    on(addLessons, (state, { lessons }) => ({
        ...state, 
        lessons: {
            ...state.lessons, 
            ...lessons.reduce((acc: { [id: number]: Lesson }, lesson) => {
                acc[lesson.id] = lesson;
                return acc;
            }, {}) 
        }
    })),
    on(updateLessonWithCardsIds, (state, { lesson, cardIds }) => {
        const updatedLesson = Object.assign({}, lesson);
        updatedLesson.cardIds = [...updatedLesson.cardIds, ...cardIds]
        return {...state, lessons: {...state.lessons, [lesson.id]: updatedLesson }}
    }),
    on(removeLessons, (state, { lessons }) => {
        const updatedLessons = { ...state.lessons };
        lessons.forEach(lesson => delete updatedLessons[lesson.id])
        return {...state, lessons: updatedLessons};
    }),
    on(removeLesson, (state, { lesson }) => {
        const updatedLessons = { ...state.lessons };
        delete updatedLessons[lesson.id];
        return {...state, lessons: updatedLessons};
    }),
    on(removeCardIdFromLesson, (state, { cardId, lesson }) => {
        const updatedLesson = Object.assign({}, lesson);
        updatedLesson.cardIds = updatedLesson.cardIds.filter(id => id !== cardId);
        return {...state, lessons: {...state.lessons, [lesson.id]: updatedLesson }}
    }),
    on(updateLesson, (state, { lesson }) => {
        const updatedLesson = Object.assign({}, lesson);
        return {...state, lessons: {...state.lessons, [lesson.id]: updatedLesson }}
    }),
)

export function lessonsReducers(state: LessonsState | undefined, action: Action) {
    return lessonsReducer(state, action);
}