import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";

import { Observable } from "rxjs";

import { PortalService, StorageService } from "../services";

@Injectable({
    providedIn: 'root',
})
export class LoginGuard implements CanActivate {
    constructor(
        private readonly _router: Router,
        private readonly _storageService: StorageService,
        private readonly _portalService: PortalService,
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

        if (isTokenExpired)
            return true;

        this._router.navigate([this._portalService.getPortalHome()]);
        return false;
    }
}