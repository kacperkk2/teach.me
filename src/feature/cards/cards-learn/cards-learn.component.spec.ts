import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsLearnComponent } from './cards-learn.component';

describe('CardsLearnComponent', () => {
  let component: CardsLearnComponent;
  let fixture: ComponentFixture<CardsLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsLearnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
