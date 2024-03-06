import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportHeaderComponent } from './import-header.component';

describe('ImportHeaderComponent', () => {
  let component: ImportHeaderComponent;
  let fixture: ComponentFixture<ImportHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
