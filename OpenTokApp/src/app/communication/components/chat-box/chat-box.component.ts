import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  ErrorHandlerService,
  IAppResponseDataDto,
  StorageService,
  SubSinkService,
  ToastMessageService
} from '@core-services';

import { IChatRoomMessageDto } from '../../models';

import {
  ChatRoomMessageService,
  HubConnectionService
} from '../../services';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly subSink = new SubSinkService();
  private readonly appointmentId: number = 0;
  readonly userId: number = 0;
  isLoadingMessages: boolean = false;
  isPostingMessages: boolean = false;
  message: string = '';
  messages: IChatRoomMessageDto[] = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private readonly _inputData: { appointmentId: number } | null | undefined,
    private readonly _dialogRef: MatDialogRef<ChatBoxComponent>,
    private readonly _toastMessageService: ToastMessageService,
    private readonly _chatRoomMessageService: ChatRoomMessageService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _storageService: StorageService,
    private readonly _hubConnectionService: HubConnectionService,
  ) {
    if (this._inputData && this._inputData.appointmentId > 0)
      this.appointmentId = this._inputData.appointmentId;

    this.userId = Number(this._storageService.getLoggedInUser<{ user_id: string }>()?.user_id || '0');
  }

  ngOnInit(): void {
    if (!this._inputData || !this._inputData.appointmentId) {
      this._toastMessageService
        .add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Missing appointment.'
        });

      this.onClose();
    }
  }

  ngAfterViewInit(): void {
    this.getChatRoomMessages(this.appointmentId);

    this.subSink.sink = this._hubConnectionService.getChatHubMessageSentListener()
      .subscribe(() => {
        this.getChatRoomMessages(this.appointmentId);
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  onPostMessage() {
    const messageToPost: IChatRoomMessageDto = {
      fromUserId: this.userId,
      roomMessage: (this.message || '').trim(),
      isMessage: true,
      isRecording: false,
      isFile: false,
      messageDate: new Date(),
      appointmentId: this.appointmentId
    };

    this.isPostingMessages = true;

    this.subSink.sink = this._chatRoomMessageService.addChatRoomMessage<IAppResponseDataDto<IChatRoomMessageDto>>(messageToPost)
      .subscribe({
        next: response => {
          this.isPostingMessages = false;

          if (!response.isSuccess) {
            this._toastMessageService
              .add({
                severity: 'warn',
                summary: 'Error',
                detail: response.message
              });

            return;
          }

          this.message = '';
          this.getChatRoomMessages(this.appointmentId);
        },
        error: err => {
          this.isPostingMessages = false;
          this._errorHandlerService.handleError(err);
        }
      });
  }

  onClose() {
    this._dialogRef.close();
  }

  get isValidToPost() {
    return (this.message || '').trim().length > 0;
  }

  private getChatRoomMessages(appointmentId: number) {
    this.isLoadingMessages = true;
    this.subSink.sink = this._chatRoomMessageService.getChatRoomMessages<IAppResponseDataDto<IChatRoomMessageDto[]>>(appointmentId)
      .subscribe({
        next: response => {
          this.isLoadingMessages = false;

          if (!response.isSuccess) {
            this._toastMessageService
              .add({
                severity: 'warn',
                summary: 'Error',
                detail: response.message
              });

            return;
          }

          this.messages = response.data || [];
        },
        error: err => {
          this.isLoadingMessages = false;
          this._errorHandlerService.handleError(err);
        }
      });
  }
}
