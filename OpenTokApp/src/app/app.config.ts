import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

import { CORE_CONFIGURATION, InterceptorService } from '@core-services';
import { ConfigurationFactory } from './factories';


export const appConfig: ApplicationConfig = {
  providers: [
    DatePipe,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    {
      provide: CORE_CONFIGURATION,
      useFactory: ConfigurationFactory
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
