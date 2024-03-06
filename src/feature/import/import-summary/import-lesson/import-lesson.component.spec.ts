import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLessonComponent } from './import-lesson.component';

describe('ImportLessonComponent', () => {
  let component: ImportLessonComponent;
  let fixture: ComponentFixture<ImportLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportLessonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
