import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResponseModalComponent } from './add-response-modal.component';

describe('AddResponseModalComponent', () => {
  let component: AddResponseModalComponent;
  let fixture: ComponentFixture<AddResponseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResponseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
