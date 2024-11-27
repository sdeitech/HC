import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContentBlockModalComponent } from './add-content-block-modal.component';

describe('AddContentBlockModalComponent', () => {
  let component: AddContentBlockModalComponent;
  let fixture: ComponentFixture<AddContentBlockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContentBlockModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContentBlockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
