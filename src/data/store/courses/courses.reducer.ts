import { Action, createReducer, on } from "@ngrx/store";
import { CoursesState, initializeState } from "./courses.state";
import { addCourse, loadCoursesState, removeCourse, removeLessonIdFromCourse, updateCourseWithLessonId } from "./courses.action";


export const coursesReducer = createReducer<CoursesState>(
    initializeState(),

    on(loadCoursesState, (state, { coursesState }) => coursesState),
    on(addCourse, (state, { course }) => ({
        ...state,
        courses: {...state.courses, [course.id]: course }
    })),
    on(updateCourseWithLessonId, (state, { course, lessonId }) => {
        const updatedCourse = Object.assign({}, course);
        updatedCourse.lessonIds = [...updatedCourse.lessonIds, lessonId]
        return {...state, courses: {...state.courses, [course.id]: updatedCourse }}
    }),
    on(removeCourse, (state, { course }) => {
        const updatedCourses = { ...state.courses };
        delete updatedCourses[course.id];
        return {...state, courses: updatedCourses}
    }),
    on(removeLessonIdFromCourse, (state, { course, lessonId }) => {
        const updatedCourse = Object.assign({}, course);
        updatedCourse.lessonIds = updatedCourse.lessonIds.filter(id => id !== lessonId);
        return {...state, courses: {...state.courses, [course.id]: updatedCourse }}
    }),
)

export function coursesReducers(state: CoursesState | undefined, action: Action) {
    return coursesReducer(state, action);
}