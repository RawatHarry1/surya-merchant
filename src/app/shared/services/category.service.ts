import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { apiUrl } from './apiUrl';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  protected readonly http = inject(HttpClient);
  protected readonly commonServices = inject(CommonService);
  public readonly inventory_url: string;
  public readonly END_POINT: any;

  constructor() {
    this.inventory_url = environment.inventory_url;
    this.END_POINT = apiUrl;
  }

  addCategory(payload: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.post(`${this.inventory_url}${this.END_POINT.addCategory}`, payload, {
      headers,
    });
  }

  getCategory(params?: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getCategory}`, {
      headers,
      params: params ? params : {}
    });
  }

  addSubCategory(payload: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.post(`${this.inventory_url}${this.END_POINT.addSubCategory}`, payload, {
      headers,
    });
  }

  getSubCategory(params?: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getSubCategory}`, {
      headers,
      params: params ? params : {}
    });
  }

  addSubSubCategory(payload: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.post(`${this.inventory_url}${this.END_POINT.addSubSubCategory}`, payload, {
      headers,
    });
  }

  getSubSubCategory(params?: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getSubSubCategory}`, {
      headers,
      params: params ? params : {}
    });
  }

  getCategoryById(categoryId: any) {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getCategory}/${categoryId.categoryId}`, { headers });
  }
}
