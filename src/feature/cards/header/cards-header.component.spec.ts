import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsHeaderComponent } from './cards-header.component';

describe('CardsHeaderComponent', () => {
  let component: CardsHeaderComponent;
  let fixture: ComponentFixture<CardsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardsHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
