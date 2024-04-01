import { ActionReducerMap } from "@ngrx/store";
import { AppEffects } from "./app/app.effect";
import { CardsEffects } from "./cards/cards.effect";
import { cardsReducers } from "./cards/cards.reducer";
import { CardsState } from "./cards/cards.state";
import { CoursesEffects } from "./courses/courses.effect";
import { coursesReducers } from "./courses/courses.reducer";
import { CoursesState } from "./courses/courses.state";
import { LessonsEffects } from "./lessons/lessons.effect";
import { lessonsReducers } from "./lessons/lessons.reducer";
import { LessonsState } from "./lessons/lessons.state";
import { LearnSettingsState } from "./learn-settings/learn-settings.state";
import { learnSettingsReducers } from "./learn-settings/learn-settings.reducer";

export const appFeatureKey = "appFeatureKey";

export interface AppFeatureState {
    courses: CoursesState;
    lessons: LessonsState;
    cards: CardsState;
    learnSettings: LearnSettingsState;
}

export const appFeatureReducers: ActionReducerMap<AppFeatureState> = {
    courses: coursesReducers,
    lessons: lessonsReducers,
    cards: cardsReducers,
    learnSettings: learnSettingsReducers,
}

export const appFeatureEffects: any[] = [AppEffects, CoursesEffects, LessonsEffects, CardsEffects]