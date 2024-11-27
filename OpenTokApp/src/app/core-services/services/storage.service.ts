import { Injectable } from "@angular/core";
import { CryptoService } from "./crypto.service";

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private readonly _ACCESS_TOKEN_KEY = 'access_token';
    private readonly _OT_SESSION_KEY = 'ot_session';

    constructor(
        private readonly _cryptoService: CryptoService
    ) {
    }

    getAccessToken = (): string | null => {
        return localStorage.getItem(this._ACCESS_TOKEN_KEY);
    }

    setAccessToken = (accessToken: string): void => {
        localStorage.setItem(this._ACCESS_TOKEN_KEY, accessToken);
    }

    removeAccessToken = (): void => {
        localStorage.removeItem(this._ACCESS_TOKEN_KEY);
    }

    getOTSession<T>(): T | null {
        const otSession = this.getItemWithDecryption(this._OT_SESSION_KEY);

        if (!otSession)
            return null;

        return JSON.parse(otSession) as T;
    }

    setOTSession<T>(model: T): void {
        const otSession = JSON.stringify(model);
        this.setItemWithEncryption(this._OT_SESSION_KEY, otSession);
    }

    removeOTSession() {
        this.removeItem(this._OT_SESSION_KEY);
    }

    setItem = (key: string, value: string): void => {
        localStorage.setItem(key, value);
    }

    getItem = (key: string): string | null => {
        return localStorage.getItem(key);
    }

    removeItem = (key: string) => {
        return localStorage.removeItem(key);
    }

    setItemWithEncryption = (key: string, value: string): void => {
        localStorage.setItem(key, this._cryptoService.encrypt(value));
    }

    getItemWithDecryption = (key: string): string | null => {
        const encryptedValue = localStorage.getItem(key);

        if (!encryptedValue || encryptedValue == '')
            return '';

        return this._cryptoService.decrypt(encryptedValue);
    }

    clearAll = (): void => {
        localStorage.clear();
    }

    isTokenExpired = (): boolean => {
        const user = this.getLoggedInUser<{ exp: number }>();

        if (!user)
            return true;

        const expiry = user.exp || 0;
        const currentTime = (Math.floor((new Date).getTime() / 1000));

        return currentTime >= expiry;
    }

    getLoggedInUser<T>(): T | null {
        const token = this.getToken();

        if (!token)
            return null;

        const user = JSON.parse(atob(token)) || null;

        return user as T;
    }

    private getToken = (): string | null => {
        const accessToken = this.getAccessToken();

        if (!accessToken)
            return null;

        const token = accessToken.split('.')[1] || null;

        return token || null;
    }
}