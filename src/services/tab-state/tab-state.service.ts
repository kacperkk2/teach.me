import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TabStateService {
  pendingLessonsTab: number | null = null;
  pendingCardsTab: number | null = null;
  pendingCardId: number | null = null;
  cardsOrigin: 'lessons' | 'courses' | null = null;
}
