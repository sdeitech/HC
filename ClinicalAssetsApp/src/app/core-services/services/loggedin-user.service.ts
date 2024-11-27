import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { IUserDto } from "../models";
import { PortalService } from "./portal-service";

@Injectable({
    providedIn: 'root'
})
export class LoggedinUserService {
    private readonly _Roles = [
        { roleName: 'Agency', roleId: 1 },
        { roleName: 'ClinicalStaff', roleId: 2 },
        { roleName: 'NonClinicalStaff', roleId: 3 },
        { roleName: 'Patient', roleId: 4 },
    ];

    constructor(
        private readonly _storageService: StorageService,
        private readonly _portalService: PortalService,
    ) { }

    isAgencyAdmin() {
        return this.isRole('Agency');
    }

    isProvider() {
        return this.isRole('ClinicalStaff');
    }

    isNonProvider() {
        return this.isRole('NonClinicalStaff');
    }

    isPatient() {
        return this.isRole('Patient');
    }

    isSuperAdmin() {
        return (this._portalService.getPortalType()?.toLocaleLowerCase() === "superadmin");
    }

    private isRole(roleName: string) {
        const currentUser = this._storageService.getLoggedInUser<IUserDto>();
        const roleId = currentUser?.role_id;
        const obj = this._Roles.find(x => x.roleId.toString() === roleId);
        return (obj?.roleName === roleName);
    }
}