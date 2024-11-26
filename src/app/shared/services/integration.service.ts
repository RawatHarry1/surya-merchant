import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { apiUrl } from './apiUrl';
import { Observable } from 'rxjs';
import { Integration } from 'app/routes/integration/intigration-dialog/intigration-dialog.component';
import { relativeTimeRounding } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  public readonly baseUrl_2: string;
  public readonly END_POINT: any;

  constructor(private http: HttpClient,

  ) {
    this.baseUrl_2 = environment.baseUrl_2;
    this.END_POINT = apiUrl;
  }

  addIntegration(payload: any): Observable<Integration> {
    return this.http.post<Integration>(`${this.baseUrl_2}${this.END_POINT.integration}`, payload)
  }

  getIntegration(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.baseUrl_2}${this.END_POINT.integration}`)
  }

  editIntegration(payload: any, id: string): Observable<Integration> {
    return this.http.put<Integration>(`${this.baseUrl_2}${this.END_POINT.integration}/${id}`, payload)
  }

  statusIntegration(id: string, status: boolean): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl_2}${this.END_POINT.integration}/${id}`, { status })
  }

  deleteIntegration(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl_2}${this.END_POINT.integration}/${id}`)
  }
}
