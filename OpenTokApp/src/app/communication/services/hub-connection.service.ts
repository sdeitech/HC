import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import * as signalR from '@microsoft/signalr';

import { GenericApiService, StorageService } from "@core-services";
import { ICallEndResultDto, ICallInitiatedResultDto, ICallUrgentCareResultDto, IReceiveMessageResultDto } from "../models";

@Injectable({
    providedIn: 'root'
})
export class HubConnectionService {
    private readonly _BaseAPIUrl: string;
    private _chatHubConnection: signalR.HubConnection | null | undefined;

    private readonly _chatHubCallInitiatedSubject = new Subject<ICallInitiatedResultDto>();
    private readonly _chatHubCallInitiatedObs$ = this._chatHubCallInitiatedSubject.asObservable();

    private readonly _chatHubCallEndSubject = new Subject<ICallEndResultDto>();
    private readonly _chatHubCallEndObs$ = this._chatHubCallEndSubject.asObservable();

    private readonly _chatHubCallProviderUrgentCareSubject = new Subject<ICallUrgentCareResultDto>();
    private readonly _chatHubCallProviderUrgentCareObs$ = this._chatHubCallProviderUrgentCareSubject.asObservable();

    private readonly _chatHubCallPatientUrgentCareSubject = new Subject<ICallUrgentCareResultDto>();
    private readonly _chatHubCallPatientUrgentCareObs$ = this._chatHubCallPatientUrgentCareSubject.asObservable();

    private readonly _chatHubReceiveMessageSubject = new Subject<IReceiveMessageResultDto>();
    private readonly _chatHubReceiveMessageObs$ = this._chatHubReceiveMessageSubject.asObservable();

    private readonly _chatHubPerformLogoutSubject = new Subject<void>();
    private readonly _chatHubPerformLogoutObs$ = this._chatHubPerformLogoutSubject.asObservable();

    private readonly _chatHubIncomingCallHandledSubject = new Subject<void>();
    private readonly _chatHubIncomingCallHandledObs$ = this._chatHubIncomingCallHandledSubject.asObservable();

    private readonly _chatHubMessageSentSubject = new Subject<void>();
    private readonly _chatHubMessageSentObs$ = this._chatHubMessageSentSubject.asObservable();

    private readonly _notificationHubReceiveNotificationSubject = new Subject<any>();
    private readonly _notificationHubReceiveNotificationObs$ = this._notificationHubReceiveNotificationSubject.asObservable();

    constructor(
        private readonly _genericApiService: GenericApiService,
        private readonly _storageService: StorageService,
        private readonly _router: Router,
    ) {
        this._BaseAPIUrl = this._genericApiService.getBaseAPIUrl();
    }

    createChatHubConnection(): Promise<signalR.HubConnection> {
        this.resetChatHubConnectionEvents();

        const accessToken = this._storageService.getAccessToken() || '';
        this._chatHubConnection = this.getHubConnection(accessToken, 'chathub');

        this.configureChatHubConnectionEvents();

        return this.startHubConnection(this._chatHubConnection);
    }

    disposeChatHubConnection() {
        if (!this._chatHubConnection)
            return;

        this._chatHubConnection.stop();
        this._chatHubConnection = null;
    }

    getChatHubConnectionId() {
        return this._chatHubConnection?.connectionId;
    }

    getChatHubCallInitiatedListener(): Observable<ICallInitiatedResultDto> {
        return this._chatHubCallInitiatedObs$;
    }

    getChatHubCallEndListener(): Observable<ICallEndResultDto> {
        return this._chatHubCallEndObs$;
    }

    getChatHubCallProviderUrgentCareListener(): Observable<ICallUrgentCareResultDto> {
        return this._chatHubCallProviderUrgentCareObs$;
    }

    getChatHubCallPatientUrgentCareListener(): Observable<ICallUrgentCareResultDto> {
        return this._chatHubCallPatientUrgentCareObs$;
    }

    getChatHubReceiveMessageListener(): Observable<IReceiveMessageResultDto> {
        return this._chatHubReceiveMessageObs$;
    }

    getChatHubPerformLogoutListener(): Observable<void> {
        return this._chatHubPerformLogoutObs$;
    }

    getChatHubIncomingCallHandledListener(): Observable<void> {
        return this._chatHubIncomingCallHandledObs$;
    }

    getChatHubMessageSentListener(): Observable<void> {
        return this._chatHubMessageSentObs$;
    }

    getNotificationHubReceiveNotificationListener(): Observable<any> {
        return this._notificationHubReceiveNotificationObs$;
    }

    isChatHubConnected() {
        return this._chatHubConnection
            && (this._chatHubConnection.state === signalR.HubConnectionState.Connected);
    }

    isChatHubDisconnected() {
        return this._chatHubConnection
            && (this._chatHubConnection.state === signalR.HubConnectionState.Disconnected);
    }

    private startHubConnection(hubConnection: signalR.HubConnection): Promise<signalR.HubConnection> {
        return hubConnection
            .start()
            .then(() => {
                console.log('Connection started. Connection ID:', hubConnection.connectionId);
                return hubConnection;
            })
            .catch(err => {
                console.error('Error while starting connection: ', err);
                return hubConnection;
            });
    }

    private getHubConnection(accessToken: string, hubPath: string): signalR.HubConnection {
        if (accessToken)
            return new signalR.HubConnectionBuilder()
                .withUrl(`${this._BaseAPIUrl}/${hubPath}`, {
                    accessTokenFactory: () => accessToken,
                    timeout: 600000
                })
                .configureLogging(signalR.LogLevel.Error)
                .build();

        return new signalR.HubConnectionBuilder()
            .withUrl(`${this._BaseAPIUrl}/${hubPath}`, {
                timeout: 600000
            })
            .configureLogging(signalR.LogLevel.Error)
            .build();
    }

    private resetChatHubConnectionEvents() {
        if (!this._chatHubConnection)
            return;

        this._chatHubConnection.off("CallInitiated");
        this._chatHubConnection.off("CallEnd");
        this._chatHubConnection.off("CallProviderUrgentCare");
        this._chatHubConnection.off("CallPatientUrgentCare");
        this._chatHubConnection.off("ReceiveMessage");
        this._chatHubConnection.off("PerformLogout");
        this._chatHubConnection.off("IncomingCallHandled");
        this._chatHubConnection.off("MessageSent");
    }

    private configureChatHubConnectionEvents() {
        if (!this._chatHubConnection)
            return;

        this._chatHubConnection.on("CallInitiated",
            (
                appointmentId: number,
                fromUserId: number,
                toUserId: number,
                fullName: string,
                callerName: string,
                callerRoleName: string,
                invitaionId: string,
            ) => {
                this._chatHubCallInitiatedSubject.next({
                    appointmentId: appointmentId,
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                    fullName: fullName,
                    callerName: callerName,
                    callerRoleName: callerRoleName,
                    invitaionId: invitaionId,
                });
            });

        this._chatHubConnection.on("CallEnd",
            (
                appointmentId: number,
                fromUserId: number,
                toUserId: number,
                fullName: string,
                userType: string,
                callerName: string,
                callerRoleName: string,
            ) => {
                this._chatHubCallEndSubject.next({
                    appointmentId: appointmentId,
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                    fullName: fullName,
                    userType: userType,
                    callerName: callerName,
                    callerRoleName: callerRoleName,
                });
            });

        this._chatHubConnection.on("CallProviderUrgentCare",
            (
                appointmentId: number,
                fromUserId: number,
                toUserId: number
            ) => {
                this._chatHubCallProviderUrgentCareSubject.next({
                    appointmentId: appointmentId,
                    fromUserId: fromUserId,
                    toUserId: toUserId
                });
            });

        this._chatHubConnection.on("CallPatientUrgentCare",
            (
                appointmentId: number,
                fromUserId: number,
                toUserId: number,
            ) => {
                this._chatHubCallPatientUrgentCareSubject.next({
                    appointmentId: appointmentId,
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                });
            });

        this._chatHubConnection.on("ReceiveMessage",
            (
                result: string,
                userId: number,
                currentRoomId: number,
                appointmentId: number,
            ) => {
                this._chatHubReceiveMessageSubject.next({
                    result: result,
                    userId: userId,
                    currentRoomId: currentRoomId,
                    appointmentId: appointmentId,
                });
            });

        this._chatHubConnection.on("PerformLogout", () => {
            this._chatHubPerformLogoutSubject.next();
            window.setTimeout(() => {
                this._router.navigate(['/']);
            }, 1000);
        });

        this._chatHubConnection.on("IncomingCallHandled", () => {
            this._chatHubIncomingCallHandledSubject.next();
        });

        this._chatHubConnection.on("MessageSent", () => {
            this._chatHubMessageSentSubject.next();
        });
    }
}