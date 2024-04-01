import { Action, createReducer, on } from "@ngrx/store";
import { LearnSettingsState, initializeState } from "./learn-settings.state";


export const learnSettingsReducer = createReducer<LearnSettingsState>(
    initializeState(),
)

export function learnSettingsReducers(state: LearnSettingsState | undefined, action: Action) {
    return learnSettingsReducer(state, action);
}