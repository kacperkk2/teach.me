import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private scrolledDown = new BehaviorSubject<boolean>(false);
  scrolledDown$ = this.scrolledDown.asObservable();

  setScrolledDown(value: boolean): void {
    this.scrolledDown.next(value);
  }
}
