import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppFeatureState } from "..";
import { CoursesState } from "./courses.state";

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