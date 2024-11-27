import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarePlanTemplateDetailsComponent } from './care-plan-template-details.component';

describe('CarePlanTemplateDetailsComponent', () => {
  let component: CarePlanTemplateDetailsComponent;
  let fixture: ComponentFixture<CarePlanTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarePlanTemplateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarePlanTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
