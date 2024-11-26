import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Menu } from '@core';
import { Token, User } from './interface';
import { environment } from '@env/environment';
import { apiUrl } from '@shared/services/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);
  public readonly baseUrl_login: string;
  public readonly END_POINT: any;

  constructor(
  ) {
    this.baseUrl_login = environment.baseUrl_login
    this.END_POINT = apiUrl;
  }

  login2(username: string, password: string, headers?: HttpHeaders): Observable<any> {
    const httpHeaders = headers || new HttpHeaders();

    const requestOptions = {
      headers: httpHeaders
    };
    return this.http.post<any>(`${this.baseUrl_login}${this.END_POINT.login}`, { username, password }, requestOptions);
  }

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    localStorage.clear();
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    return this.http.get<User>('/me');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));
  }
}