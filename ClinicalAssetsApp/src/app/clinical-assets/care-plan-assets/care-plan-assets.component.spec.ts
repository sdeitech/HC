import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarePlanAssetsComponent } from './care-plan-assets.component';

describe('CarePlanComponent', () => {
  let component: CarePlanAssetsComponent;
  let fixture: ComponentFixture<CarePlanAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarePlanAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarePlanAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
