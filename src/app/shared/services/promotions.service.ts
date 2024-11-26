import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, Observable } from 'rxjs';
import { apiUrl } from './apiUrl';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  public readonly inventory_url: string;
  public readonly END_POINT: any;

  constructor(
    private http: HttpClient,
    private commonServices: CommonService
  ) {
    this.inventory_url = environment.inventory_url;
    this.END_POINT = apiUrl;
  }

  addPromotion(payload: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.post<any>(`${this.inventory_url}${this.END_POINT.addCoupon}`, payload, {
      headers
    })
  }

  getPromotion(params?: any): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.get<any>(`${this.inventory_url}${this.END_POINT.getCoupon}`, {
      headers,
      params: params ? params : {}
    })
  }

  // getPromotionById(id: any) {
  //   // return this.http.get<Promotion>(`${PromotionsService.apiUrl}/${id}`)
  // }

  updatePromotion(id: string): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.patch<any>(`${this.inventory_url}${this.END_POINT.isActive}${id}`, {}, {
      headers
    })

  }

  editPromotion(payload: any, id: string): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.put<any>(`${this.inventory_url}${this.END_POINT.editCoupon}${id}`, payload, {
      headers
    })
  }

  deletePromotion(id: string): Observable<any> {
    const headers = this.commonServices.getHeadersWithToken();
    return this.http.delete<any>(`${this.inventory_url}${this.END_POINT.deleteCoupon}${id}`, {
      headers
    });
  }
}
