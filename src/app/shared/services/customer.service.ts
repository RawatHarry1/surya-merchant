import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { apiUrl } from './apiUrl';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  public readonly inventory_url: string;
  public readonly END_POINT: any;

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {
    this.inventory_url = environment.baseUrl_login;
    this.END_POINT = apiUrl;
  }

  getCustomers(params?: any): Observable<any> {
    const headers = this.commonService.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getCustomers}`, {
      headers,
      params: params ? params : {}
    })
  }
}