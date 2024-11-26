import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class NotificatonService {

  public readonly inventory_url: string;
  public readonly END_POINT: any;

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {
    this.inventory_url = environment.baseUrl_login;
    this.END_POINT = apiUrl;
  }

  sendNotificationCustomers(payload: any, params?: any): Observable<any> {
    const headers = this.commonService.getHeadersWithToken();
    return this.http.post<any>(
      `${this.inventory_url}${this.END_POINT.customerSendNotification}`,
      payload,  // Send the payload directly as the request body
      {
        headers,
        params: params ? params : {}
      }
    );
  }

}
