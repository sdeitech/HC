import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanDiagnosisComponent } from './careplan-diagnosis.component';

describe('CareplanDiagnosisComponent', () => {
  let component: CareplanDiagnosisComponent;
  let fixture: ComponentFixture<CareplanDiagnosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareplanDiagnosisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
