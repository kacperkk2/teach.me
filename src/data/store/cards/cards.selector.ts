import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppFeatureState } from "..";
import { CardsState } from "./cards.state";
import { selectLesson, selectLessons, selectLessonsByIds } from "../lessons/lessons.selector";
import { selectCourse } from "../courses/courses.selector";
import { Card } from "../../model/card";
import { Lesson } from "../../model/lesson";
import { Course } from "../../model/course";

export interface CardSearchResult {
    card: Card;
    lesson: Lesson;
    course: Course;
}

const stateSelector = createFeatureSelector<AppFeatureState>('appFeatureKey');
export const selectCardsState = createSelector(
    stateSelector,
    (state: AppFeatureState) => state.cards
)

export const selectCards = createSelector(
    selectCardsState, 
    (state: CardsState) => state.cards
)

export const selectCardsList = createSelector(
    selectCardsState, 
    (state: CardsState) => Object.values(state.cards)
)

export const selectCard = (id: number) => createSelector(
    selectCards, 
    (items) => items[id]
)

export const selectCardsByIds = (ids: number[]) => createSelector(
    selectCards,
    items => ids.map(id => items[id])
);

export const selectCardsByLessonId = (id: number) => createSelector(
    selectLesson(id),
    selectCards,
    (lesson, cards) => lesson.cardIds.map(id => cards[id])
);

export const selectCardsByLessonIds = (ids: number[]) => createSelector(
    selectLessonsByIds(ids),
    selectCards,
    (lessons, cards) => {
        let allCards: Card[] = [];
        lessons.forEach(lesson => {
            allCards = [...allCards, ...lesson.cardIds.map(id => cards[id])]
        })
        return allCards;
    }
);

export const selectCardsByUnlockedLessonsInCourse = (courseId: number) => createSelector(
    selectCourse(courseId),
    selectLessons,
    selectCards,
    (course, lessons: { [id: number]: Lesson }, cards) => {
        let allCards: Card[] = [];
        course.lessonIds.forEach(lessonId => {
            const lesson = lessons[lessonId];
            if (lesson && !lesson.isLocked) {
                allCards = [...allCards, ...lesson.cardIds.map((id: number) => cards[id]).filter(Boolean)];
            }
        });
        return allCards;
    }
);

export const selectCardSearchResults = (query: string) => createSelector(
    stateSelector,
    (state: AppFeatureState): CardSearchResult[] => {
        const q = query.toLowerCase();
        const results: CardSearchResult[] = [];
        Object.values(state.courses.courses).forEach(course => {
            course.lessonIds.forEach(lessonId => {
                const lesson = state.lessons.lessons[lessonId];
                if (!lesson) return;
                lesson.cardIds.forEach(cardId => {
                    const card = state.cards.cards[cardId];
                    if (!card) return;
                    if (card.question.toLowerCase().includes(q) || card.answer.toLowerCase().includes(q)) {
                        results.push({ card, lesson, course });
                    }
                });
            });
        });
        return results;
    }
);