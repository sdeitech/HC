import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalAssessmentComponent } from './clinical-assessment.component';

describe('ClinicalAssessmentComponent', () => {
  let component: ClinicalAssessmentComponent;
  let fixture: ComponentFixture<ClinicalAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
