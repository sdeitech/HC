import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root',
})
export class PortalService {
    constructor(
        private readonly _storageService: StorageService
    ) { }

    getPortalType(): string {
        let user = this._storageService
            .getLoggedInUser<{ portal_type?: string }>();

        user = user || { portal_type: "Agency" };

        return user.portal_type || "Agency";
    }

    getPortalHome() {
        const portal_type = this.getPortalType();

        if (portal_type === 'SuperAdmin')
            return '/super-admin';

        if (portal_type === 'Agency' || portal_type === 'Provider')
            return '/organization';

        if (portal_type === 'Client')
            return '/patient';

        if (portal_type === 'WaitingRoom')
            return '/waiting-room';

        return '/organization';
    }

    getPortalAuth() {
        const portal_type = this.getPortalType();

        if (portal_type === 'SuperAdmin')
            return '/super-auth';

        return '/auth';
    }

    getPortals() {
        return ["Agency", "Provider", "Client", "WaitingRoom"];
    }
}