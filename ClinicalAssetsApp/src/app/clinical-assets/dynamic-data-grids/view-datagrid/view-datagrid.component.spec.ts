import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDatagridComponent } from './view-datagrid.component';

describe('ViewDatagridComponent', () => {
  let component: ViewDatagridComponent;
  let fixture: ComponentFixture<ViewDatagridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDatagridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDatagridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
