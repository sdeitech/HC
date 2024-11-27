import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDataGridsComponent } from './dynamic-data-grids.component';

describe('DynamicDataGridsComponent', () => {
  let component: DynamicDataGridsComponent;
  let fixture: ComponentFixture<DynamicDataGridsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDataGridsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDataGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
