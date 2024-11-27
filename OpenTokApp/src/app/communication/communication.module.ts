import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../modules';

import {
  ChatBoxComponent,
  InviteUsersComponent,
  ThankYouComponent,
  VideoCallRequestComponent,
  VideoConsultationComponent,
  VideoInvitationComponent,
  VideoLayoutComponent,
} from './components';

@NgModule({
  declarations: [
    ChatBoxComponent,
    InviteUsersComponent,
    ThankYouComponent,
    VideoCallRequestComponent,
    VideoConsultationComponent,
    VideoInvitationComponent,
    VideoLayoutComponent,
  ],
  exports: [
    ChatBoxComponent,
    InviteUsersComponent,
    ThankYouComponent,
    VideoCallRequestComponent,
    VideoConsultationComponent,
    VideoInvitationComponent,
    VideoLayoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
  ]
})
export class CommunicationModule { }
export * from './models';
export * from './services';
export * from './components';