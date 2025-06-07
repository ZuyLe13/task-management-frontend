import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) { }
  
  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  }

  createWorkspace(data: any) {
    return this.http.post(`${environment.apiUrl}/workspace`, data, {
      headers: this.getHeaders()
    })
  }
}
