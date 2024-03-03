import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsLearnComponent } from './lessons-learn.component';

describe('LessonsLearnComponent', () => {
  let component: LessonsLearnComponent;
  let fixture: ComponentFixture<LessonsLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonsLearnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonsLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
