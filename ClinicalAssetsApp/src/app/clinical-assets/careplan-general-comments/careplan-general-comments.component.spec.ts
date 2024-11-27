import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareplanGeneralCommentsComponent } from './careplan-general-comments.component';

describe('CareplanGeneralCommentsComponent', () => {
  let component: CareplanGeneralCommentsComponent;
  let fixture: ComponentFixture<CareplanGeneralCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareplanGeneralCommentsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareplanGeneralCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
