import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { apiUrl } from './apiUrl';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  public readonly inventory_url: string;
  public readonly END_POINT: any;

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {
    this.inventory_url = environment.inventory_url;
    this.END_POINT = apiUrl;
  }

  getOrders(params?: any): Observable<any> {
    const headers = this.commonService.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getOrders}`, {
      headers,
      params: params ? params : {}
    })
  }

  getOrderDetails(id: string, params?: any): Observable<any> {
    const headers = this.commonService.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getOrderDetails}${id}`, {
      headers,
      params: params ? params : {}
    })
  }

  updateOrderStatus(payload: any): Observable<any> {
    const headers = this.commonService.getHeadersWithToken();
    return this.http.patch<any>(`${this.inventory_url}${this.END_POINT.orderStatusChange}`, payload, { headers })
  }
}
