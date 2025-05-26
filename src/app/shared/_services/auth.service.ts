import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface AuthPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  signUp(payload: AuthPayload) {
    return this.http.post(`${environment.apiUrl}/auth/sign-up`, payload);
  }

  signIn(payload: AuthPayload) {
    return this.http.post<{ accessToken: string }>(`${environment.apiUrl}/auth/sign-in`, payload, {
      withCredentials: true
    });
  }

  signOut() {
    return this.http.post(`${environment.apiUrl}/auth/sign-out`, {}, {
      withCredentials: true
    }).subscribe(() => {
      localStorage.removeItem('accessToken');
      this.router.navigate(['/sign-in']);
    });
  }

  refreshToken() {
    return this.http.post(`${environment.apiUrl}/auth/refresh-token`, {}, {
      withCredentials: true
    });
  }
}
