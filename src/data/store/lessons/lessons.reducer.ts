import { Action, createReducer, on } from "@ngrx/store";
import { LessonsState, initializeState } from "./lessons.state";
import { addLesson, loadLessonsState, removeLesson, removeLessons, updateLessonWithCardsIds } from "./lessons.action";


export const lessonsReducer = createReducer<LessonsState>(
    initializeState(),

    on(loadLessonsState, (state, { lessonsState }) => lessonsState),
    on(addLesson, (state, { lesson }) => ({
        ...state,
        lessons: {...state.lessons, [lesson.id]: lesson }
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
)

export function lessonsReducers(state: LessonsState | undefined, action: Action) {
    return lessonsReducer(state, action);
}