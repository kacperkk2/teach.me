import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadAppState } from '../data/store/app/app.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'teachme';

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(loadAppState());
  }
  
}
