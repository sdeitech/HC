import { Inject, Injectable } from "@angular/core";
import { CORE_CONFIGURATION, IConfigurationVM } from "../models";

import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class DataSecurityService {
    private readonly _key: CryptoJS.lib.WordArray;

    constructor(
        @Inject(CORE_CONFIGURATION) private readonly _configurationVM: IConfigurationVM
    ) {
        this._key = CryptoJS.enc.Utf8.parse(this._configurationVM.secretKey);
    }

    getEncrypted(textToEncrypt: string) {
        if (!textToEncrypt)
            return '';

        return encodeURIComponent(CryptoJS.TripleDES.encrypt(textToEncrypt, this.getKey())
            .toString());
    }

    getDecrypted(textToDecrypt: string) {
        if (!textToDecrypt)
            return '';

        return CryptoJS.TripleDES.decrypt(decodeURIComponent(textToDecrypt), this.getKey())
            .toString(CryptoJS.enc.Utf8);
    }

    private getKey() {
        return CryptoJS.MD5(this._key).toString();
    }
}