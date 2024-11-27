import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalAssetsComponent } from './clinical-assets.component';

describe('ClinicalAssetsComponent', () => {
  let component: ClinicalAssetsComponent;
  let fixture: ComponentFixture<ClinicalAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
