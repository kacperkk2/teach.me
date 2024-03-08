import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCourseComponent } from './import-course.component';

describe('ImportCourseComponent', () => {
  let component: ImportCourseComponent;
  let fixture: ComponentFixture<ImportCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
