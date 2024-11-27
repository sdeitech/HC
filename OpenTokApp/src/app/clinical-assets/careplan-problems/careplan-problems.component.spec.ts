import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanProblemsComponent } from './careplan-problems.component';

describe('CareplanProblemsComponent', () => {
  let component: CareplanProblemsComponent;
  let fixture: ComponentFixture<CareplanProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareplanProblemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
