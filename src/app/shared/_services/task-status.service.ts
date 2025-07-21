import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TaskStatus {
  _id?: string;
  name: string;
  code?: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {
  constructor(
    private http: HttpClient, 
  ) { }

  getTaskStatus(): Observable<TaskStatus[]> {
    return this.http.get<TaskStatus[]>(`${environment.apiUrl}/task-status`);
  }

  getTaskStatusById(id: string): Observable<TaskStatus> {
    return this.http.get<any>(`${environment.apiUrl}/task-status/${id}`)
      .pipe(
        map(response => response.data || response)
      );
  }

  createTaskStatus(data: TaskStatus): Observable<TaskStatus> {
    const payload = {
      name: data.name,
      color: data.color,
      isActive: data.isActive,
      isDefault: data.isDefault
    };
    return this.http.post<TaskStatus>(`${environment.apiUrl}/task-status`, payload);
  }

  updateTaskStatus(id: string, data: TaskStatus): Observable<TaskStatus> {
    const payload = {
      name: data.name,
      color: data.color,
      isActive: data.isActive,
      isDefault: data.isDefault
    };
    return this.http.put<TaskStatus>(`${environment.apiUrl}/api/v1/task-status/${id}`, payload);
  }
}
