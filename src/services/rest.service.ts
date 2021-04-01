import { HttpService, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class RestService {
  constructor(private http: HttpService) { }

  httpGet<T>(url: string, queryParam?: any): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.getRequestHeaders(),
      params: this.getRequestParams(queryParam)
    }).pipe(map(response => response.data));
  }

  httpPut<T>(url: string, payload?: any, contentType?: any): Observable<any> {
    if (!contentType) {
      contentType = 'application/json';
    }
    return this.http.put(url,
      this.getRequestPayload(payload, contentType), {
      headers: this.getRequestHeaders(contentType)
    }).pipe(map(response => response.data));
  }

  httpPost<T>(url: string, payload: any, contentType?: any): Observable<T> {
    if (!contentType) {
      contentType = 'application/json';
    }

    return this.http.post<T>(url,
      this.getRequestPayload(payload, contentType), {
      headers: this.getRequestHeaders(contentType)
    }
    ).pipe(map(response => response.data));
  }

  httpDelete<T>(url: string): Observable<any> {
    return this.http.delete<T>(url, {
      headers: { ...this.getRequestHeaders() },
    }).pipe(map(response => response.data));
  }

  httpPostFile<T>(url: string, fd: FormData): Observable<any> {
    return this.http.post(url, fd);
  }

  /**
    * 預設Content-Type為application/json
    * @param contentType 資料格式
    */
  private getRequestHeaders(contentType?: string): any {
    return {
      'Content-Type': contentType || 'application/json'
    };
  }

  private getRequestPayload(payload: any, contentType = 'application/json'): any {
    switch (contentType) {
      case 'application/json':
        return payload;
      case 'application/x-www-form-urlencoded':
        return this.getRequestParams(payload);
    }
    return payload;
  }

  private getRequestParams(payload: any): any {
    return payload;
  }
}