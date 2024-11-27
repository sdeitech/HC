import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProfileSectionModalComponent } from './new-profile-section-modal.component';

describe('NewProfileSectionModalComponent', () => {
  let component: NewProfileSectionModalComponent;
  let fixture: ComponentFixture<NewProfileSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProfileSectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProfileSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
