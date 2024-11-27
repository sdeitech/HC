import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseFieldModalComponent } from './response-field-modal.component';

describe('ResponseFieldModalComponent', () => {
  let component: ResponseFieldModalComponent;
  let fixture: ComponentFixture<ResponseFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseFieldModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
