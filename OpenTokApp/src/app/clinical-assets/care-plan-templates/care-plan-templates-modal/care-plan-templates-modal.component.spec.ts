import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarePlanTemplatesModalComponent } from './care-plan-templates-modal.component';

describe('CarePlanTemplatesModalComponent', () => {
  let component: CarePlanTemplatesModalComponent;
  let fixture: ComponentFixture<CarePlanTemplatesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarePlanTemplatesModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarePlanTemplatesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
