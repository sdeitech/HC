import { InjectionToken } from '@angular/core';

export interface IConfigurationVM {
  readonly baseApiUrl: string;
  readonly secretKey: string;
  readonly initializationVector: string;
  readonly whiteListedSubdomains: string[];
  readonly defaultSubdomain: string;
}

export const CORE_CONFIGURATION = new InjectionToken<IConfigurationVM>(
  'core.config'
);
