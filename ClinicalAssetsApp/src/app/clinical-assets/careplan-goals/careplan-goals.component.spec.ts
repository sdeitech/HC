import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanGoalsComponent } from './careplan-goals.component';

describe('CareplanGoalsComponent', () => {
  let component: CareplanGoalsComponent;
  let fixture: ComponentFixture<CareplanGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareplanGoalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
