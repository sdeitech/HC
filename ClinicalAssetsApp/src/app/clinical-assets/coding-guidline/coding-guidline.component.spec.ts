import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingGuidlineComponent } from './coding-guidline.component';

describe('CodingGuidlineComponent', () => {
  let component: CodingGuidlineComponent;
  let fixture: ComponentFixture<CodingGuidlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodingGuidlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodingGuidlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
