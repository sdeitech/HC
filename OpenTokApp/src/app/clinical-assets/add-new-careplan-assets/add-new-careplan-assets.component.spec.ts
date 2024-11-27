import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCareplanAssetsComponent } from './add-new-careplan-assets.component';

describe('AddNewCareplanAssetsComponent', () => {
  let component: AddNewCareplanAssetsComponent;
  let fixture: ComponentFixture<AddNewCareplanAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewCareplanAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCareplanAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
