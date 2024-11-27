import { IConfigurationVM } from "@core-services";
import { environment } from '../../environments/environment';

export const ConfigurationFactory = (): IConfigurationVM => {
    return Object.freeze({
        baseApiUrl: environment.baseApiUrl,
        secretKey: environment.secretKey,
        initializationVector: environment.initializationVector,
        whiteListedSubdomains: environment.whiteListedSubdomains,
        defaultSubdomain: environment.defaultSubdomain,
    });
};
