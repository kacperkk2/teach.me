import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoundButtonComponent } from './add-round-button.component';

describe('AddRoundButtonComponent', () => {
  let component: AddRoundButtonComponent;
  let fixture: ComponentFixture<AddRoundButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRoundButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRoundButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
