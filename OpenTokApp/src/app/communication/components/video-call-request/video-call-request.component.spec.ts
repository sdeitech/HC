import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallRequestComponent } from './video-call-request.component';

describe('VideoCallRequestComponent', () => {
  let component: VideoCallRequestComponent;
  let fixture: ComponentFixture<VideoCallRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoCallRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCallRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
