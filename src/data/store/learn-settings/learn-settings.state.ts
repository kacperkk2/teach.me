import { Card } from "../../model/card"


export interface LearnSettingsState {
    shuffle: boolean,
    backFirst: boolean,
}

export const initializeState = (): LearnSettingsState => {
    return {
        shuffle: false,
        backFirst: false,
    }
}