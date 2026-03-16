import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TabStateService {
  pendingLessonsTab: number | null = null;
  pendingCardsTab: number | null = null;
}
