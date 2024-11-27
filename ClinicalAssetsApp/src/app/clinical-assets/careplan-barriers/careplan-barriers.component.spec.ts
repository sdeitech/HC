import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanBarriersComponent } from './careplan-barriers.component';

describe('CareplanBarriersComponent', () => {
  let component: CareplanBarriersComponent;
  let fixture: ComponentFixture<CareplanBarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareplanBarriersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanBarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
