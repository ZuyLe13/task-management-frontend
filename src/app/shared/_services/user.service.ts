import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) { }

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  }

  getUserProfile() {
    return this.http.get<User>(`${environment.apiUrl}/profile`, {
      withCredentials: true,
      headers: this.getHeaders()
    });
  }

  updateProfile(data: any) {
    return this.http.put<User>(`${environment.apiUrl}/profile`, data, {
      withCredentials: true,
      headers: this.getHeaders()
    });
  }
}
