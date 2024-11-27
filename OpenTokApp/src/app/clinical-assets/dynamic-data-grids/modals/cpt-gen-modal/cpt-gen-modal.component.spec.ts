import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CptGenModalComponent } from './cpt-gen-modal.component';

describe('CptGenModalComponent', () => {
  let component: CptGenModalComponent;
  let fixture: ComponentFixture<CptGenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CptGenModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CptGenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
