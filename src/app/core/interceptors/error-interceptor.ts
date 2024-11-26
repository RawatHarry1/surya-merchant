import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum STATUS {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}


@Injectable()
export class ErrorInterceptor {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastrService);
  private snackBar = inject(MatSnackBar)

  private readonly errorPages = [STATUS.FORBIDDEN, STATUS.NOT_FOUND, STATUS.INTERNAL_SERVER_ERROR];

  private getMessage = (error: HttpErrorResponse) => {
    if (error.error?.error?.message) {
      return error.error.error.message;
    }

    if (error.error?.error?.msg) {
      return error.error?.error.msg;
    }

    return `${error.status} ${error.statusText}`;
  };

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next
      .handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (this.errorPages.includes(error.status)) {
      // this.router.navigateByUrl(`/${error.status}`, {
      //   skipLocationChange: true,
      // });
    } else {
      console.error('ERROR', error);
      if (error.status === STATUS.UNAUTHORIZED) {
        this.router.navigateByUrl('/auth/login');
        this.snackBar.open('Session Timeout. Please Login Again.', 'Warning', {
          duration: 3000,
          panelClass: ['warning-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      } else {
        this.toast.error(this.getMessage(error));
      }
    }

    return throwError(() => error);
  }
}
