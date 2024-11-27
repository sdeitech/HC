import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import * as RecordRTC from 'recordrtc';


import { IRecordedAudioOutputDto } from "../models";

@Injectable({
    providedIn: 'root',
})
export class AudioRecordingService {
    private stream!: MediaStream | null | undefined;
    private recorder: any;
    private interval: any;
    private startTime: Date | null | undefined;

    private _recorded = new Subject<IRecordedAudioOutputDto>();
    private _recordingTime = new Subject<string>();
    private _recordingFailed = new Subject<void>();
    constructor() { }


    getRecordedBlob(): Observable<IRecordedAudioOutputDto> {
        return this._recorded.asObservable();
    }

    getRecordedTime(): Observable<string> {
        return this._recordingTime.asObservable();
    }

    recordingFailed(): Observable<void> {
        return this._recordingFailed.asObservable();
    }


    startRecording() {
        if (this.recorder) {
            return;
        }

        this._recordingTime.next('00:00');
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(s => {
                this.stream = s;
                this.record();
            }).catch(error => {
                this._recordingFailed.next();
            });

    }

    abortRecording() {
        this.stopMedia();
    }

    private record() {
        if (!this.stream)
            return;

        this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
            type: 'audio',
            mimeType: 'audio/ogg'
        });

        this.recorder.record();
        this.startTime = new Date();
        this.interval = setInterval(
            () => {
                const startDateTime = this.startTime || new Date();
                const currentDateTime = new Date();
                const totalSeconds = Math.round((currentDateTime.getTime() - startDateTime.getTime()) / 1000);
                const seconds = totalSeconds % 60.00;
                const minutes = ((totalSeconds - seconds) / 60.00);
                const time = this.toString(minutes) + ":" + this.toString(seconds);
                this._recordingTime.next(time);
            },
            5000
        );
    }

    private toString(value: number) {
        return value.toString().padStart(2, '0');
    }

    stopRecording() {
        if (this.recorder) {
            this.recorder.stop((blob: Blob) => {
                if (this.startTime) {
                    const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
                    this.stopMedia();
                    this._recorded.next({ blob: blob, title: mp3Name });
                }
            }, () => {
                this.stopMedia();
                this._recordingFailed.next();
            });
        }
    }

    private stopMedia() {
        if (this.recorder) {
            this.recorder = null;
            clearInterval(this.interval);
            this.startTime = null;
            if (this.stream) {
                this.stream.getAudioTracks().forEach(track => track.stop());
                this.stream = null;
            }
        }
    }
}