import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarePlanTemplatesComponent } from './care-plan-templates.component';

describe('CarePlanTemplatesComponent', () => {
  let component: CarePlanTemplatesComponent;
  let fixture: ComponentFixture<CarePlanTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarePlanTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarePlanTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
