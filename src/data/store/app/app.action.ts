import { createAction } from "@ngrx/store";


export const loadAppState = createAction('[App] Load App State')
export const saveAppState = createAction('[App] Save App State')
export const clearAppState = createAction('[App] Clear App State')