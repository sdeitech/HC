import { Inject, Injectable } from "@angular/core";
import { CORE_CONFIGURATION, IConfigurationVM } from "../models";

@Injectable({
    providedIn: 'root',
})
export class SubdomainService {
    constructor(
        @Inject(CORE_CONFIGURATION) private readonly _configurationVM: IConfigurationVM
    ) { }

    getSubdomain() {
        if (this.isIpAddress())
            return '';

        const domain = window.location.hostname;
        let subdomain = domain.split('.')[0];

        const tokens = this._configurationVM.whiteListedSubdomains
            || [];

        if (tokens.indexOf(subdomain) !== -1)
            subdomain = this._configurationVM.defaultSubdomain || '';

        return subdomain;
    }

    private isIpAddress = (): boolean => {
        const tokens = window.location.hostname.split('.');

        for (let x = 0; x < tokens.length; x++)
            if (isNaN(Number(tokens[x])))
                return false;

        return true;
    }
}