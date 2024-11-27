import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CommunicationModule,
  OpenTokService,
  AuthService,
  ILoginDto,
  IAuthResultDto
} from './communication/communication.module';

import { AppMaterialModule } from './modules';

import {
  CryptoService,
  StorageService,
  SubSinkService,
  ToastMessageService
} from '@core-services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    AppMaterialModule,
    CommunicationModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly subSink = new SubSinkService();
  title = 'Open Tok App';
  appointmentId: number = 1722;
  invitationId: string = '9517E68E-0546-48C8-9ED6-76D0F8260F08|1';
  user: ILoginDto = {
    "portalType": "Agency",
    "orgnizationKey": "smartData",
    "email": "agency.user@example.com",
    "password": "Test@123",
    "remember_me": false
  };

  constructor(
    private readonly _cryptoService: CryptoService,
    private readonly _authService: AuthService,
    private readonly _toastMessageService: ToastMessageService,
    private readonly _storageService: StorageService,
    private readonly _openTokService: OpenTokService,
  ) { }

  ngOnInit(): void {
    this.subSink.sink = this._toastMessageService.getMessageSentListener()
      .subscribe(data => {
        alert(`${data.message.summary} - ${data.message.detail}`);
      });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  get isLoggedIn() {
    return !this._storageService.isTokenExpired();
  }

  onLogin() {
    const userObj = Object.assign({}, this.user);
    userObj.password = this._cryptoService.encrypt(this.user.password);

    this.subSink.sink = this._authService
      .authenticateUser<IAuthResultDto>(userObj)
      .subscribe(data => {
        this._storageService.setAccessToken(data.auth_token);
      });
  }

  onStartCall() {
    const sub = this._openTokService.initOpenTokSessionByAppointmentId(this.appointmentId, false);

    if (sub)
      this.subSink.sink = sub;
  }

  onStartCallByInvitation() {
    const invitationId = this._cryptoService.encrypt(this.invitationId);
    const sub = this._openTokService.initOpenTokSessionByInvitationId(invitationId, false);

    if (sub)
      this.subSink.sink = sub;
  }

  onLogout() {
    this._storageService.clearAll();
  }
}