import { Injectable, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { apiUrl } from './apiUrl';
import { TokenService } from '@core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  static getHeadersWithOutToken() {
    throw new Error('Method not implemented.');
  }
  protected readonly http = inject(HttpClient);
  public readonly inventory_url: string;
  public readonly END_POINT: any;
  private storage: any = localStorage;

  constructor(private token: TokenService) {
    this.inventory_url = environment.inventory_url;
    this.END_POINT = apiUrl;
  }

  getToken() {
    const token = JSON.parse(this.storage.getItem('currentUser')).data;
    console.log(token, "TOKEN IN COMMON");

    return token.token;
  }

  uploadImage(img: any, thumbnail: any): Observable<any> {
    const headers = this.getHeadersWithToken();
    const formData = new FormData();
    formData.append('image', img);
    formData.append('thumbnail', thumbnail);
    formData.append('type', 'image');
    return this.http.post(`${this.inventory_url}${this.END_POINT.upload}`, formData, { headers });
  }

  // Method to get platformId TO make the Panal 
  getPlatformId(): string | null {
    return localStorage.getItem('platformId');
  }

  getHeadersWithOutToken(): HttpHeaders {
    const platformId = this.getPlatformId();
    return new HttpHeaders({
      'platformId': platformId || '',
    });
  }

  getHeadersWithToken(): HttpHeaders {
    const platformId = this.getPlatformId();
    return new HttpHeaders({
      'platformId': platformId || '',
      Authorization: `Bearer ${this.token.getTokenFromLocalStorage() ? this.token.getTokenFromLocalStorage() : null}`
    })
  }
}
