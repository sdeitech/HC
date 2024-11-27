import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFieldModalComponent } from './new-field-modal.component';

describe('NewFieldModalComponent', () => {
  let component: NewFieldModalComponent;
  let fixture: ComponentFixture<NewFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFieldModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
