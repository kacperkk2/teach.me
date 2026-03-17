import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppFeatureState } from "..";
import { CoursesState } from "./courses.state";

export interface CourseWithStats {
    id: number;
    name: string;
    lessonIds: number[];
    lessonsCount: number;
    cardsCount: number;
}

const stateSelector = createFeatureSelector<AppFeatureState>('appFeatureKey');
export const selectCoursesState = createSelector(
    stateSelector,
    (state: AppFeatureState) => state.courses
)

export const selectCourses = createSelector(
    selectCoursesState, 
    (state: CoursesState) => state.courses
)

export const selectCoursesList = createSelector(
    selectCoursesState, 
    (state: CoursesState) => Object.values(state.courses)
)

export const selectCourse = (id: number) => createSelector(
    selectCourses,
    (items) => items[id]
)

export const selectCoursesWithStats = createSelector(
    selectCoursesList,
    stateSelector,
    (courses, state): CourseWithStats[] => courses.map(course => ({
        id: course.id,
        name: course.name,
        lessonIds: course.lessonIds,
        lessonsCount: course.lessonIds.length,
        cardsCount: course.lessonIds.reduce((sum, id) => sum + (state.lessons.lessons[id]?.cardIds.length ?? 0), 0)
    }))
)