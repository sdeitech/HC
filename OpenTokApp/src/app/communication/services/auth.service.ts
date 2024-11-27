import { Injectable } from "@angular/core";
import { GenericApiService } from "@core-services";
import { Observable } from "rxjs";
import { ILoginDto } from "../models";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private readonly _genericApiService: GenericApiService) { }

    authenticateUser<T>(model: ILoginDto): Observable<T> {
        return this._genericApiService.post<T>('api/Users/AuthenticateUser', model);
    }
}