import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { CORE_CONFIGURATION, IConfigurationVM } from '../models';

@Injectable({
  providedIn: 'root',
})
export class GenericApiService {
  constructor(
    private readonly _http: HttpClient,
    @Inject(CORE_CONFIGURATION) private readonly _configurationVM: IConfigurationVM
  ) { }

  getBaseAPIUrl = (): string => {
    return this._configurationVM.baseApiUrl;
  };

  /** Generic Http get request */
  get<T>(url: string, data: any | null | undefined = null, isShowLoader: boolean = true): Observable<T> {
    let httpParams: HttpParams = new HttpParams();

    if (data) {
      Object.keys(data)
        .forEach(x => {
          httpParams = httpParams.append(x, data[x]);
        });
    }

    const options: { params: HttpParams, headers?: HttpHeaders } = { params: httpParams };

    if (!isShowLoader)
      options.headers = this.getNoShowHeaders();

    const fullUrl = `${this._configurationVM.baseApiUrl}/${url}`;
    return this._http.get<T>(fullUrl, options);
  }

  /** Generic Http delete request */
  delete<T>(url: string, isShowLoader: boolean = true): Observable<T> {
    const fullUrl = `${this._configurationVM.baseApiUrl}/${url}`;

    const options: { headers?: HttpHeaders } = {};

    if (!isShowLoader)
      options.headers = this.getNoShowHeaders();

    return this._http.delete<T>(fullUrl, options);
  }

  /** Generic Http post request */
  post<T>(url: string, body: any, isShowLoader: boolean = true): Observable<T> {
    const fullUrl = `${this._configurationVM.baseApiUrl}/${url}`;

    const options: { headers?: HttpHeaders } = {};

    if (!isShowLoader)
      options.headers = this.getNoShowHeaders();

    return this._http.post<T>(fullUrl, body, options);
  }

  getBlobByUsingPost(url: string, body: any, isShowLoader: boolean = true): Observable<HttpResponse<Blob>> {
    const fullUrl = `${this._configurationVM.baseApiUrl}/${url}`;

    const options: { observe: 'response', responseType: 'blob', headers?: HttpHeaders }
      = { observe: 'response', responseType: 'blob' };

    if (!isShowLoader)
      options.headers = this.getNoShowHeaders();

    return this._http.post(fullUrl, body, options);
  }

  /** Generic Http put request */
  put<T>(url: string, body: any, isShowLoader: boolean = true): Observable<T> {
    const fullUrl = `${this._configurationVM.baseApiUrl}/${url}`;

    if (!isShowLoader)
      return this._http.put<T>(fullUrl, body, { headers: this.getNoShowHeaders() });

    return this._http.put<T>(fullUrl, body);
  }

  uploadFile<T>(url: string, formData: FormData, isShowLoader: boolean = true): Observable<HttpEvent<T>> {
    const fullUrl = `${this._configurationVM.baseApiUrl}/${url}`;

    if (!isShowLoader) {
      let headers = this.getNoShowHeaders();
      headers = headers.set('Content-Type', 'multipart/form-data');

      return this._http.post<T>(fullUrl, formData, {
        reportProgress: true,
        observe: 'events',
        responseType: 'json',
        headers: headers,
      });
    }

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data');

    return this._http.post<T>(fullUrl, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json',
      headers: headers,
    });
  }

  private getNoShowHeaders() {
    return (new HttpHeaders()).set('X-No-Loader', 'true');
  }
}
