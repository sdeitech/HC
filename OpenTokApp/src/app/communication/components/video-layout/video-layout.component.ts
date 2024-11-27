import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { interval } from 'rxjs';

import {
  IUserDto,
  PortalService,
  StorageService,
  SubSinkService
} from '@core-services';

import {
  ChatConnectedUserService,
  HubConnectionService,
  OpenTokService
} from '../../services';

import {
  IChatConnectedUserDto,
  IOpenTokSessionDto
} from '../../models';

import { VideoConsultationComponent } from '../video-consultation/video-consultation.component';
import { VideoCallRequestComponent } from '../video-call-request/video-call-request.component';

@Component({
  selector: 'app-video-layout',
  templateUrl: './video-layout.component.html',
  styleUrl: './video-layout.component.scss'
})
export class VideoLayoutComponent implements OnInit, OnDestroy {
  private readonly subSink: SubSinkService = new SubSinkService();
  private isSuperAdmin: boolean = false;

  private _videoConsultationRef!: MatDialogRef<VideoConsultationComponent> | null | undefined;
  private _videoCallRequestRef!: MatDialogRef<VideoCallRequestComponent> | null | undefined;

  constructor(
    private readonly _matDialog: MatDialog,
    private readonly _storageService: StorageService,
    private readonly _portalService: PortalService,
    private readonly _chatConnectedUserService: ChatConnectedUserService,
    private readonly _hubConnectionService: HubConnectionService,
    private readonly _openTokService: OpenTokService,
  ) { }

  ngOnInit(): void {
    this.isSuperAdmin = (this._portalService.getPortalType() === "SuperAdmin");
    const user = this._storageService.getLoggedInUser<IUserDto>();
    const userId = Number(user?.user_id || '0');

    if (!(userId > 0))
      return;

    this.setupChatHubConnection(userId);
    this.startChatHubStatusCheck(userId);
    this.setupVideoConsultationEvents();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private startChatHubStatusCheck(userId: number) {
    if (this.isSuperAdmin)
      return;

    const oneSecond = 1000;
    const tenSeconds = 10 * oneSecond;

    this.subSink.sink = interval(tenSeconds)
      .subscribe(() => {
        if (this._hubConnectionService.isChatHubDisconnected())
          this.setupChatHubConnection(userId);
      });
  }

  private setupChatHubConnection(userId: number) {
    if (this.isSuperAdmin)
      return;

    this._hubConnectionService.createChatHubConnection()
      .then(hub => {
        if (!(hub && hub.connectionId))
          return;

        this.addChatConnectedUser(userId, (hub.connectionId || ''));
        this.configureChatHubEvents();
      });
  }

  private configureChatHubEvents() {
    this.subSink.sink = this._hubConnectionService.getChatHubIncomingCallHandledListener()
      .subscribe(() => {
        if (this._videoCallRequestRef)
          this._videoCallRequestRef.close();

        this._videoCallRequestRef = null;
      });
  }

  private addChatConnectedUser(userId: number, connectionId: string) {
    const model: IChatConnectedUserDto = {
      connectionId: connectionId,
      userId: userId
    };

    this._chatConnectedUserService.addChatConnectedUser(model)
      .subscribe();
  }

  private setupVideoConsultationEvents() {
    this.subSink.sink = this._openTokService.getOTSessionSavedListener()
      .subscribe((openTokSession: IOpenTokSessionDto & { isJoinCall: boolean }) => {
        // If consultation or video call are already in progress then skip it
        if (this._videoConsultationRef || this._videoCallRequestRef)
          return;

        this._matDialog.closeAll();
        this._videoConsultationRef = this._matDialog.open(VideoConsultationComponent, {
          height: 'calc(100vh - 150px)',
          width: '600px',
          maxWidth: '100vw',
          maxHeight: '100vh',
          position: { bottom: '5px', right: '5px' },
          disableClose: true,
          hasBackdrop: false,
          data: openTokSession,
        });

        this.subSink.sink = this._videoConsultationRef
          .afterClosed()
          .subscribe(() => {
            this._videoConsultationRef = null;
          });

        const currentUser = this._storageService.getLoggedInUser<IUserDto>();

        if (currentUser && !openTokSession.isJoinCall)
          this._openTokService.callInitiate(openTokSession.appointmentId, Number(currentUser.user_id))
            .subscribe(() => { });
      });

    this.subSink.sink = this._hubConnectionService.getChatHubCallInitiatedListener()
      .subscribe(data => {
        // If consultation or video call are already in progress then skip it
        if (this._videoConsultationRef || this._videoCallRequestRef)
          return;

        this._matDialog.closeAll();
        this._videoCallRequestRef = this._matDialog.open(VideoCallRequestComponent, {
          width: '300px',
          height: '300px',
          disableClose: true,
          data: data,
        });

        this.subSink.sink = this._videoCallRequestRef
          .afterClosed()
          .subscribe(() => {
            this._videoCallRequestRef = null;
          });

        console.log('data', data);
      });
  }
}
