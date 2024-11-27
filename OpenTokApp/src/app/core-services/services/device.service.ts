import { Injectable } from "@angular/core";
import { GuidService } from "./guid.service";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    readonly deviceIdKey = 'deviceId';

    constructor(
        private readonly _guidService: GuidService,
        private readonly _storageService: StorageService
    ) { }

    getDeviceId = (): string => {
        const oldDeviceId = this._storageService.getItem(this.deviceIdKey) || '';
        const deviceId = oldDeviceId || this._guidService.getGuId();

        if (deviceId !== oldDeviceId)
            this._storageService.setItem(this.deviceIdKey, deviceId);

        return deviceId;
    }
}