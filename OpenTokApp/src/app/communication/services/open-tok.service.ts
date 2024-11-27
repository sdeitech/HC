import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import * as openTok from '@opentok/client';

import {
    ErrorHandlerService,
    GenericApiService,
    IAppResponseDataDto,
    StorageService,
    ToastMessageService
} from "@core-services";

import {
    IInvitatedUserRequestDto,
    IOpenTokSessionDto
} from "../models";

@Injectable({
    providedIn: 'root'
})
export class OpenTokService {
    private readonly _OnOTSessionSavedSubject = new Subject<IOpenTokSessionDto & { isJoinCall: boolean }>();
    private readonly _OnOTSessionSavedObs$ = this._OnOTSessionSavedSubject.asObservable();

    private readonly _OnOTSessionSaveFailedSubject = new Subject<void>();
    private readonly _OnOTSessionSaveFailedObs$ = this._OnOTSessionSaveFailedSubject.asObservable();

    private readonly _OnStreamCreatedSubject = new Subject<openTok.Event<"streamCreated", openTok.Session>
        & { stream: openTok.Stream }>();
    private readonly _OnStreamCreatedObs$ = this._OnStreamCreatedSubject.asObservable();

    private readonly _OnStreamDestroyedSubject = new Subject<openTok.Event<"streamDestroyed", openTok.Session>
        & { stream: openTok.Stream, reason: string }>();
    private readonly _OnStreamDestroyedObs$ = this._OnStreamDestroyedSubject.asObservable();

    private readonly _OnSessionConnectedSubject = new Subject<openTok.Event<"sessionConnected", openTok.Session>>();
    private readonly _OnSessionConnectedObs$ = this._OnSessionConnectedSubject.asObservable();

    private readonly _OnSessionDisconnectedSubject = new Subject<openTok.Event<"sessionDisconnected", openTok.Session>>();
    private readonly _OnSessionDisconnectedObs$ = this._OnSessionDisconnectedSubject.asObservable();

    private readonly _OnArchiveStartedSubject = new Subject<openTok.Event<"archiveStarted", openTok.Session> & { id: string, name: string }>();
    private readonly _OnArchiveStartedObs$ = this._OnArchiveStartedSubject.asObservable();

    private readonly _OnArchiveStoppedSubject = new Subject<openTok.Event<"archiveStopped", openTok.Session>>();
    private readonly _OnArchiveStoppedObs$ = this._OnArchiveStoppedSubject.asObservable();

    private readonly _OnConnectionCreatedSubject = new Subject<openTok.Event<"connectionCreated", openTok.Session>>();
    private readonly _OnConnectionCreatedObs$ = this._OnConnectionCreatedSubject.asObservable();

    private readonly _OnConnectionDestroyedSubject = new Subject<openTok.Event<"connectionDestroyed", openTok.Session>>();
    private readonly _OnConnectionDestroyedObs$ = this._OnConnectionDestroyedSubject.asObservable();

    private readonly _OnStreamPropertyChangedSubject = new Subject<openTok.Event<"streamPropertyChanged", openTok.Session>>();
    private readonly _OnStreamPropertyChangedObs$ = this._OnStreamPropertyChangedSubject.asObservable();

    private readonly _OnMuteForcedSubject = new Subject<openTok.Event<"muteForced", openTok.Session>>();
    private readonly _OnMuteForcedObs$ = this._OnMuteForcedSubject.asObservable();

    constructor(
        private readonly _genericApiService: GenericApiService,
        private readonly _storageService: StorageService,
        private readonly _errorHandlerService: ErrorHandlerService,
        private readonly _toastMessageService: ToastMessageService,
    ) { }

    getOpenTokSessionByInvitationId<T>(invitationId: string): Observable<T> {
        const model = { invitationId: invitationId };
        return this._genericApiService.post<T>(`api/OpenTok/GetOpenTokSessionByInvitationId`, model);
    }

    getOpenTokSessionByAppointmentId<T>(appointmentId: number): Observable<T> {
        const model = { appointmentId: appointmentId };
        return this._genericApiService.post<T>(`api/OpenTok/GetOpenTokSessionByAppointmentId`, model);
    }

    startVideoRecording<T>(sessionId: string): Observable<T> {
        const model = { sessionId: sessionId };
        return this._genericApiService.post<T>(`api/OpenTok/StartVideoRecording`, model, false);
    }

    stopVideoRecording<T>(archiveId: string, appointmentId: number): Observable<T> {
        const model = { archiveId: archiveId, appointmentId: appointmentId };
        return this._genericApiService.post<T>(`api/OpenTok/StopVideoRecording`, model, false);
    }

    getVideoRecording<T>(archiveId: string): Observable<T> {
        const model = { archiveId: archiveId };
        return this._genericApiService.post<T>(`api/OpenTok/GetVideoRecording`, model, false);
    }

    callInitiate<T>(appointmentId: number, userId: number): Observable<T> {
        const model = { appointmentId: appointmentId, userId: userId };
        return this._genericApiService.post<T>(`api/OpenTok/CallInitiate`, model, false);
    }

    callEnd<T>(appointmentId: number, userId: number): Observable<T> {
        const model = { appointmentId: appointmentId, userId: userId };
        return this._genericApiService.post<T>(`api/OpenTok/CallEnd`, model, false);
    }

    handleIncomingCall<T>(userConnectionId: string): Observable<T> {
        const model = { userConnectionId: userConnectionId };
        return this._genericApiService.post<T>(`api/OpenTok/HandleIncomingCall`, model, false);
    }

    getUsersForInvitition<T>(appointmentId: number, searchTerm: string): Observable<T> {
        const model = { appointmentId: appointmentId, searchTerm: searchTerm };
        return this._genericApiService.post<T>(`api/OpenTok/GetUsersForInvitition`, model, false);
    }

    sendInvitation<T>(model: IInvitatedUserRequestDto): Observable<T> {
        return this._genericApiService.post<T>(`api/OpenTok/SendInvitation`, model);
    }

    /**
     * isJoinCall - this will be true if user joining via email link without
     * logging into portal so system generated token will be saved in localstorage.
     * Meaning making user as logged into the portal automatically.
     * This will help to chat with provider for chat implementation.
     * */
    initOpenTokSessionByInvitationId(invitationId: string, isJoinCall: boolean) {
        const openTokSession: IOpenTokSessionDto | null
            = this._storageService.getOTSession<IOpenTokSessionDto>();

        if (openTokSession) {
            const obj = Object.assign(openTokSession, { isJoinCall: isJoinCall });
            this._OnOTSessionSavedSubject.next(obj);
            return;
        }

        return this.getOpenTokSessionByInvitationId<IAppResponseDataDto<IOpenTokSessionDto>>(invitationId)
            .subscribe({
                next: result => {
                    if (!result.isSuccess) {
                        this._toastMessageService.add({
                            severity: 'warn',
                            summary: 'Warning',
                            detail: result.message || 'Something went wrong.'
                        });

                        this._OnOTSessionSaveFailedSubject.next();
                        return;
                    }

                    const otData = result.data;

                    if (isJoinCall && otData.accessToken) {
                        this._storageService.setAccessToken(otData.accessToken);
                        otData.accessToken = '';
                    }

                    this._storageService.setOTSession(otData);
                    const obj = Object.assign(otData, { isJoinCall: isJoinCall });
                    this._OnOTSessionSavedSubject.next(obj);
                },
                error: err => {
                    this._OnOTSessionSaveFailedSubject.next();
                    this.handleServerError(err);
                }
            });
    }

    initOpenTokSessionByAppointmentId(appointmentId: number, isJoinCall: boolean) {
        const openTokSession: IOpenTokSessionDto | null
            = this._storageService.getOTSession<IOpenTokSessionDto>();

        if (openTokSession
            && openTokSession.appointmentId == appointmentId) {
            const obj = Object.assign(openTokSession, { isJoinCall: isJoinCall });
            this._OnOTSessionSavedSubject.next(obj);
            return;
        }

        this._storageService.removeOTSession();

        return this.getOpenTokSessionByAppointmentId<IAppResponseDataDto<IOpenTokSessionDto>>(appointmentId)
            .subscribe(result => {
                if (!result.isSuccess) {
                    this._toastMessageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: result.message || 'Something went wrong.'
                    });
                    return;
                }

                this._storageService.setOTSession(result.data);
                const obj = Object.assign(result.data, { isJoinCall: isJoinCall });
                this._OnOTSessionSavedSubject.next(obj);
            });
    }

    getOTSessionSavedListener() {
        return this._OnOTSessionSavedObs$;
    }

    getOTSessionSaveFailedListener() {
        return this._OnOTSessionSaveFailedObs$;
    }

    // getInitSessionListener() {
    //     return this._OnInitSessionObs$;
    // }

    getStreamCreatedListener() {
        return this._OnStreamCreatedObs$;
    }

    // getStreamDestroyedListener() {
    //     return this._OnStreamDestroyedObs$;
    // }

    getSessionConnectedListener() {
        return this._OnSessionConnectedObs$;
    }

    // getSessionDisconnectedListener() {
    //     return this._OnSessionDisconnectedObs$;
    // }

    getArchiveStartedListener() {
        return this._OnArchiveStartedObs$;
    }

    getArchiveStoppedListener() {
        return this._OnArchiveStoppedObs$;
    }

    // getConnectionCreatedListener() {
    //     return this._OnConnectionCreatedObs$;
    // }

    // getConnectionDestroyedListener() {
    //     return this._OnConnectionDestroyedObs$;
    // }

    // getStreamPropertyChangedListener() {
    //     return this._OnStreamPropertyChangedObs$;
    // }

    // getMuteForcedListener() {
    //     return this._OnMuteForcedObs$;
    // }

    initSession(sessionDto: IOpenTokSessionDto) {
        const openTokSession = openTok.initSession(sessionDto.apiKey, sessionDto.sessionId);

        if (openTokSession.connection)
            openTokSession.disconnect();

        this.resetOpenTokEvents(openTokSession);
        this.configureOpenTokEvents(openTokSession);

        return openTokSession;
    }

    private resetOpenTokEvents(openTokSession: openTok.Session) {
        openTokSession.off("streamCreated");
        openTokSession.off("streamDestroyed");
        openTokSession.off("sessionDisconnected");
        openTokSession.off("archiveStarted");
        openTokSession.off("archiveStopped");
        openTokSession.off("connectionCreated");
        openTokSession.off("connectionDestroyed");
        openTokSession.off("streamPropertyChanged");
        openTokSession.off("muteForced");
    }

    private configureOpenTokEvents(openTokSession: openTok.Session) {
        openTokSession.on("streamCreated", event => {
            console.log("session - streamCreated", event);
            this._OnStreamCreatedSubject.next(event);
        });

        openTokSession.on("streamDestroyed", event => {
            console.log("session - streamDestroyed", event);
            this._OnStreamDestroyedSubject.next(event);
        });

        openTokSession.on("sessionDisconnected", event => {
            console.log("session - sessionDisconnected", event);
            this._storageService.removeOTSession();
            this._OnSessionDisconnectedSubject.next(event);
        });

        openTokSession.on("archiveStarted", event => {
            console.log("session - archiveStarted", event);
            this._OnArchiveStartedSubject.next(event);
        });

        openTokSession.on("archiveStopped", event => {
            console.log("session - archiveStopped", event);
            this._OnArchiveStoppedSubject.next(event);
        });

        openTokSession.on("connectionCreated", event => {
            console.log("session - connectionCreated", event);
            this._OnConnectionCreatedSubject.next(event);
        });

        openTokSession.on("connectionDestroyed", event => {
            console.log("session - connectionDestroyed", event);
            this._OnConnectionDestroyedSubject.next(event);
        });

        openTokSession.on("streamPropertyChanged", event => {
            console.log("session - streamPropertyChanged", event);
            this._OnStreamPropertyChangedSubject.next(event);
        });

        openTokSession.on("muteForced", event => {
            console.log("session - muteForced", event);
            this._OnMuteForcedSubject.next(event);
        });
    }

    private handleServerError(error: any) {
        this._errorHandlerService.handleError(error);
    }
}