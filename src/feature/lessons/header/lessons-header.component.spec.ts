import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsHeaderComponent } from './lessons-header.component';

describe('LessonsHeaderComponent', () => {
  let component: LessonsHeaderComponent;
  let fixture: ComponentFixture<LessonsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonsHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
