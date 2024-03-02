import { ActionReducerMap } from "@ngrx/store";
import { Course } from "../model/course";
import { CoursesState } from "./courses/courses.state";
import { coursesReducer, coursesReducers } from "./courses/courses.reducer";
import { LessonsState } from "./lessons/lessons.state";
import { lessonsReducers } from "./lessons/lessons.reducer";
import { CardsState } from "./cards/cards.state";
import { cardsReducers } from "./cards/cards.reducer";
import { LessonsEffects } from "./lessons/lessons.effect";
import { CoursesEffects } from "./courses/courses.effect";
import { AppEffects } from "./app/app.effect";
import { CardsEffects } from "./cards/cards.effect";

export const appFeatureKey = "appFeatureKey";

export interface AppFeatureState {
    courses: CoursesState;
    lessons: LessonsState;
    cards: CardsState;
}

export const appFeatureReducers: ActionReducerMap<AppFeatureState> = {
    courses: coursesReducers,
    lessons: lessonsReducers,
    cards: cardsReducers,
}

export const appFeatureEffects: any[] = [AppEffects, CoursesEffects, LessonsEffects, CardsEffects]