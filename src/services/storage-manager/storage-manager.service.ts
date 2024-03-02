import { Injectable } from '@angular/core';
import { Course } from '../../data/model/course';
import { Lesson } from '../../data/model/lesson';
import { Card } from '../../data/model/card';
import { AppFeatureState } from '../../data/store';

@Injectable({
  providedIn: 'root'
})
export class StorageManagerService {
  appStateKey: string = "appStateKey";

  constructor() { }

  public saveAppState(appState: AppFeatureState) {
    localStorage.setItem(this.appStateKey, JSON.stringify(appState));
  }

  public loadAppState() {
    return JSON.parse(localStorage.getItem(this.appStateKey) || '{}');
  }
}
