import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

interface AuthPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  signUp(payload: AuthPayload) {
    return this.http.post(`${environment.apiUrl}/auth/sign-up`, payload);
  }

  signIn(payload: AuthPayload) {
    return this.http.post(`${environment.apiUrl}/auth/sign-in`, payload);
  }
}
