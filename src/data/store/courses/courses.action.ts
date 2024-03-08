import { createAction, props } from "@ngrx/store";
import { Course } from "../../model/course";
import { CoursesState } from "./courses.state";

export const loadCoursesState = createAction(
    '[Courses] Load Courses State', 
    props<{ coursesState: CoursesState }>()
);

export const addCourse = createAction(
    '[Courses] Add Course', 
    props<{ course: Course }>()
);

export const updateCourseWithLessonId = createAction(
    '[Courses] Update Course With Lesson Id', 
    props<{ course: Course, lessonId: number }>()
);

export const updateCourseWithLessonIds = createAction(
    '[Courses] Update Course With Lesson Ids', 
    props<{ course: Course, lessonIds: number[] }>()
);

export const removeCourse = createAction(
    '[Courses] Remove Course', 
    props<{ course: Course, lessonIds: number[] }>()
);

export const removeLessonIdFromCourse = createAction(
    '[Courses] Remove Lesson Id From Course', 
    props<{ course: Course, lessonId: number }>()
);

export const updateCourse = createAction(
    '[Courses] Update Course', 
    props<{ course: Course }>()
)