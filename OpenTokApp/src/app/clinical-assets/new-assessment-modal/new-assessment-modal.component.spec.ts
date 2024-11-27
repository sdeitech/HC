import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssessmentModalComponent } from './new-assessment-modal.component';

describe('NewAssessmentModalComponent', () => {
  let component: NewAssessmentModalComponent;
  let fixture: ComponentFixture<NewAssessmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAssessmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssessmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
