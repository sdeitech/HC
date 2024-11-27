import { Inject, Injectable } from "@angular/core";
import { CORE_CONFIGURATION, IConfigurationVM } from "../models";

import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class CryptoService {
    private readonly _key: CryptoJS.lib.WordArray;
    private readonly _iv: CryptoJS.lib.WordArray;

    constructor(
        @Inject(CORE_CONFIGURATION) private readonly _configurationVM: IConfigurationVM
    ) {
        this._key = CryptoJS.enc.Utf8.parse(this._configurationVM.secretKey);
        this._iv = CryptoJS.enc.Utf8.parse(this._configurationVM.initializationVector);
    }

    encrypt(message: string | null | undefined) {
        const options = this.getCipherOptions();
        return CryptoJS.AES.encrypt((message || ''), this._key, options)
            .toString();
    }

    decrypt(message: string | null | undefined) {
        const options = this.getCipherOptions();
        return CryptoJS.AES.decrypt((message || ''), this._key, options)
            .toString(CryptoJS.enc.Utf8);
    }

    private getCipherOptions() {
        return {
            keySize: 128 / 8,
            iv: this._iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        };
    }
}