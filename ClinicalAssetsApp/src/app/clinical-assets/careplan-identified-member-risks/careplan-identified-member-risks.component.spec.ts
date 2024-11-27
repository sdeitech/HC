import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanIdentifiedMemberRisksComponent } from './careplan-identified-member-risks.component';

describe('CareplanIdentifiedMemberRisksComponent', () => {
  let component: CareplanIdentifiedMemberRisksComponent;
  let fixture: ComponentFixture<CareplanIdentifiedMemberRisksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareplanIdentifiedMemberRisksComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanIdentifiedMemberRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
