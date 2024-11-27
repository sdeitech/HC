import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private readonly _isLoadingSubject = new Subject<boolean>();
    private readonly _isLoadingObs$ = this._isLoadingSubject.asObservable();

    getIsLoadingListener() {
        return this._isLoadingObs$;
    }

    setLoadingStatus(isLoading: boolean) {
        this._isLoadingSubject.next(isLoading);
    }
}