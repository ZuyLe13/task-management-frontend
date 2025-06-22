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
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = localStorage.getItem('accessToken');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // 👈 Cần thiết khi dùng cookie refresh token
    });
  } else {
    authReq = req.clone({ withCredentials: true });
  }

  return next.handle(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(() => error);
    })
  );
}

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // 👈 Nếu backend cần gửi cookie refreshToken → bật cái này
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          const newToken = res.accessToken;
          localStorage.setItem('accessToken', newToken);
          this.refreshTokenSubject.next(newToken);

          return next.handle(this.addTokenHeader(request, newToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          localStorage.removeItem('accessToken');
          this.authService.signOut(); // 👈 Xử lý logout FE nếu refresh thất bại
          return throwError(() => err);
        })
      );
    } else {
      // Nếu đang trong quá trình refresh → đợi refresh xong rồi retry lại
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }
}
