import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFieldModalComponent } from './delete-field-modal.component';

describe('DeleteFieldModalComponent', () => {
  let component: DeleteFieldModalComponent;
  let fixture: ComponentFixture<DeleteFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteFieldModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
