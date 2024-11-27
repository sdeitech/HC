import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDataGridModalComponent } from './dynamic-data-grid-modal.component';

describe('DynamicDataGridModalComponent', () => {
  let component: DynamicDataGridModalComponent;
  let fixture: ComponentFixture<DynamicDataGridModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDataGridModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDataGridModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
