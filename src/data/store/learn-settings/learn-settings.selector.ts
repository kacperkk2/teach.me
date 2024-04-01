import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppFeatureState } from "..";

const stateSelector = createFeatureSelector<AppFeatureState>('appFeatureKey');
export const selectLearnSettingsState = createSelector(
    stateSelector,
    (state: AppFeatureState) => state.learnSettings
)
