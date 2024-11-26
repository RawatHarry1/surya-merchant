import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Discount } from 'app/routes/marketing/discounts/discounts-dialog/discounts-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  // static readonly apiUrl = 'http://localhost:8000/discounts'; // URL for JSON server
  static readonly apiUrl = 'https://db-json-25aj.onrender.com/discountsAppliances';
  static readonly apiUrl2 = 'https://db-json-25aj.onrender.com/discounts';  
  constructor(private http: HttpClient) { }


  addDiscountAppliances(payload: any): Observable<any> {
    return this.http.post(DiscountsService.apiUrl, payload);

  }
  addDiscount(payload: any): Observable<any> {
    return this.http.post(DiscountsService.apiUrl2, payload);

  }

  getDiscountAppliances(): Observable<Discount> {
    return this.http.get<Discount>(DiscountsService.apiUrl)
  }
  getDiscount(): Observable<Discount> {
    return this.http.get<Discount>(DiscountsService.apiUrl2)
  }

  updateDiscountAppliances(payload: any, id: string): Observable<Discount> {
    return this.http.put<Discount>(`${DiscountsService.apiUrl}/${id}`, payload)
  }
  updateDiscount(payload: any, id: string): Observable<Discount> {
    return this.http.put<Discount>(`${DiscountsService.apiUrl2}/${id}`, payload)
  }


  deleteDiscountAppliances(id: string): Observable<Discount> {
    return this.http.delete<Discount>(`${DiscountsService.apiUrl}/${id}`)
  }
  deleteDiscount(id: string): Observable<Discount> {
    return this.http.delete<Discount>(`${DiscountsService.apiUrl2}/${id}`)
  }
}
