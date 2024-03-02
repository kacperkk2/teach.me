import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnTypeTileComponent } from './learn-type-tile.component';

describe('LearnTypeTileComponent', () => {
  let component: LearnTypeTileComponent;
  let fixture: ComponentFixture<LearnTypeTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LearnTypeTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LearnTypeTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
