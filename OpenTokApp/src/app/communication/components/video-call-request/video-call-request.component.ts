import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ICallInitiatedResultDto } from '../../models';
import { CallAudioService, HubConnectionService, OpenTokService } from '../../services';
import { IUserDto, PortalService, StorageService, SubSinkService } from '@core-services';

@Component({
  selector: 'app-video-call-request',
  templateUrl: './video-call-request.component.html',
  styleUrl: './video-call-request.component.scss'
})
export class VideoCallRequestComponent implements OnInit, OnDestroy {
  private readonly _subSink = new SubSinkService();
  callInitiatedResult!: ICallInitiatedResultDto | null | undefined;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private readonly _inputData: ICallInitiatedResultDto | null | undefined,
    private readonly _matDialogRef: MatDialogRef<VideoCallRequestComponent>,
    private readonly _hubConnectionService: HubConnectionService,
    private readonly _openTokService: OpenTokService,
    private readonly _callAudioService: CallAudioService,
    private readonly _storageService: StorageService,
    private readonly _portalService: PortalService,
  ) {
    this.callInitiatedResult = this._inputData;
  }

  ngOnInit(): void {
    this._callAudioService.playIncomingCallAudio();
    this.setupChatHubCallEndListener();
  }

  ngOnDestroy(): void {
    this._callAudioService.stopIncomingCallAudio();
  }

  onJoinCall() {
    this.handleIncomingCall();
    console.log('callInitiatedResult', this.callInitiatedResult);

    if (this.callInitiatedResult && this.callInitiatedResult.invitaionId)
      this._openTokService.initOpenTokSessionByInvitationId(this.callInitiatedResult.invitaionId, false);

    this._matDialogRef.close();
  }

  onEndCall() {
    this.handleIncomingCall();
    console.log('callInitiatedResult', this.callInitiatedResult);

    this.notifyCallEndIfNeeded();

    this._matDialogRef.close();
  }

  private handleIncomingCall() {
    const connectionId = this._hubConnectionService.getChatHubConnectionId();

    if (connectionId)
      this._subSink.sink = this._openTokService.handleIncomingCall(connectionId)
        .subscribe(data => { });
  }

  private notifyCallEndIfNeeded() {
    const appointmentId = this.callInitiatedResult?.appointmentId || 0;
    const user = this._storageService.getLoggedInUser<IUserDto>();

    if (user
      && appointmentId > 0
      && this._portalService.getPortalType() !== "Client") {
      this._subSink.sink = this._openTokService.callEnd(appointmentId, Number(user.user_id || '0'))
        .subscribe(data => { });
    }
  }

  private setupChatHubCallEndListener() {
    this._subSink.sink = this._hubConnectionService.getChatHubCallEndListener()
      .subscribe(data => {
        this._matDialogRef.close();
      });
  }
}
