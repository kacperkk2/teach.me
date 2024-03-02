import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LessonsState } from "./lessons.state";
import { AppFeatureState } from "..";
import { selectCourse } from "../courses/courses.selector";

const stateSelector = createFeatureSelector<AppFeatureState>('appFeatureKey');
export const selectLessonsState = createSelector(
    stateSelector,
    (state: AppFeatureState) => state.lessons
)

export const selectLessons = createSelector(
    selectLessonsState, 
    (state: LessonsState) => state.lessons
)

export const selectLessonsList = createSelector(
    selectLessonsState, 
    (state: LessonsState) => Object.values(state.lessons)
)

export const selectLesson = (id: number) => createSelector(
    selectLessons, 
    (items) => items[id]
)

export const selectLessonsByIds = (ids: number[]) => createSelector(
    selectLessons,
    items => ids.map(id => items[id])
);

export const selectLessonsByCourseId = (id: number) => createSelector(
    selectCourse(id),
    selectLessons,
    (course, lessons) => course.lessonIds.map(id => lessons[id])
);