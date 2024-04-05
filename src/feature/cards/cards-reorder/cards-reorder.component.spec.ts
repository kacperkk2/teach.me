import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsReorderComponent } from './cards-reorder.component';

describe('CardsReorderComponent', () => {
  let component: CardsReorderComponent;
  let fixture: ComponentFixture<CardsReorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsReorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
