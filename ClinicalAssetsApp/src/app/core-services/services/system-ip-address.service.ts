import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SystemIpAddressService {
    private ipAddress: string = 'localhost';
    private readonly _httpClient: HttpClient;

    constructor(
        private readonly _httpBackend: HttpBackend
    ) {
        this._httpClient = new HttpClient(this._httpBackend);
    }

    getIpAddress() {
        return this.ipAddress;
    }

    requestIpAddress() {
        return this._httpClient.get<{ ip: string }>('https://api.ipify.org/?format=json')
            .pipe(tap(resp => this.ipAddress = resp.ip));
    }
}