import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTemplateModalComponent } from './new-template-modal.component';

describe('NewTemplateModalComponent', () => {
  let component: NewTemplateModalComponent;
  let fixture: ComponentFixture<NewTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTemplateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
