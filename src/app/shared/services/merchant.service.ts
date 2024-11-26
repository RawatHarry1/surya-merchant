import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  // static readonly apiUrl = 'http://localhost:8000/merchants';
  static readonly apiUrl = 'https://db-json-25aj.onrender.com/merchants';

  constructor(private http: HttpClient) { }

  // Function to add merchant data to JSON server
  addMerchant(merchant: any, type: any, id: any): Observable<any> {
    if (type === 'add') {
      return this.http.post<any>(MerchantService.apiUrl, merchant);
    } else {
      return this.http.put<any>(`${MerchantService.apiUrl}/${id}`, merchant);
    }
  }


  // Function to get merchant data
  getMerchants(): Observable<any[]> {
    return this.http.get<any[]>(MerchantService.apiUrl);
  }
  getMerchantById(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${MerchantService.apiUrl}/${id}`);
  }

  updateMerchant(id: string, status: any): Observable<any> {
    return this.http.patch(`${MerchantService.apiUrl}/${id}`, { status })
  }
  // Function to delete merchant data
  deleteMerchant(id: string): Observable<void> {
    return this.http.delete<void>(`${MerchantService.apiUrl}/${id}`);
  }

}
