import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCarePlanTemplateDetailsComponent } from './add-new-care-plan-template-details.component';

describe('AddNewCarePlanTemplateDetailsComponent', () => {
  let component: AddNewCarePlanTemplateDetailsComponent;
  let fixture: ComponentFixture<AddNewCarePlanTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewCarePlanTemplateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCarePlanTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
