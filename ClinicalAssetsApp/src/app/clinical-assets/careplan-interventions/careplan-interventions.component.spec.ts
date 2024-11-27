import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanInterventionsComponent } from './careplan-interventions.component';

describe('CareplanInterventionsComponent', () => {
  let component: CareplanInterventionsComponent;
  let fixture: ComponentFixture<CareplanInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareplanInterventionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
