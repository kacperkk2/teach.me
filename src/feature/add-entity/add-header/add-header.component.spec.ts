import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHeaderComponent } from './add-header.component';

describe('AddHeaderComponent', () => {
  let component: AddHeaderComponent;
  let fixture: ComponentFixture<AddHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
