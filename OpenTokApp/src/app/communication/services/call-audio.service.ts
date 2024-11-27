import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CallAudioService {
    private readonly _IncommingCallAudio = new Audio('audio/incomming_call.mp3');

    private readonly _IsPlayingIncomingCallAudioSubject = new Subject<boolean>();
    private readonly _IsPlayingIncomingCallAudioObs$ = this._IsPlayingIncomingCallAudioSubject.asObservable();

    playIncomingCallAudio() {
        this._IncommingCallAudio.muted = false;
        this._IncommingCallAudio.loop = true;
        this._IncommingCallAudio.play();
        this._IsPlayingIncomingCallAudioSubject.next(true);
    }

    stopIncomingCallAudio() {
        this._IncommingCallAudio.muted = true;
        this._IncommingCallAudio.loop = false;
        this._IncommingCallAudio.pause();
        this._IsPlayingIncomingCallAudioSubject.next(false);
    }

    getIncomingCallAudioListener() {
        return this._IsPlayingIncomingCallAudioObs$;
    }
}