import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    console.log('Interceptor Token:', token); // 👈 Thêm log kiểm tra

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    console.log('Request Headers:', authReq.headers); // 👈 Thêm log kiểm tra

    return next.handle(authReq).pipe(
      catchError((error) => {
        console.error('Interceptor Error:', error); // 👈 Thêm log kiểm tra
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          const newToken = res.accessToken;
          localStorage.setItem('accessToken', newToken);
          this.refreshTokenSubject.next(newToken);

          return next.handle(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            })
          );
        }),
        catchError((err) => {
          this.isRefreshing = false;
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) =>
          next.handle(
            request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            })
          )
        )
      );
    }
  }
}
