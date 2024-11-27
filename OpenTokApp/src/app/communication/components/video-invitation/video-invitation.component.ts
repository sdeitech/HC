import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as openTok from '@opentok/client';

import {
  CryptoService,
  ErrorHandlerService,
  IAppResponseDataDto,
  IUserDto,
  LogoutService,
  PortalService,
  StorageService,
  SubSinkService,
  ToastMessageService
} from '@core-services';

import { IArchiveDto, IChatConnectedUserDto, IOpenTokSessionDto } from '../../models';
import { ChatConnectedUserService, HubConnectionService, OpenTokService } from '../../services';
import { ChatBoxComponent } from '../chat-box/chat-box.component';

@Component({
  selector: 'app-video-invitation',
  templateUrl: './video-invitation.component.html',
  styleUrl: './video-invitation.component.scss'
})
export class VideoInvitationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('subscriberPanel') subscriberPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('publisherPanel') publisherPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('screenSharingPublisherPanel') screenSharingPublisherPanel!: ElementRef<HTMLDivElement>;

  private readonly subSink = new SubSinkService();

  _openTokSessionDto: IOpenTokSessionDto | null | undefined;
  userId: number = 0;
  user!: IUserDto | null;
  session!: openTok.Session | null | undefined;
  publisher!: openTok.Publisher | null | undefined;
  screenSharingPublisher!: openTok.Publisher | null | undefined;
  hasScreenSharingCapability: boolean = false;
  hasScreenSharingStopped: boolean = true;
  isFullScreen: boolean = false;
  isPublisherVideo: boolean = true;
  isSubscriberJoined: boolean = true;
  isRecordingAPIRequestInProgress: boolean = false;
  isRecoringInProgress: boolean = false;
  archiveId: string | null = "";

  chatBoxRef!: MatDialogRef<ChatBoxComponent> | null | undefined;

  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _matDialog: MatDialog,
    private readonly _hubConnectionService: HubConnectionService,
    private readonly _chatConnectedUserService: ChatConnectedUserService,
    private readonly _openTokService: OpenTokService,
    private readonly _logoutService: LogoutService,
    private readonly _storageService: StorageService,
    private readonly _portalService: PortalService,
    private readonly _toastMessageService: ToastMessageService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _cryptoService: CryptoService,
  ) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((params) => {
      // const invitationId = params.get('id') || '';
      const invitationId: string = this._cryptoService.encrypt('9517E68E-0546-48C8-9ED6-76D0F8260F08|1');

      if (!invitationId) {
        this.performCallEnd();
        return;
      }

      this.subSink.sink = this._openTokService.getOTSessionSaveFailedListener()
        .subscribe(() => {
          this.performCallEnd();
        });

      this.subSink.sink = this._openTokService.getOTSessionSavedListener()
        .subscribe(() => {
          const user = this._storageService.getLoggedInUser<IUserDto>();
          this.user = user;
          const userId = Number(user?.user_id || '0');
          this.userId = userId;

          if (!(userId > 0))
            return;

          this.setupChatHubConnection(userId);
          this.startChatHubStatusCheck(userId);
          this.setupBeforLogoutListener();
          this.setupChatHubCallEndListener();
          this.setupSessionEvents();
        });

      this.initOpenTokSessionByInvitationId(invitationId);
    });
  }

  ngAfterViewInit(): void {
    this.checkScreenSharingCapability();
  }

  ngOnDestroy(): void {
    if (this.publisher)
      this.session?.unpublish(this.publisher);

    if (this.screenSharingPublisher)
      this.session?.unpublish(this.screenSharingPublisher);

    this.publisher?.destroy();
    this.screenSharingPublisher?.destroy();
    this.session?.disconnect();
    this._storageService.removeOTSession();
    this.subSink.unsubscribe();
  }

  onCloseDialog(): void {
    this.performCallEnd();
  }

  onEndCall(): void {
    this.performCallEnd();
  }

  onStartChat(): void {
    const appointmentId = this._openTokSessionDto?.appointmentId;

    if (!appointmentId) {
      this._toastMessageService
        .add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Missing appointment.'
        });

      return;
    }

    this.chatBoxRef = this._matDialog.open(ChatBoxComponent, {
      height: 'calc(100vh - 150px)',
      width: '600px',
      maxWidth: 'calc(100vw - 50px)',
      maxHeight: 'calc(100vh - 150px)',
      position: { bottom: '5px', left: '5px' },
      disableClose: true,
      hasBackdrop: false,
      data: { appointmentId: appointmentId },
    });

    this.subSink.sink = this.chatBoxRef
      .afterClosed()
      .subscribe(() => {
        this.chatBoxRef = null;
      });
  }

  onStartCallRecording(): void {
    if (!this._openTokSessionDto)
      return;

    const sessionId = this._openTokSessionDto.sessionId;

    this.isRecordingAPIRequestInProgress = true;
    this.subSink.sink = this._openTokService
      .startVideoRecording<IAppResponseDataDto<IArchiveDto>>(sessionId)
      .subscribe({
        next: (response) => {
          this.isRecordingAPIRequestInProgress = false;

          if (!response.isSuccess) {
            this._toastMessageService
              .add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.message
              });

            return;
          }

          this.archiveId = response.data.id;
          this.isRecoringInProgress = true;
        },
        error: (err: any) => {
          this.isRecordingAPIRequestInProgress = false;
          this.handleServerError(err);
        }
      });
  }

  onStopCallRecording(): void {
    if (!this.isRecoringInProgress
      || !this.archiveId
      || !this._openTokSessionDto)
      return;

    const appointmentId = this._openTokSessionDto.appointmentId;

    this.isRecordingAPIRequestInProgress = true;
    this.subSink.sink = this._openTokService
      .stopVideoRecording<IAppResponseDataDto<any>>(this.archiveId, appointmentId)
      .subscribe({
        next: (response) => {
          this.isRecordingAPIRequestInProgress = false;

          if (!response.isSuccess) {
            this._toastMessageService
              .add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.message
              });

            return;
          }

          this.archiveId = null;
          this.isRecoringInProgress = false;
        },
        error: (err) => {
          this.isRecordingAPIRequestInProgress = false;
          this.handleServerError(err);
        }
      });
  }

  onInviteUser(): void {
    this._toastMessageService
      .add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Not implemented.'
      });
  }

  onToggleVideo(): void {
    if (!this.publisher)
      return;

    this.isPublisherVideo = !this.isPublisherVideo;
    this.publisher.publishAudio(true);
    this.publisher.publishVideo(this.isPublisherVideo);
  }

  onStartScreenSharing(): void {
    if (!this.session)
      return;

    this.stopScreenSharing();

    this.hasScreenSharingStopped = false;
    this.screenSharingPublisher
      = this.createAndInitPublisher
        (
          this.session,
          this.screenSharingPublisherPanel.nativeElement,
          true
        );

    this.screenSharingPublisher
      .on('mediaStopped', (event) => {
        // console.log('mediaStopped - event', event);
        this.hasScreenSharingStopped = true;
      });

    this.screenSharingPublisher
      .on('streamDestroyed', (event) => {
        console.log('streamDestroyed - event', event);
        this.hasScreenSharingStopped = true;
        // if (event.reason === 'mediaStopped' || event.reason === 'forceUnpublished') {
        //   // User clicked stop sharing
        // }
      });
  }

  onStopScreenSharing() {
    this.stopScreenSharing();
  }

  onBeginFullScreen() {
    // this._dialogRef.updatePosition({ left: '5px', top: '5px' });
    // this._dialogRef.updateSize('calc(100vw - 10px)', 'calc(100vh - 10px)');

    this.isFullScreen = true;
  }

  onExitFullScreen() {
    // this._dialogRef.updatePosition({ right: '5px', bottom: '5px' });
    // this._dialogRef.updateSize('600px', 'calc(100vh - 150px)');

    this.isFullScreen = false;
  }

  private initOpenTokSessionByInvitationId(invitationId: string) {
    const subscription = this._openTokService.initOpenTokSessionByInvitationId(invitationId, true);

    if (subscription)
      this.subSink.sink = subscription;
  }

  private setupSessionEvents() {
    this._openTokSessionDto = this._storageService.getOTSession();

    if (!this._openTokSessionDto) {

      this._toastMessageService
        .add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Open tok session not saved.'
        });

      this.performCallEnd();
      return;
    }

    this.session = this.initializeSession(this._openTokSessionDto);
  }

  private initializeSession(openTokSessionDto: IOpenTokSessionDto) {
    // console.log('openTokSessionDto', openTokSessionDto);
    const session = this._openTokService.initSession(openTokSessionDto);

    this.subSink.sink = this._openTokService
      .getStreamCreatedListener()
      .subscribe(event => this.createSubscriber(event.target, event.stream));

    this.subSink.sink = this._openTokService
      .getArchiveStartedListener()
      .subscribe(event => {
        this.isRecoringInProgress = true;
        this.archiveId = event.id;
      });

    this.subSink.sink = this._openTokService
      .getArchiveStoppedListener()
      .subscribe(event => {
        this.isRecoringInProgress = false;
        this.archiveId = null;
      });

    session.on('sessionDisconnected', (event) => {
      console.log('You were disconnected from the session.', event.reason);
    });

    // Connect to the session
    session.connect(openTokSessionDto.token, (error) => {
      if (error) {
        this.handleError(error);
        return;
      }

      // If the connection is successful, publish the publisher to the session
      this.publisher = this.createAndInitPublisher(session, this.publisherPanel.nativeElement, false);
    });

    return session;
  }

  private handleError = (error: openTok.OTError | undefined) => {
    if (!error)
      return;

    console.error(error);

    this._toastMessageService
      .add({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
      });
  }

  private handleScreenSharingError = (error: openTok.OTError | undefined) => {
    if (!error)
      return;

    console.error(error);

    this._toastMessageService
      .add({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
      });

    this.stopScreenSharing();
  }

  private handleServerError(error: any) {
    this._errorHandlerService.handleError(error);
  }

  private createSubscriber(session: openTok.Session, stream: openTok.Stream) {
    this.isSubscriberJoined = true;

    const subscriberOptions: openTok.WidgetProperties = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      showControls: true,
    };

    const subscriber = session.subscribe(
      stream,
      this.subscriberPanel.nativeElement,
      subscriberOptions,
      this.handleError
    );

    // Ref - https://github.com/opentok/opentok-web-samples/tree/main/Basic-Captions
    subscriber.subscribeToCaptions(true)
      .then(() => {
        console.log('subscribeToCaptions - data');
      });

    // Ref - https://github.com/opentok/opentok-web-samples/tree/main/Basic-Captions
    subscriber.on('captionReceived', (event) => {
      console.log(`Caption received for stream ${event.streamId}`);
      console.log(`Caption text: ${event.caption}`);
      console.log(`Final text: ${event.isFinal}`);
    })
  }

  private createAndInitPublisher(session: openTok.Session, element: HTMLDivElement, isScreenSharing: boolean) {
    // Ref - https://github.com/opentok/opentok-web-samples/tree/main/Basic-Captions
    // initialize the publisher
    const publisherOptions: openTok.PublisherProperties = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      showControls: true,
      publishCaptions: true, // call transcription work
    };

    const errorHandler = isScreenSharing
      ? this.handleScreenSharingError
      : this.handleError;

    if (isScreenSharing)
      publisherOptions.videoSource = 'screen';

    const publisher = openTok.initPublisher(
      element,
      publisherOptions,
      errorHandler
    );

    session.publish(publisher, errorHandler);

    // try {
    //   if (this._openTokSessionDto) {
    //     const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjY3MjYwOTA0NDAxNzk3MTIiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoialhRd0xVam9NcjJYQUdLWGRZdWVHM2VMcURabjE0NFZAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNzI2NzI3ODYxLCJleHAiOjE3MjY4MTQyNjEsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6ImpYUXdMVWpvTXIyWEFHS1hkWXVlRzNlTHFEWm4xNDRWIn0.V7kXK6-P_FIwdPqyRpwMReGp0STztOdUHvJEoYJIslvr43RPpzHN-xgXDu-FT0KFzPDx63NnTtqQpkxGtT2Tz9Mk9i0X-hHQNTmQl_Ayysb-J-DPYMP77pTUYDh9QiTmow7DpjH0yB6Goi3UwTQShFH5Yft9qYc2B21lE2Um7peN83PL_jW2-OsUD6ZClMLansaTdC281xdsqHyqf5KOmxKAyQQZIhnfYfqu0hyoxY_Ch8fvCAgOHDuY-5zExH0RScXwlnj5RjaT0cK557Uixg2oGA7k12j9Lz-4vOHXjFB1QzS-VOl8Kl4nLbkdmiKfQ4Nf3k7HZ1Klj15fuTnoCg';
    //     this.configurePublisher(publisher, this._openTokSessionDto.appointmentId, accessToken, this._openTokSessionDto.email, this._openTokSessionDto.name);
    //   }
    // }
    // catch { }

    return publisher;
  }

  private stopScreenSharing() {
    if (this.screenSharingPublisher)
      this.session?.unpublish(this.screenSharingPublisher);

    this.screenSharingPublisher?.destroy();
    this.screenSharingPublisher = null;
  }

  private checkScreenSharingCapability() {
    const callback = (response: openTok.ScreenSharingCapabilityResponse) => {
      if (!response.supported || response.extensionRegistered === false) {
        // This browser does not support screen sharing.
        this.hasScreenSharingCapability = false;
      } else if (response.extensionInstalled === false) {
        // Prompt to install the extension.
        this.hasScreenSharingCapability = false;
      } else {
        // Screen sharing is available. Publish the screen.
        this.hasScreenSharingCapability = true;
      }
    };

    openTok.checkScreenSharingCapability(callback);
  }

  private notifyCallEndIfNeeded() {
    // const appointmentId = this._openTokSessionDto?.appointmentId || 0;
    // const user = this._storageService.getLoggedInUser<IUserDto>();

    // if (user
    //   && appointmentId > 0
    //   && this._portalService.getPortalType() !== "Client") {
    //   this.subSink.sink = this._openTokService
    //     .callEnd(appointmentId, Number(user.user_id || '0'))
    //     .subscribe(data => { });
    // }
  }

  private setupBeforLogoutListener() {
    this.subSink.sink = this._logoutService.getBeforLogoutListener()
      .subscribe(() => {
        this.performCallEnd();
      });
  }

  private setupChatHubCallEndListener() {
    this.subSink.sink = this._hubConnectionService.getChatHubCallEndListener()
      .subscribe(data => {
        this.performCallEnd();
      });
  }

  private performCallEnd() {
    this.notifyCallEndIfNeeded();

    if (this.user)
      this._chatConnectedUserService.deleteChatConnectedUser(Number(this.user.user_id))
        .subscribe();

    this._hubConnectionService.disposeChatHubConnection();
    this._logoutService.performLogout('/waiting-room/thank-you');
  }

  private setMaxWidth() {
    const dialogElement = this.findHTMLElementByClassName(this.subscriberPanel.nativeElement, 'mat-mdc-dialog-panel');

    if (dialogElement)
      dialogElement.style.width = dialogElement.style.maxWidth;
  }

  private findHTMLElementByClassName(element: HTMLElement | null, className: string) {
    if (!element)
      return null;

    while (element) {
      if (this.isElementHavingClass(element, className))
        return element;

      element = element.parentElement;
    }

    return null;
  }

  private isElementHavingClass(element: HTMLElement, className: string) {
    for (let x = 0; x < element.classList.length; x++) {
      if (element.classList[x].toLocaleLowerCase() === className.toLocaleLowerCase())
        return true;
    }

    return false;
  }

  /**
   * Ref Link - https://developer.vonage.com/en/blog/voice-transcription-with-symbl-ai-and-the-vonage-video-api
   * @param publisher openTok.Publisher
   */
  private configurePublisher(publisher: openTok.Publisher, appointmentId: number, accessToken: string, userEmailId: string, userName: string) {
    const audioTrack = publisher.getAudioSource()
    const stream = new MediaStream();

    stream.addTrack(audioTrack);

    const AudioContext = window.AudioContext;
    const context = new AudioContext();

    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);
    const gainNode = context.createGain();

    source.connect(gainNode);
    gainNode.connect(processor);
    processor.connect(context.destination);

    // gainNode.gain.value = 2;

    const bufferSize = 1024;
    const uniqueMeetingId = btoa(`Appointment-${appointmentId}`);
    const ws = this.getWebSocket(accessToken, uniqueMeetingId);

    processor.onaudioprocess = (e) => {
      // convert to 16-bit payload
      const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(bufferSize);
      const targetBuffer = new Int16Array(inputData.length);
      for (let index = inputData.length; index > 0; index--) {
        targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
      }
      // Send audio stream to websocket.
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(targetBuffer.buffer);
      }
    };

    // Fired when a message is received from the WebSocket server
    ws.onmessage = (event) => {
      // You can find the conversationId in event.message.data.conversationId;
      const data = JSON.parse(event.data);
      if (data.type === 'message' && data.message.hasOwnProperty('data')) {
        console.log('conversationId', data.message.data.conversationId);
      }
      if (data.type === 'message_response') {
        for (let message of data.messages) {
          console.log('Transcript (more accurate): ', message.payload.content);
        }
      }
      if (data.type === 'topic_response') {
        for (let topic of data.topics) {
          console.log('Topic detected: ', topic.phrases)
        }
      }
      if (data.type === 'insight_response') {
        for (let insight of data.insights) {
          console.log('Insight detected: ', insight.payload.content);
        }
      }
      if (data.type === 'message' && data.message.hasOwnProperty('punctuated')) {
        console.log('Live transcript (less accurate): ', data.message.punctuated.transcript)
      }
      console.log(`Response type: ${data.type}. Object: `, data);
    };

    // Fired when the WebSocket closes unexpectedly due to an error or lost connection
    ws.onerror = (err) => {
      console.error(err);
    };

    // Fired when the WebSocket connection has been closed
    ws.onclose = (event) => {
      console.info('Connection to websocket closed');
    };

    // Fired when the connection succeeds.
    ws.onopen = (event) => {
      ws.send(JSON.stringify({
        type: 'start_request',
        meetingTitle: `Teleconsultation for Appointment-${appointmentId}`, // Conversation name
        insightTypes: ['question', 'action_item'], // Will enable insight generation
        config: {
          confidenceThreshold: 0.5,
          languageCode: 'en-US',
          speechRecognition: {
            encoding: 'LINEAR16',
            sampleRateHertz: 44100,
          }
        },
        speaker: {
          userId: userEmailId,
          name: userName,
        }
      }));
    };
  }

  private getWebSocket(accessToken: string, uniqueMeetingId: string) {
    const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;
    const websocket = new WebSocket(symblEndpoint);
    return websocket;
  }

  private startChatHubStatusCheck(userId: number) {
    const oneSecond = 1000;
    const tenSeconds = 10 * oneSecond;

    this.subSink.sink = interval(tenSeconds)
      .subscribe(() => {
        if (this._hubConnectionService.isChatHubDisconnected())
          this.setupChatHubConnection(userId);
      });
  }

  private setupChatHubConnection(userId: number) {
    this._hubConnectionService.createChatHubConnection()
      .then(hub => {
        if (!(hub && hub.connectionId))
          return;

        this.addChatConnectedUser(userId, (hub.connectionId || ''));
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
}
