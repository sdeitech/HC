import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspectFieldModalComponent } from './suspect-field-modal.component';

describe('SuspectFieldModalComponent', () => {
  let component: SuspectFieldModalComponent;
  let fixture: ComponentFixture<SuspectFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspectFieldModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspectFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
