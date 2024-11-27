import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class DataSharingService {
    public isUnsaved: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}