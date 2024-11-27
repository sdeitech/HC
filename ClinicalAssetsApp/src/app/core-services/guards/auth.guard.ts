import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';

import { Observable } from 'rxjs';

import { LogoutService, StorageService } from '../services';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private readonly _storageService: StorageService,
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

        if (!isTokenExpired)
            return true;

        this._logoutService.performLogout();
        return false;
    }
}