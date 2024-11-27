import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { DeviceService } from "./device.service";
import { StorageService } from "./storage.service";
import { GenericApiService } from "./generic-api.service";
import { PortalService } from "./portal-service";
import { PermissionListService } from "@core-services";

@Injectable({
    providedIn: 'root',
})
export class LogoutService {
    private readonly _BeforeLogoutSubject = new Subject<void>();
    private readonly _BeforeLogoutObs$ = this._BeforeLogoutSubject.asObservable();

    constructor(
        private readonly _router: Router,
        private readonly _storageService: StorageService,
        private readonly _portalService: PortalService,
        private readonly _deviceService: DeviceService,
        private readonly _genericApiService: GenericApiService,
        private readonly _permissionListService: PermissionListService
    ) { }

    getBeforLogoutListener() {
        return this._BeforeLogoutObs$;
    }

    performLogout = (navigateUrl: string | null | undefined = null): void => {
        const portal_type = this._portalService.getPortalType();
        const isSuperAdmin = (portal_type === "SuperAdmin");
        let navigate = navigateUrl || this._portalService.getPortalAuth();

        if (this._storageService.isTokenExpired()) {
            this.doLogoutAction(navigate);
            return;
        }

        if (isSuperAdmin) {
            this.performSuperUserLogout()
                .subscribe({
                    next: () => this.doLogoutAction(navigate),
                    error: () => this.doLogoutAction(navigate)
                });

            return;
        }

        this.performUserLogout()
            .subscribe({
                next: () => this.doLogoutAction(navigate),
                error: () => this.doLogoutAction(navigate)
            });
    }

    private doLogoutAction = (navigate: string) => {
        this._BeforeLogoutSubject.next();
        const deviceId = this._deviceService.getDeviceId();
        this._permissionListService.reSet();
        this._storageService.clearAll();
        this._storageService.setItem(this._deviceService.deviceIdKey, deviceId);
        this._router.navigate([navigate]);
    }

    private performSuperUserLogout<T>(): Observable<T> {
        return this._genericApiService.post<T>('api/SuperUsers/PerformSuperUserLogout', null);
    }

    private performUserLogout<T>(): Observable<T> {
        return this._genericApiService.post<T>('api/Users/PerformUserLogout', null);
    }
}