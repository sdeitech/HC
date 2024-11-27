import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class GuidService {
    getGuId() {
        return this._p8(false) + this._p8(true) + this._p8(true) + this._p8(false);
    }

    private _p8(s: boolean) {
        const p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
}