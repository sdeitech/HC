import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, catchError, finalize, throwError } from 'rxjs';

import { IApiCallRequestDto } from '../models';

import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
import { SubdomainService } from './subdomain.service';
import { DateHandlerService } from './date-handler.service';
import { LoadingService } from './loading.service';
import { ToastMessageService } from './toast-message.service';
import { ErrorMessageService } from './error-message.service';
import { SystemIpAddressService } from './system-ip-address.service';
import { GuidService } from './guid.service';
import { RequestMonitorService } from './request-monitor.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  private totalApiRequestCount = 0;
  private readonly _ApiRequests: IApiCallRequestDto[] = [];

  constructor(
    private readonly _storageService: StorageService,
    private readonly _deviceService: DeviceService,
    private readonly _systemIpAddressService: SystemIpAddressService,
    private readonly _subdomainService: SubdomainService,
    private readonly _dateHandlerService: DateHandlerService,
    private readonly _loadingService: LoadingService,
    private readonly _errorMessageService: ErrorMessageService,
    private readonly _toastMessageService: ToastMessageService,
    private readonly _guidService: GuidService,
    private readonly _requestMonitorService: RequestMonitorService,
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this._storageService.getAccessToken();
    const deviceId = this._deviceService.getDeviceId();
    const subdomain = this._subdomainService.getSubdomain();
    const ipAddress = this._systemIpAddressService.getIpAddress();
    const screenName = window.location.pathname;

    let headers = req.headers;

    headers = headers.set('timeout', '60000');
    headers = headers.set('X-Timezone-Offset', this.getTimezoneOffset());
    headers = headers.set('X-Origin-Url', window.location.href);
    headers = headers.set('X-Ip-Address', ipAddress);
    headers = headers.set('X-Screen-Name', screenName);

    if (token)
      headers = headers.set('Authorization', `Bearer ${token}`);

    if (deviceId)
      headers = headers.set('X-Device-Id', deviceId);

    if (subdomain)
      headers = headers.set('X-Sub-Domain', subdomain);

    const contentType = headers.get('Content-Type');

    if (!contentType) {
      headers = headers.set('Content-Type', 'application/json');
    } else if (
      (contentType || '').toLocaleLowerCase().trim() === 'multipart/form-data'
    ) {
      // Is file uplaod request
      // Content type will be automatically set. So, removing this content type to avoid failed request
      headers = headers.delete('Content-Type', contentType);
    }

    // While sending data in url the values could have undefined.
    // These values may cause issues in API calls.
    // So, sending blank values instead of undefined.
    if (req.method == "GET")
      req = req.clone({
        url: this.getCleanUrlForAPISubmission(req.url)
      });

    // While sending any data to API there are unwanted properties
    // which are having undefined values which is causing failure in API calls
    // So, removing those properties.
    if (req.method != "GET" && !!(req.body))
      req = req.clone({
        body: this.getCleanObjForAPISubmission(req.body)
      });

    const duplicate = req.clone({ headers: headers });

    if (duplicate.body) {
      const clone = duplicate.clone({
        body: this._dateHandlerService.handleDate(duplicate.body)
      });

      return this.handleRequest(next, clone);
    }

    return this.handleRequest(next, duplicate);
  }

  private getTimezoneOffset = (): string => {
    return (String(new Date().getTimezoneOffset()));
  }

  private getCleanUrlForAPISubmission(url: string) {
    if (url.indexOf('?') === -1 ||
      (url.split('?').length === 1 || (
        url.split('?').length > 1
        && !(url.split('?')[1].trim())
      )))
      return url;

    const parts = url.split('?');
    const tokens = parts[1].split('&');
    const parameters = tokens
      .filter(x => !(x.split('=')[1]?.trim() === 'null' || x.split('=')[1]?.trim() === 'undefined'))
      .join('&');

    const finalUrl = `${parts[0]}?${parameters}`;
    // console.log('request', { oroginal: url, clean: finalUrl });
    return finalUrl;
  }

  private getCleanObjForAPISubmission(obj: any) {
    const keys = Object.keys(obj);

    keys.forEach(key => {
      if (obj[key] === undefined)
        delete obj[key];
    });

    return obj;
  }

  private handleRequest(next: HttpHandler, request: HttpRequest<any>) {
    const obj = this.pushApiCallRequest(request.url);

    if (request.headers.has('X-No-Loader'))
      return next.handle(request)
        .pipe(finalize(() => this.popApiCallRequest(obj)));

    this.totalApiRequestCount++;
    this._loadingService.setLoadingStatus(true);

    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(() => new Error(errorMessage));
      }), finalize(() => {
        this.totalApiRequestCount--;
        if (this.totalApiRequestCount <= 0) {
          this.totalApiRequestCount = 0;
          this._loadingService.setLoadingStatus(false);
        }

        this.popApiCallRequest(obj);
      }));
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = this._errorMessageService.getMessage(error);

    this._toastMessageService
      .add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage
      });

    return errorMessage;
  }

  private pushApiCallRequest(url: string) {
    const obj: IApiCallRequestDto = {
      url: url,
      id: this._guidService.getGuId(),
      start: new Date(),
    };

    this._ApiRequests.push(obj);
    this._requestMonitorService.setApiCallRequest(this._ApiRequests);

    return obj;
  }

  private popApiCallRequest(obj: IApiCallRequestDto) {
    const idx = this._ApiRequests.findIndex(x => x.id === obj.id);

    if (idx === -1)
      return;

    this._ApiRequests.splice(idx, 1);
    this._requestMonitorService.setApiCallRequest(this._ApiRequests);
  }
}
