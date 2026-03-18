import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LearningPreferencesService {

  private readonly REVERSED_MODE_KEY = 'reversedMode';

  get reversedMode(): boolean {
    return localStorage.getItem(this.REVERSED_MODE_KEY) === 'true';
  }

  set reversedMode(value: boolean) {
    localStorage.setItem(this.REVERSED_MODE_KEY, String(value));
  }
}
