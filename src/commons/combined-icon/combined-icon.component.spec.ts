import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedIconComponent } from './combined-icon.component';

describe('CombinedIconComponent', () => {
  let component: CombinedIconComponent;
  let fixture: ComponentFixture<CombinedIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CombinedIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CombinedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
