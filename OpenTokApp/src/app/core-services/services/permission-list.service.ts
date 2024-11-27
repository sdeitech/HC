import { Injectable } from '@angular/core';
import { StorageService } from '@core-services';

@Injectable({
    providedIn: 'root',
})
export class PermissionListService {
    permissionList: any[] = [];
    history: string[] = [];

    constructor(private _storageService: StorageService) { }

    public getPermissionListdata(url: string) {
        let list = this.permissionList.filter(x => (x.moduleNavigationLink.toLowerCase() == url && x.isModuleAccess));
        let actionlist: string[] = ["add", "update", "delete", "search", "preview", "view", "upload", "download"];

        if (list.length > 0) {
            return actionlist;
        }
        else {
            if (this.permissionList.length > 0) {
                list = this.permissionList.filter(x => (x.screenNavigationLink.toLowerCase() == url && x.isScreenAccess && x.isActionAccess));
                actionlist = [...new Set(list.map(item => item.actionName.toLowerCase()))];
            }

            return actionlist;
        }
    }

    public checkActionPermission(url: string, action: string) {
        if (this.permissionList.length == 0) {
            const templist = this._storageService.getItemWithDecryption('perlist');

            if (templist) {
                this.permissionList = JSON.parse(templist);
                this._storageService.removeItem('perlist');
            }
        }

        let list = this.permissionList.filter(x => (x.moduleNavigationLink.toLowerCase() == url && x.isModuleAccess));

        if (list.length > 0) {
            return true;
        }
        else {
            if (this.permissionList.length > 0) {
                list = this.permissionList.filter(x => (x.screenNavigationLink.toLowerCase() == url && x.isScreenAccess && x.isActionAccess && x.actionName.toLowerCase() == action));

                if (list.length > 0) {
                    return true;
                }

                return false;
            }

            return true;
        }
    }

    public setPermissionListdata(list: any) {
        this.permissionList = list;
        this._storageService.removeItem('perlist');
        this._storageService.setItemWithEncryption('perlist', JSON.stringify(this.permissionList))
    }

    public setHistoryListdata(url: string) {
        if (url.split("/").length > 2) {
            if (this.history[this.history.length - 1] != url) {
                this.history.push(url);
            }
        }

        if (this.history.length >= 50) {
            this.history = this.history.slice(this.history.length - 49, this.history.length);
        }
    }

    public getHistoryListdata() {
        return this.history;
    }

    public reSet() {
        this.history = [];
        this.permissionList = [];
        this._storageService.removeItem('perlist');
    }
}