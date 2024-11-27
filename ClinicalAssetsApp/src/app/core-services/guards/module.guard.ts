import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';

import { Observable } from 'rxjs';

import {
    LogoutService,
    PortalService,
    StorageService
} from '../services';

@Injectable({
    providedIn: 'root',
})
export class ModuleGuard implements CanActivate {
    constructor(
        private readonly _router: Router,
        private readonly _storageService: StorageService,
        private readonly _portalService: PortalService,
        private readonly _logoutService: LogoutService,
    ) { }

    canActivate(
        activatedRouteSnapshot: ActivatedRouteSnapshot,
        routerStateSnapshot: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {

        const isTokenExpired = this._storageService.isTokenExpired();

        if (isTokenExpired) {
            this._logoutService.performLogout();
            return false;
        }

        const portals = activatedRouteSnapshot.data["portals"] as Array<string>;

        if (!portals || portals.length == 0)
            return true;

        const portal_type = this._portalService.getPortalType();

        if (portals.some(x => x === portal_type))
            return true;

        const navigate = this._portalService.getPortalAuth();
        this._router.navigate([navigate]);
        return false;
    }
}