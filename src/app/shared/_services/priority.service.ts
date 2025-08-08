import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from './task-type.service';

export interface Priority {
  _id?: string;
  name: string;
  code: string;
  level: number;
  color?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  constructor(private http: HttpClient) { }

  getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(`${environment.apiUrl}/priority`);
  }

  getPriorityById(id: string): Observable<ApiResponse<Priority>> {
    return this.http.get<ApiResponse<Priority>>(`${environment.apiUrl}/priority/${id}`);
  }

  createPriority(priority: Priority): Observable<ApiResponse<Priority>> {
    return this.http.post<ApiResponse<Priority>>(`${environment.apiUrl}/priority`, priority);
  }

  updatePriority(id: string, priority: Partial<Priority>): Observable<ApiResponse<Priority>> {
    return this.http.put<ApiResponse<Priority>>(`${environment.apiUrl}/priority/${id}`, priority);
  }

  deletePriority(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/priority/${id}`);
  }
}
