import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConditionalQuestionModalComponent } from './add-conditional-question-modal.component';

describe('AddConditionalQuestionModalComponent', () => {
  let component: AddConditionalQuestionModalComponent;
  let fixture: ComponentFixture<AddConditionalQuestionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConditionalQuestionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConditionalQuestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
