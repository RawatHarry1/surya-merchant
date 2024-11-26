import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, iif, map, merge, Observable, of, share, switchMap, tap } from 'rxjs';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonService } from '@shared/services/common.service';
import { SettingsService } from '@core/bootstrap/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private domainToken: any;
  private readonly loginService = inject(LoginService);
  private readonly tokenService = inject(TokenService);
  private readonly commonServices = inject(CommonService)
  private readonly settingsService = inject(SettingsService)

  private user$ = new BehaviorSubject<User>({});
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }

  login2(username: string, password: string): Observable<any> {
    const headers = this.commonServices.getHeadersWithOutToken();

    return this.loginService.login2(username, password, headers).pipe(
      map((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.tokenService.setToken(user.data.token);
        localStorage.setItem('platformId', user.data.user._id);
        this.settingsService.initializeSettings();
        return user;
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(null);  // Return a null observable in case of error
      })
    );
  }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.loginService.logout().pipe(
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap(user => this.user$.next(user)));
  }
}
